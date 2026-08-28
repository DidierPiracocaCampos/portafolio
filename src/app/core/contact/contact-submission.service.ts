import { Injectable, inject } from '@angular/core';
import { Database } from '@angular/fire/database';
import { contactDb } from './contact-db';

export type ContactSubmission = Readonly<{
  name: string;
  email: string;
  message: string;
}>;

@Injectable({ providedIn: 'root' })
export class ContactSubmissionService {
  private readonly database = inject(Database, { optional: true });

  submit(submission: ContactSubmission): Promise<void> {
    if (!this.database) {
      console.warn(
        '[Contact] Realtime Database no inicializada. Revisa la configuración de Firebase.',
      );
      return Promise.reject(new Error('Database not initialized'));
    }

    try {
      const submissionsRef = contactDb.ref(this.database, 'contactSubmissions');
      const submissionRef = contactDb.push(submissionsRef);

      return contactDb.set(submissionRef, {
        ...submission,
        createdAt: contactDb.serverTimestamp(),
      });
    } catch (error) {
      console.error('[Contact] Error al preparar el envío', error);
      return Promise.reject(error instanceof Error ? error : new Error(String(error)));
    }
  }
}
