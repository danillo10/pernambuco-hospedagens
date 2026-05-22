import { DecimalPipe, SlicePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Listing, PROPERTY_LABELS } from '../../core/models';

@Component({
  selector: 'app-listing-card',
  standalone: true,
  imports: [RouterLink, DecimalPipe, SlicePipe],
  templateUrl: './listing-card.component.html',
  styleUrl: './listing-card.component.scss',
})
export class ListingCardComponent {
  @Input({ required: true }) listing!: Listing;
  labels = PROPERTY_LABELS;
}
