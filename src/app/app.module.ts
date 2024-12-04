import { LOCALE_ID, NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MyCustomPaginatorIntl } from './core/table/custom-paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { NgIdleModule } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';

registerLocaleData(localeEs, 'es');

moment.locale('es'); // Establece Moment.js en español

// Configura el formato de fecha para incluir ceros en días y meses menores a 10
moment.updateLocale('es', {
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    l: 'DD/MM/YYYY',
    LL: 'D [de] MMMM [de] YYYY',
    ll: 'D [de] MMM [de] YYYY',
    LLL: 'D [de] MMMM [de] YYYY HH:mm',
    lll: 'D [de] MMM [de] YYYY HH:mm',
    LLLL: 'dddd, D [de] MMMM [de] YYYY HH:mm',
    llll: 'ddd, D [de] MMM [de] YYYY HH:mm'
  }
});

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const firebaseConfig = {
  apiKey: "AIzaSyDWsEcMwGa71YR24wiCWpdKKsXAjaZ64w8",
  authDomain: "app-invite-c081e.firebaseapp.com",
  databaseURL: "https://app-invite-c081e-default-rtdb.firebaseio.com",
  projectId: "app-invite-c081e",
  storageBucket: "app-invite-c081e.firebasestorage.app",
  messagingSenderId: "1010992241532",
  appId: "1:1010992241532:web:8ed8c256a9807c53e1e2f9",
  measurementId: "G-XV8J3VCMCH"
};


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    MatNativeDateModule,
    NgxMatNativeDateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgIdleModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideDatabase(() => getDatabase())
  ],
  providers: [
    Keepalive,
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: 'version', useValue: environment.version }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(translate: TranslateService) {
    translate.addLangs(['es-co', 'en']);
    translate.setDefaultLang('es-co');
    translate.use('es-co');
  }
}

