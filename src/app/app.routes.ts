import { RouterModule, Router, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { HomeComponent } from './home/home.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes:Routes = [
    {
        path: "",
        component: HomeComponent,
        pathMatch: "full"
    },
    {
        path: "home",
        component: HomeComponent
    },
    {
        path: "welcome",
        component: WelcomeComponent
    },
    {
        path: "**",
        component: HomeComponent
    }
];

@NgModule({
    imports:[ RouterModule.forRoot(routes) ],
    exports:[ RouterModule ] 
})
export class AppRoutingModule {}
