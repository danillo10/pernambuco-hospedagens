import { Component, HostListener, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { environment } from '../../../environments/environment';

declare const google: {
  accounts: {
    id: {
      initialize: (config: object) => void;
      renderButton: (el: HTMLElement, config: object) => void;
    };
  };
};

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  auth = inject(AuthService);
  menuOpen = false;
  scrolled = false;

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 50;
  }

  ngAfterViewInit(): void {
    if (!environment.googleClientId) return;
    const el = document.getElementById('google-btn-header');
    if (!el || typeof google === 'undefined') return;
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (r: { credential: string }) => this.auth.loginWithGoogle(r.credential),
    });
    google.accounts.id.renderButton(el, {
      theme: 'outline',
      size: 'medium',
      text: 'signin_with',
      locale: 'pt-BR',
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}
