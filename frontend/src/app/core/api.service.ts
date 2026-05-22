import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Booking, Listing, PropertyType, User } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  googleAuth(credential: string): Observable<{ access_token: string; user: User }> {
    return this.http.post<{ access_token: string; user: User }>(`${this.base}/auth/google`, {
      credential,
    });
  }

  me(): Observable<User> {
    return this.http.get<User>(`${this.base}/auth/me`);
  }

  becomeHost(): Observable<User> {
    return this.http.post<User>(`${this.base}/auth/become-host`, {});
  }

  getListings(filters?: {
    city?: string;
    property_type?: PropertyType;
    min_price?: number;
    max_price?: number;
    guests?: number;
    q?: string;
  }): Observable<Listing[]> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          params = params.set(k, String(v));
        }
      });
    }
    return this.http.get<Listing[]>(`${this.base}/listings`, { params });
  }

  getFeatured(): Observable<Listing[]> {
    return this.http.get<Listing[]>(`${this.base}/listings/featured`);
  }

  getListing(id: number): Observable<Listing> {
    return this.http.get<Listing>(`${this.base}/listings/${id}`);
  }

  createListing(data: Partial<Listing> & { amenities: string[] }): Observable<Listing> {
    return this.http.post<Listing>(`${this.base}/listings`, data);
  }

  myListings(): Observable<Listing[]> {
    return this.http.get<Listing[]>(`${this.base}/listings/mine/all`);
  }

  createBooking(data: {
    listing_id: number;
    check_in: string;
    check_out: string;
    guests: number;
  }): Observable<Booking> {
    return this.http.post<Booking>(`${this.base}/bookings`, data);
  }

  myBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.base}/bookings/mine`);
  }
}
