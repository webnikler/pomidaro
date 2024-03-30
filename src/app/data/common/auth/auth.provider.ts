import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { ReplaySubject } from 'rxjs';
import { AuthUser } from './auth.types';

@Injectable()
export class AuthProvider {
  private readonly auth = inject(Auth);
  private readonly authChanges = new ReplaySubject<AuthUser | null>(1);

  get authId() {
    return this.auth.currentUser?.uid;
  }

  get authChanges$() {
    return this.authChanges.asObservable();
  }

  constructor() {
    this.auth.onAuthStateChanged(
      authUser => this.authChanges.next(authUser),
      error => this.authChanges.error(error),
    );
  }

  async signIn() {
    await signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  async signOut() {
    await this.auth.signOut();
  }
}
