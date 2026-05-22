import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-culture',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './culture.component.html',
  styleUrl: './culture.component.scss',
})
export class CultureComponent implements OnInit {
  private seo = inject(SeoService);

  items = [
    { icon: 'fa-music', title: 'Frevo', text: 'Patrimônio UNESCO e alma do carnaval.' },
    { icon: 'fa-diamond', title: 'Maracatu', text: 'Cortejos e reinados do interior.' },
    { icon: 'fa-sun-o', title: 'Praias', text: 'Porto de Galinhas, Carneiros, Boa Viagem.' },
    { icon: 'fa-cutlery', title: 'Gastronomia', text: 'Bolo de rolo, cartola, tapioca.' },
    { icon: 'fa-star', title: 'Carnaval', text: 'Galos, blocos e frevo nas ruas.' },
    { icon: 'fa-paint-brush', title: 'Artesanato', text: 'Cerâmica, renda e feira de Caruaru.' },
  ];

  ngOnInit(): void {
    this.seo.update({ title: 'Cultura', path: '/cultura' });
  }
}
