import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Booking } from '../../core/models';
import { SeoService } from '../../core/seo.service';
import { environment } from '../../../environments/environment';

declare const google: {
  accounts: { id: { initialize: (c: object) => void; renderButton: (el: HTMLElement, c: object) => void } };
};

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss',
})
export class BookingsComponent implements OnInit {
  auth = inject(AuthService);
  private api = inject(ApiService);
  private seo = inject(SeoService);
  bookings: Booking[] = [];

  ngOnInit(): void {
    this.seo.update({ title: 'Reservas', path: '/minhas-reservas' });
    if (this.auth.isLoggedIn()) {
      this.api.myBookings().subscribe({
        next: (b) => (this.bookings = b),
        error: () => (this.bookings = []),
      });
    } else {
      setTimeout(() => this.initGoogle(), 500);
    }
  }

  initGoogle(): void {
    if (!environment.googleClientId) return;
    const el = document.getElementById('google-btn-bookings');
    if (!el || typeof google === 'undefined') return;
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (r: { credential: string }) => this.auth.loginWithGoogle(r.credential),
    });
    google.accounts.id.renderButton(el, { theme: 'outline', size: 'large', locale: 'pt-BR' });
  }
}
