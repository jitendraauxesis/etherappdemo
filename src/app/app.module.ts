import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpModule, Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routes';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { Ng2Webstorage } from 'ngx-webstorage';
import * as solc from 'solc';
import { LoadingModule } from 'ngx-loading';
import { ANIMATION_TYPES } from 'ngx-loading';
import {CdkTableModule} from '@angular/cdk/table';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';

import { MywebService } from './service/myweb.service';
import { MycryptoService } from './service/mycrypto.service';
import { CasService } from './service/cas.service';
import { FileUtilService } from './interfaces/file-util.service';
import { ConstantsService } from './interfaces/constants.service';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { UserhomeComponent } from './userhome/userhome.component';
import { UserhomemodelComponent } from './userhomemodel/userhomemodel.component';
import { UserhomecsvdetailComponent } from './userhomecsvdetail/userhomecsvdetail.component';
import { UserhomesinglemodelComponent } from './userhomesinglemodel/userhomesinglemodel.component';
import { TransactionhistoryComponent } from './transactionhistory/transactionhistory.component';
import { SettingsComponent } from './settings/settings.component';



@NgModule({
  exports: [
    CdkTableModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  declarations: []
})
export class DemoMaterialModule {}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WelcomeComponent,
    NavbarComponent, UserhomeComponent,
    UserhomemodelComponent,
    UserhomecsvdetailComponent,
    UserhomesinglemodelComponent,
    TransactionhistoryComponent,
    SettingsComponent
  ],
  entryComponents: [
    UserhomemodelComponent,
    UserhomesinglemodelComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule, ReactiveFormsModule,
    RouterModule, AppRoutingModule,
    BrowserAnimationsModule,
    DemoMaterialModule,MatNativeDateModule,
    Ng2Webstorage,
    LoadingModule.forRoot({
      animationType: ANIMATION_TYPES.wanderingCubes,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)', 
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff', 
      secondaryColour: '#ffffff', 
      tertiaryColour: '#ffffff'
  })
  ],
  providers: [
    {
      provide:LocationStrategy,
      useClass:HashLocationStrategy
    }, 
    MywebService,
    MycryptoService,
    CasService,
    FileUtilService,
    ConstantsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
