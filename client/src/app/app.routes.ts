import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { TermsComponent } from './pages/terms/terms.component';
import { ProductComponent } from './pages/product/product.component';

export const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'produse', component: ProductsComponent},
  {path:'termeni-si-conditii', component: TermsComponent},
  {path:'produs', component: ProductComponent}
];
