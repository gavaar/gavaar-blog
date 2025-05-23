import { Injectable, signal } from '@angular/core';
import { GoogleAuthProvider, User, getAuth, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { auth } from '@app/firebase';

@Injectable({ providedIn: 'root' })
export class AuthClient {
  user = signal<User | null>(null);

  constructor() {
    onAuthStateChanged(getAuth(), user => this.user.set(user));
  }

  login(): void {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  }

  logout(): void {
    const auth = getAuth();
    if (confirm('Sure?')) auth.signOut();
  }
}
