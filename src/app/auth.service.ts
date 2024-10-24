// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  _id: string;
  name: string;
  email: string;
  abteilung?: string;
  role?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  name: string;
  email: string;
  abteilung?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000';
  private readonly STORAGE_KEY = 'currentUser';
  private userSubject: BehaviorSubject<User | null>;

  constructor(private http: HttpClient) {
    const storedUser = this.getStoredUser();
    this.userSubject = new BehaviorSubject<User | null>(storedUser);
  }

  login(name: string, email: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { name, email })
      .pipe(
        tap(response => {
          if (response.success) {
            const user: User = {
              _id: response.name, // oder eine andere ID falls verfügbar
              name: response.name,
              email: response.email,
              abteilung: response.abteilung,
              role: response.role
            };
            this.setUser(user);
          }
        })
      );
  }

  getStoredUser() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const user = localStorage.getItem('user');
      if (user) {
        return JSON.parse(user);
      }
    }
    return null;
  }

  setUser(user: User | null): void {
    if (user) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.STORAGE_KEY);
    }
    this.userSubject.next(user);
  }

  getUser(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  getCurrentUser(): User | null {
    return this.userSubject.getValue();
  }

  logout(): void {
    this.setUser(null);
  }

  isLoggedIn(): boolean {
    return this.userSubject.getValue() !== null;
  }

  getUserRole(): string | undefined {
    const user = this.userSubject.getValue();
    return user?.role;
  }

  hasRole(expectedRole: string | string[]): boolean {
    const userRole = this.getUserRole();
    if (!userRole) {
      return false;
    }

    if (Array.isArray(expectedRole)) {
      return expectedRole.includes(userRole);
    }
    return userRole === expectedRole;
  }

  register(userData: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/accounts`, userData);
  }

  updateUser(userData: Partial<User>): Observable<User> {
    const currentUser = this.getCurrentUser();
    if (!currentUser?._id) {
      throw new Error('Kein Benutzer angemeldet');
    }
    
    return this.http.put<User>(`${this.apiUrl}/accounts/${currentUser._id}`, userData)
      .pipe(
        tap(response => {
          if (currentUser) {
            const updatedUser = { ...currentUser, ...userData };
            this.setUser(updatedUser);
          }
        })
      );
  }

  hasPermission(permission: string): boolean {
    const userRole = this.getUserRole();
    if (!userRole) {
      return false;
    }

    const rolePermissions: Record<string, string[]> = {
      'admin': ['create', 'read', 'update', 'delete'],
      'user': ['read', 'create'],
      'support': ['read', 'update']
    };

    return userRole in rolePermissions && 
           rolePermissions[userRole].includes(permission);
  }
}