import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';

export type AppSession = {
  id: string;
  ownerId: string;
  name: string;
};

export type ShortAppSession = Pick<AppSession, 'name' | 'ownerId' | 'id'>;

@Injectable()
export class SessionsApiService {
  private readonly firestore = inject(Firestore);

  async getUserSessions(userId?: string): Promise<ShortAppSession[]> {
    if (!userId) {
      throw Error('user id is required');
    }

    const collectionRef = collection(this.firestore, 'sessions');
    const collectionQuery = query(collectionRef, where('ownerId', '==', userId));
    const snapshot = await getDocs(collectionQuery);

    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as ShortAppSession[];
  }
}
