import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Listing, PROPERTY_LABELS, PropertyType } from '../../core/models';
import { SeoService } from '../../core/seo.service';
import { environment } from '../../../environments/environment';

declare const google: {
  accounts: { id: { initialize: (c: object) => void; renderButton: (el: HTMLElement, c: object) => void } };
};

@Component({
  selector: 'app-host',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, RouterLink],
  templateUrl: './host.component.html',
  styleUrl: './host.component.scss',
})
export class HostComponent implements OnInit {
  auth = inject(AuthService);
  private api = inject(ApiService);
  private seo = inject(SeoService);
  private router = inject(Router);

  labels = PROPERTY_LABELS;
  types = Object.keys(PROPERTY_LABELS) as PropertyType[];
  myListings: Listing[] = [];
  success = '';

  form = {
    title: '',
    description: '',
    property_type: 'pousada' as PropertyType,
    city: '',
    neighborhood: '',
    address: '',
    price_per_night: 150,
    max_guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    amenitiesText: 'Wi-Fi, Ar-condicionado',
    image_url: '',
  };

  ngOnInit(): void {
    this.seo.update({
      title: 'Anunciar hospedagem',
      description: 'Cadastre hotel, pousada, apartamento ou quarto em Pernambuco gratuitamente.',
      path: '/anunciar',
    });
    if (this.auth.isLoggedIn()) {
      this.loadMine();
    }
    setTimeout(() => this.initGoogle(), 500);
  }

  initGoogle(): void {
    if (!environment.googleClientId || this.auth.isLoggedIn()) return;
    const el = document.getElementById('google-btn-host');
    if (!el || typeof google === 'undefined') return;
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (r: { credential: string }) => this.auth.loginWithGoogle(r.credential),
    });
    google.accounts.id.renderButton(el, { theme: 'filled_blue', size: 'large', locale: 'pt-BR' });
  }

  loadMine(): void {
    this.api.myListings().subscribe({
      next: (d) => (this.myListings = d),
      error: () => (this.myListings = []),
    });
  }

  submit(): void {
    if (!this.auth.isLoggedIn()) {
      alert('Entre com Google para cadastrar.');
      return;
    }
    const amenities = this.form.amenitiesText.split(',').map((s) => s.trim()).filter(Boolean);
    this.api
      .createListing({
        ...this.form,
        amenities,
      } as Parameters<ApiService['createListing']>[0])
      .subscribe({
        next: () => {
          this.success = 'Hospedagem cadastrada com sucesso!';
          this.loadMine();
          this.form.title = '';
          this.form.description = '';
        },
        error: (e) => (this.success = e.error?.detail || 'Erro ao cadastrar.'),
      });
  }
}
