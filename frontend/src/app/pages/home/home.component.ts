import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Listing } from '../../core/models';
import { SeoService } from '../../core/seo.service';
import { ListingCardComponent } from '../../shared/listing-card/listing-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FormsModule, ListingCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private api = inject(ApiService);
  private seo = inject(SeoService);
  private router = inject(Router);
  featured: Listing[] = [];
  searchCity = '';
  searchGuests = 2;

  destinations = [
    {
      city: 'Recife',
      count: '120+',
      image: 'https://images.unsplash.com/photo-1583417319070-4a522ec8710b?w=600&q=80',
    },
    {
      city: 'Olinda',
      count: '80+',
      image: 'https://images.unsplash.com/photo-1578895101408-1a66356b86c4?w=600&q=80',
    },
    {
      city: 'Porto de Galinhas',
      count: '95+',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
    },
    {
      city: 'Caruaru',
      count: '45+',
      image: 'https://images.unsplash.com/photo-1596436889106-be68e8434434?w=600&q=80',
    },
  ];

  ngOnInit(): void {
    this.seo.update({
      title: 'Hotéis e Pousadas em Pernambuco',
      description:
        'Reserve hotéis, pousadas e apartamentos em Recife, Olinda, Porto de Galinhas e todo Pernambuco.',
    });
    this.api.getFeatured().subscribe({
      next: (d) => (this.featured = d),
      error: () => (this.featured = []),
    });
  }

  search(): void {
    const q: Record<string, string> = {};
    if (this.searchCity) q['city'] = this.searchCity;
    if (this.searchGuests) q['guests'] = String(this.searchGuests);
    this.router.navigate(['/hospedagens'], { queryParams: q });
  }
}
