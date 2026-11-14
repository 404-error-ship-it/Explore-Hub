/**
 * @fileoverview Mock authentication service using localStorage.
 * Handles signup, login, logout, and session persistence.
 */

import { Injectable, signal, computed } from '@angular/core';
import { User, AuthResult } from '../models/user.model';

const SESSION_KEY = 'eg_session_user';
const USERS_KEY = 'eg_registered_users';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  constructor() {
    this.restoreSession();
  }

  private restoreSession(): void {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        this.currentUser.set(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
  }

  signup(name: string, email: string, password: string): AuthResult {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !password) {
      return { success: false, error: 'All fields are required.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const users = this.getRegisteredUsers();
    if (users.find((u) => u.email === trimmedEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const user: User = {
      id: crypto.randomUUID(),
      name: trimmedName,
      email: trimmedEmail,
      password,
      avatar: trimmedName.charAt(0).toUpperCase(),
      joinedAt: new Date().toISOString(),
    };

    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    this.setSession(user);
    return { success: true, user };
  }

  login(email: string, password: string): AuthResult {
    const trimmedEmail = email.trim().toLowerCase();
    const users = this.getRegisteredUsers();
    const user = users.find((u) => u.email === trimmedEmail && u.password === password);

    if (!user) {
      return { success: false, error: 'Invalid email or password.' };
    }

    this.setSession(user);
    return { success: true, user };
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(SESSION_KEY);
  }

  private setSession(user: User): void {
    this.currentUser.set(user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  private getRegisteredUsers(): User[] {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    } catch {
      return [];
    }
  }
}
