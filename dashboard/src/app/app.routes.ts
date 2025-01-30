import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { LoggedOutGuard } from '../guards/logged-out.guard';
import { ForgotComponent } from './pages/auth/forgot/forgot.component';
import { ResetComponent } from './pages/auth/reset/reset.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from '../guards/auth.guard';
import { AddProductComponent } from './pages/dashboard/add-product/add-product.component';
import { ProductsComponent } from './pages/dashboard/products/products.component';
import { ProductComponent } from './pages/dashboard/product/product.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';

export const routes: Routes = [
    { path: '', component: AuthComponent,
      children: [
        { path: '', redirectTo: 'login', pathMatch:'full'},
        { path: 'login', component: LoginComponent, canActivate:[LoggedOutGuard]},
        { path: 'forgot', component: ForgotComponent, canActivate:[LoggedOutGuard]},
        { path: 'reset-password', component: ResetComponent, canActivate:[LoggedOutGuard]}
      ]
    },
    {
      path: 'dashboard', component: DashboardComponent,
      children: [
        { path:'', redirectTo:'products', pathMatch:'full'},
        { path:'add-new-product', component: AddProductComponent, canActivate:[AuthGuard]},
        { path:'products', component: ProductsComponent, canActivate:[AuthGuard]},
        { path:'product', component: ProductComponent, canActivate: [AuthGuard] },
        { path:'edit-product', component: EditProductComponent, canActivate: [AuthGuard]}
      ]
    }
];
