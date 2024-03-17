import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';

export type AppUser = {
  id: string;
  authId: string;
  name: string;
  avatarURL: string;
};

@Injectable()
export class UsersApiService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);

  async getUser(): Promise<AppUser | null> {
    const authId = this.auth.currentUser?.uid;
    const collectionRef = collection(this.firestore, 'users');
    const collectionQuery = query(collectionRef, where('authId', '==', authId));
    const snapshot = await getDocs(collectionQuery);
    const users = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as AppUser[];

    if (!users[0]) {
      throw new Error('User is not found');
    }

    return users[0];
  }
  async updateUser() {

  }
  async deleteUser() {

  }
  async createUser() {

  }
}
