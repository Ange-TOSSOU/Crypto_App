import { Routes } from '@angular/router';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SigninComponent } from './pages/signin/signin.component';
import { LoginComponent } from './pages/login/login.component';
import { AppComponent } from './app.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/dashboard",
        pathMatch: 'full'
    },
    {
        path: "signin",
        component: SigninComponent
    },
    {
        path:"login",
        component: LoginComponent
    },
    {
        path:"dashboard",
        component: DashboardComponent,
        ...canActivate(redirectUnauthorizedToLogin)
    },
    {
        path: '**',
        redirectTo: '/dashboard'
    }
];
