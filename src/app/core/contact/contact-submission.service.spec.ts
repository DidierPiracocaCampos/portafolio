import { Database } from '@angular/fire/database';
import { TestBed } from '@angular/core/testing';
import { contactDb } from './contact-db';
import { ContactSubmissionService } from './contact-submission.service';

describe('ContactSubmissionService', () => {
  beforeEach(() => {
    vi.spyOn(contactDb, 'ref').mockReturnValue({ path: 'contactSubmissions' } as never);
    vi.spyOn(contactDb, 'push').mockReturnValue({ key: 'generated-key' } as never);
    vi.spyOn(contactDb, 'serverTimestamp').mockReturnValue({ '.sv': 'timestamp' } as never);
    vi.spyOn(contactDb, 'set').mockResolvedValue(undefined as never);

    TestBed.configureTestingModule({
      providers: [
        ContactSubmissionService,
        {
          provide: Database,
          useValue: {},
        },
      ],
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  it('should write a new submission without reading', async () => {
    const service = TestBed.inject(ContactSubmissionService);
    const submission = {
      name: 'Ana Example',
      email: 'ana@example.com',
      message: 'Hello',
    };

    await service.submit(submission);

    expect(contactDb.ref).toHaveBeenCalledWith(expect.anything(), 'contactSubmissions');
    expect(contactDb.push).toHaveBeenCalledWith({ path: 'contactSubmissions' });
    expect(contactDb.serverTimestamp).toHaveBeenCalled();
    expect(contactDb.set).toHaveBeenCalledWith(
      { key: 'generated-key' },
      {
        ...submission,
        createdAt: { '.sv': 'timestamp' },
      },
    );
  });

  it('should propagate write errors', async () => {
    vi.mocked(contactDb.set).mockRejectedValue(new Error('write failed'));
    const service = TestBed.inject(ContactSubmissionService);

    await expect(
      service.submit({
        name: 'Ana Example',
        email: 'ana@example.com',
        message: 'Hello',
      }),
    ).rejects.toThrow('write failed');
  });

  it('should expose only submit and not read methods', () => {
    const service = TestBed.inject(ContactSubmissionService) as unknown as Record<string, unknown>;
    expect(typeof service['submit']).toBe('function');
    expect(service['get']).toBeUndefined();
    expect(service['list']).toBeUndefined();
    expect(service['read']).toBeUndefined();
  });
});
