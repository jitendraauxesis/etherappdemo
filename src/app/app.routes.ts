import { RouterModule, Router, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { HomeComponent } from './home/home.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { UserhomeComponent } from './userhome/userhome.component';
import { UserhomecsvdetailComponent } from './userhomecsvdetail/userhomecsvdetail.component';
import { TransactionhistoryComponent } from './transactionhistory/transactionhistory.component';
import { SettingsComponent } from './settings/settings.component';
import { HistorydetailComponent } from './historydetail/historydetail.component';

const routes:Routes = [
    /**
     * CAS urls
     */
    {
        path: "",
        component: UserhomeComponent,
        pathMatch: "full",
        data: { title: 'Home | CAS Distributor' }
    },
    {
        path: "home",
        component: UserhomeComponent,
        data: { title: 'Home | CAS Distributor' }
    },
    {
        path: "welcome",
        component: WelcomeComponent,
        data: { title: 'Home | CAS Distributor' }
    },
    {
        path: "csv/detail",
        component: UserhomecsvdetailComponent,
        data: { title: 'CSV Detail | CAS Distributor' }
    },
    {
        path: "history",
        component: TransactionhistoryComponent,
        data: { title: 'History | CAS Distributor' }
    },
    {
        path: "history/view/:id",
        component: HistorydetailComponent,
        data: { title: 'History | CAS Distributor' }
    },
    {
        path: "settings",
        component: SettingsComponent,
        data: { title: 'Settings | CAS Distributor' }
    },
    {
        path: "**",
        component: UserhomeComponent,
        data: { title: 'Home | CAS Distributor' }
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
