import { Database } from '@angular/fire/database';
import {
  push as firebasePush,
  ref as firebaseRef,
  serverTimestamp as firebaseServerTimestamp,
  set as firebaseSet,
} from 'firebase/database';

export const contactDb = {
  ref: (database: Database, path: string) => firebaseRef(database, path),
  push: (reference: ReturnType<typeof firebaseRef>) => firebasePush(reference),
  serverTimestamp: () => firebaseServerTimestamp(),
  set: (reference: ReturnType<typeof firebasePush>, value: unknown) =>
    firebaseSet(reference, value as never),
};
