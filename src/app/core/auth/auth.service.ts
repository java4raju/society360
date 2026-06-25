import { Injectable, signal, computed } from '@angular/core';
import { User } from '../../shared/models/models';

const STORAGE_KEY = 'society360_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSignal = signal<User | null>(this.readStored());
  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.userSignal() !== null);

  private readStored(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'admin') {
      const user: User = {
        username: 'admin',
        name: 'Aravind Menon',
        role: 'Society Administrator',
        email: 'admin@society360.in'
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      this.userSignal.set(user);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.userSignal.set(null);
  }
}
