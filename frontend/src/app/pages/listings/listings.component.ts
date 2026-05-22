import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { Listing, PROPERTY_LABELS, PropertyType } from '../../core/models';
import { SeoService } from '../../core/seo.service';
import { ListingCardComponent } from '../../shared/listing-card/listing-card.component';

@Component({
  selector: 'app-listings',
  standalone: true,
  imports: [FormsModule, ListingCardComponent, RouterLink],
  templateUrl: './listings.component.html',
  styleUrl: './listings.component.scss',
})
export class ListingsComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private seo = inject(SeoService);
  listings: Listing[] = [];
  labels = PROPERTY_LABELS;
  types = Object.keys(PROPERTY_LABELS) as PropertyType[];

  filters = {
    city: '',
    property_type: '' as PropertyType | '',
    guests: 0,
    q: '',
  };

  ngOnInit(): void {
    this.seo.update({ title: 'Hospedagens', path: '/hospedagens' });
    this.route.queryParams.subscribe((p) => {
      this.filters.city = p['city'] || '';
      this.filters.guests = Number(p['guests']) || 0;
      this.filters.property_type = (p['property_type'] as PropertyType) || '';
      this.filters.q = p['q'] || '';
      this.load();
    });
  }

  load(): void {
    this.api
      .getListings({
        city: this.filters.city || undefined,
        property_type: this.filters.property_type || undefined,
        guests: this.filters.guests || undefined,
        q: this.filters.q || undefined,
      })
      .subscribe({
        next: (d) => (this.listings = d),
        error: () => (this.listings = []),
      });
  }
}
