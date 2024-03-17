import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';
import { ShortSession } from './sesion.types';

@Injectable()
export class SessionApiService {
  private readonly firestore = inject(Firestore);

  async getUserSessions(userId?: string): Promise<ShortSession[]> {
    if (!userId) {
      throw Error('user id is required');
    }

    const collectionRef = collection(this.firestore, 'sessions');
    const collectionQuery = query(collectionRef, where('ownerId', '==', userId));
    const snapshot = await getDocs(collectionQuery);

    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as ShortSession[];
  }
}