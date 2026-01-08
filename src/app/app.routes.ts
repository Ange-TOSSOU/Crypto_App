import { Routes } from '@angular/router';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { AppComponent } from './app.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['signin']);

export const routes: Routes = [
    {
        path: "",
        component: DashboardComponent
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
    }
];
