import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ListingsComponent } from './pages/listings/listings.component';
import { DetailComponent } from './pages/detail/detail.component';
import { HistoryComponent } from './pages/history/history.component';
import { CultureComponent } from './pages/culture/culture.component';
import { HostComponent } from './pages/host/host.component';
import { BookingsComponent } from './pages/bookings/bookings.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'hospedagens', component: ListingsComponent },
  { path: 'hospedagem/:id', component: DetailComponent },
  { path: 'historia', component: HistoryComponent },
  { path: 'cultura', component: CultureComponent },
  { path: 'anunciar', component: HostComponent },
  { path: 'minhas-reservas', component: BookingsComponent },
  { path: '**', redirectTo: '' },
];
