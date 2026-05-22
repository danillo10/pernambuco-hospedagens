import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { User } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'pe_token';
  private readonly USER_KEY = 'pe_user';

  user = signal<User | null>(this.loadUser());
  isLoggedIn = computed(() => !!this.user());

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  loginWithGoogle(credential: string): void {
    this.api.googleAuth(credential).subscribe({
      next: (res) => {
        localStorage.setItem(this.TOKEN_KEY, res.access_token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
        this.user.set(res.user);
        this.router.navigate(['/']);
      },
      error: () => alert('Erro ao entrar com Google. Verifique a configuração do Client ID.'),
    });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.user.set(null);
    this.router.navigate(['/']);
  }

  refreshMe(): void {
    if (!this.token) return;
    this.api.me().subscribe({
      next: (u) => {
        localStorage.setItem(this.USER_KEY, JSON.stringify(u));
        this.user.set(u);
      },
      error: () => this.logout(),
    });
  }
}
