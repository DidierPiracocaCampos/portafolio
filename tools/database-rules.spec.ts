import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { readFile } from 'node:fs/promises';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';

let testEnvironment: RulesTestEnvironment;

const submissionPath = 'contactSubmissions/-Abc123456789012345';

const validSubmission = () => ({
  name: 'Ana Example',
  email: 'ana@example.com',
  message: 'Hello from the contact form.',
  createdAt: Date.now(),
});

describe('Realtime Database contact rules', () => {
  beforeAll(async () => {
    const rules = await readFile(new URL('../database.rules.json', import.meta.url), 'utf8');

    testEnvironment = await initializeTestEnvironment({
      projectId: 'portafolio-rules-test',
      database: {
        rules,
        host: '127.0.0.1',
        port: 9000,
      },
    });
  });

  beforeEach(async () => {
    await testEnvironment.clearDatabase();
  });

  afterAll(async () => {
    await testEnvironment.cleanup();
  });

  it('allows an anonymous valid creation but denies reading it', async () => {
    const database = testEnvironment.unauthenticatedContext().database();

    await assertSucceeds(database.ref(submissionPath).set(validSubmission()));
    await assertFails(database.ref(submissionPath).once('value'));
  });

  it('denies incomplete submissions', async () => {
    const database = testEnvironment.unauthenticatedContext().database();

    await assertFails(
      database.ref(submissionPath).set({
        name: 'Ana Example',
        email: 'ana@example.com',
        createdAt: Date.now(),
      }),
    );
  });

  it('denies extra properties', async () => {
    const database = testEnvironment.unauthenticatedContext().database();

    await assertFails(
      database.ref(submissionPath).set({
        ...validSubmission(),
        honeypot: 'unexpected',
      } as never),
    );
  });

  it('denies overwrites and deletes', async () => {
    const database = testEnvironment.unauthenticatedContext().database();

    await assertSucceeds(database.ref(submissionPath).set(validSubmission()));
    await assertFails(database.ref(submissionPath).set(validSubmission()));
    await assertFails(database.ref(submissionPath).remove());
  });

  it('denies writes outside the contact submissions path', async () => {
    const database = testEnvironment.unauthenticatedContext().database();

    await assertFails(database.ref('other-data').set({ value: true }));
  });

  it('denies oversized messages', async () => {
    const database = testEnvironment.unauthenticatedContext().database();

    await assertFails(
      database.ref(submissionPath).set({
        ...validSubmission(),
        message: 'x'.repeat(2001),
      }),
    );
  });

  it('denies invalid email format', async () => {
    const database = testEnvironment.unauthenticatedContext().database();

    await assertFails(
      database.ref(submissionPath).set({
        ...validSubmission(),
        email: 'not-an-email',
      }),
    );
  });
});
