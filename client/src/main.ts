import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import localeRo from '@angular/common/locales/ro';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeRo)

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
