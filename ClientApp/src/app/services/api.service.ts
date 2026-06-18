import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
 
@Injectable({ providedIn: 'root' })
export class ApiService {
  private api = 'http://localhost:5000/api';
  private tokenKey = 'wms_token';
 
  constructor(private http: HttpClient) {}
 
  private getHeaders(): HttpHeaders {
    let h = new HttpHeaders({ 'Content-Type': 'application/json' });
    const t = localStorage.getItem(this.tokenKey);
    if (t) h = h.set('Authorization', `Bearer ${t}`);
    return h;
  }
 
  get<T>(endpoint: string): Observable<T | null> {
    return this.http.get<T>(`${this.api}${endpoint}`, { headers: this.getHeaders() }).pipe(
      catchError(e => { this.handleError(e); return of(null); })
    );
  }
 
  post<T>(endpoint: string, body?: unknown): Observable<T | null> {
    return this.http.post<T>(`${this.api}${endpoint}`, body ?? {}, { headers: this.getHeaders() }).pipe(
      catchError(e => { this.handleError(e); return of(null); })
    );
  }
 
  put<T>(endpoint: string, body?: unknown): Observable<T | null> {
    return this.http.put<T>(`${this.api}${endpoint}`, body ?? {}, { headers: this.getHeaders() }).pipe(
      catchError(e => { this.handleError(e); return of(null); })
    );
  }
 
  delete<T>(endpoint: string): Observable<T | null> {
    return this.http.delete<T>(`${this.api}${endpoint}`, { headers: this.getHeaders() }).pipe(
      catchError(e => { this.handleError(e); return of(null); })
    );
  }
 
  upload<T>(endpoint: string, formData: FormData): Observable<T | null> {
    return this.http.post<T>(`${this.api}${endpoint}`, formData, {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem(this.tokenKey)}` })
    }).pipe(catchError(e => { this.handleError(e); return of(null); }));
  }
 
  login(username: string, password: string): Observable<{token: string} | null> {
    return this.http.post<{token: string}>(`${this.api}/auth/login`, { username, password }).pipe(
      tap(r => { if (r?.token) localStorage.setItem(this.tokenKey, r.token); }),
      catchError(() => of(null))
    );
  }
 
  seed(): Observable<unknown> {
    return this.http.post(`${this.api}/auth/seed`, {}).pipe(catchError(() => of(null)));
  }
 
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
 
  get token(): string { return localStorage.getItem(this.tokenKey) || ''; }
  get isLoggedIn(): boolean { return !!this.token; }
 
  private handleError(e: any): void {
    if (e.status === 401) this.logout();
  }
}