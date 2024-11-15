import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

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
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api';
  private readonly STORAGE_KEY = 'currentUser';
  private userSubject: BehaviorSubject<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = this.getStoredUser();
    this.userSubject = new BehaviorSubject<User | null>(storedUser);
  }

  // Login function with role-based navigation
  login(name: string, email: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { name, email }).pipe(
      tap(response => {
        if (response.success) {
          const user: User = {
            _id: response.name,
            name: response.name,
            email: response.email,
            abteilung: response.abteilung,
            role: response.role,
          };
          this.setUser(user);
          
          // Redirect based on role
          if (response.role === 'admin') {
            this.router.navigate(['/admin-dashboard']);
          } else if (response.role === 'user') {
            this.router.navigate(['/user-dashboard']);
          } else {
            alert('Unrecognized role');
          }
        } else {
          alert(response.message);
        }
      }),
      catchError(error => {
        console.error('Login failed:', error);
        throw error;
      })
    );
  }

  isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  getStoredUser(): User | null {
    if (this.isLocalStorageAvailable()) {
      const user = localStorage.getItem(this.STORAGE_KEY);
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  setUser(user: User | null): void {
    if (this.isLocalStorageAvailable()) {
      if (user) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.STORAGE_KEY);
      }
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
    this.router.navigate(['/login']);
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
    return Array.isArray(expectedRole)
      ? expectedRole.includes(userRole)
      : userRole === expectedRole;
  }

  register(userData: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/accounts`, userData).pipe(
      tap(() => {
        alert('Registration successful');
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        console.error('Registration failed:', error);
        throw error;
      })
    );
  }

  updateUser(userData: Partial<User>): Observable<User> {
    const currentUser = this.getCurrentUser();
    if (!currentUser?._id) {
      throw new Error('No user logged in');
    }

    return this.http.put<User>(`${this.apiUrl}/accounts/${currentUser._id}`, userData).pipe(
      tap(response => {
        const updatedUser = { ...currentUser, ...userData };
        this.setUser(updatedUser);
      }),
      catchError(error => {
        console.error('Update failed:', error);
        throw error;
      })
    );
  }

  hasPermission(permission: string): boolean {
    const userRole = this.getUserRole();
    if (!userRole) {
      return false;
    }
    const rolePermissions: Record<string, string[]> = {
      admin: ['create', 'read', 'update', 'delete'],
      user: ['read', 'create'],
      support: ['read', 'update'],
    };
    return rolePermissions[userRole]?.includes(permission);
  }

  // auth.service.ts
  getCurrentUserId(): string | null {
    return this.getCurrentUser()?.email || null;  // Use email or any other unique identifier
  }

}
