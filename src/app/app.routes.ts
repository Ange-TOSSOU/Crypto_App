import { Routes } from '@angular/router';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SigninComponent } from './pages/signin/signin.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/dashboard/profile/profile.component';
import { AppComponent } from './app.component';
import { NoAuthGuard } from './shared/services/auth/no-auth-guard';

// const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/dashboard",
        pathMatch: 'full'
    },
    {
        path: "signin",
        // canActivate: [NoAuthGuard],
        component: SigninComponent
    },
    {
        path:"login",
        // canActivate: [NoAuthGuard],
        component: LoginComponent
    },
    {
        path:"dashboard",
        component: DashboardComponent,
        // ...canActivate(redirectUnauthorizedToLogin)
    },
    {
        path:"profile",
        component: ProfileComponent,
        // ...canActivate(redirectUnauthorizedToLogin)
    },
    {
        path: '**',
        redirectTo: '/dashboard'
    }
];
