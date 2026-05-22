import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);

  update(options: {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    path?: string;
  }): void {
    const fullTitle = options.title
      ? `${options.title} | ${environment.siteName}`
      : `${environment.siteName} — Hotéis e Pousadas em Pernambuco`;
    this.title.setTitle(fullTitle);

    const desc =
      options.description ||
      'Encontre hotéis, pousadas, apartamentos e quartos em Pernambuco. Reserve com facilidade em Recife, Olinda, Porto de Galinhas e mais.';
    this.meta.updateTag({ name: 'description', content: desc });
    this.meta.updateTag({
      name: 'keywords',
      content:
        options.keywords ||
        'hospedagem pernambuco, pousada recife, hotel olinda, porto de galinhas, airbnb pernambuco, turismo pe',
    });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: desc });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({
      property: 'og:url',
      content: `${environment.siteUrl}${options.path || ''}`,
    });
    if (options.image) {
      this.meta.updateTag({ property: 'og:image', content: options.image });
    }
  }
}
