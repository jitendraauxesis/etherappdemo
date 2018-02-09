import { RouterModule, Router, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { HomeComponent } from './home/home.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { UserhomeComponent } from './userhome/userhome.component';
import { UserhomecsvdetailComponent } from './userhomecsvdetail/userhomecsvdetail.component';
import { TransactionhistoryComponent } from './transactionhistory/transactionhistory.component';
import { SettingsComponent } from './settings/settings.component';

const routes:Routes = [
    /**
     * CAS urls
     */
    {
        path: "",
        component: UserhomeComponent,
        pathMatch: "full"
    },
    {
        path: "home",
        component: UserhomeComponent
    },
    {
        path: "welcome",
        component: WelcomeComponent
    },
    {
        path: "csv/detail",
        component: UserhomecsvdetailComponent
    },
    {
        path: "history",
        component: TransactionhistoryComponent
    },
    {
        path: "settings",
        component: SettingsComponent
    },
    {
        path: "**",
        component: UserhomeComponent
    }
    /**
     * Old urls
     */
    // {
    //     path: "",
    //     component: HomeComponent,
    //     pathMatch: "full"
    // },
    // {
    //     path: "home",
    //     component: HomeComponent
    // },
    // {
    //     path: "welcome",
    //     component: WelcomeComponent
    // },
    // {
    //     path: "**",
    //     component: HomeComponent
    // }
];

@NgModule({
    imports:[ RouterModule.forRoot(routes) ],
    exports:[ RouterModule ] 
})
export class AppRoutingModule {}
