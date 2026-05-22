import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent } from './layout/top-bar/top-bar.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TopBarComponent, HeaderComponent, FooterComponent],
  template: `
    <app-top-bar />
    <app-header />
    <main id="main_content">
      <router-outlet />
    </main>
    <app-footer />
  `,
  styles: [
    `
      #main_content {
        min-height: 50vh;
      }
    `,
  ],
})
export class AppComponent {}
