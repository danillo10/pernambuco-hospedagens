import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Listing, PROPERTY_LABELS } from '../../core/models';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private seo = inject(SeoService);
  private router = inject(Router);

  listing: Listing | null = null;
  labels = PROPERTY_LABELS;
  checkIn = '';
  checkOut = '';
  guests = 2;
  bookingMsg = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getListing(id).subscribe({
      next: (l) => {
        this.listing = l;
        this.guests = Math.min(2, l.max_guests);
        this.seo.update({
          title: l.title,
          description: l.description.slice(0, 160),
          image: l.image_url,
          path: `/hospedagem/${l.id}`,
        });
      },
      error: () => this.router.navigate(['/hospedagens']),
    });
  }

  reserve(): void {
    if (!this.auth.isLoggedIn()) {
      alert('Faça login com Google para reservar.');
      return;
    }
    if (!this.listing || !this.checkIn || !this.checkOut) {
      this.bookingMsg = 'Preencha as datas.';
      return;
    }
    this.api
      .createBooking({
        listing_id: this.listing.id,
        check_in: new Date(this.checkIn).toISOString(),
        check_out: new Date(this.checkOut).toISOString(),
        guests: this.guests,
      })
      .subscribe({
        next: () => this.router.navigate(['/minhas-reservas']),
        error: (e) => (this.bookingMsg = e.error?.detail || 'Erro ao reservar.'),
      });
  }
}
