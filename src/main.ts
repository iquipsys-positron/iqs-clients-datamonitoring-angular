import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { SHELL_RUNTIME_CONFIG, ShellModuleConfig } from 'iqs-libs-clientshell2-angular';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

fetch('./config.json')
  .then((response) => response.json())
  .then((config: ShellModuleConfig) => {
    if (environment.production) {
      enableProdMode();
    }
    platformBrowserDynamic(
      [{ provide: SHELL_RUNTIME_CONFIG, useValue: config }]
    )
      .bootstrapModule(AppModule)
      .catch((err) => console.error(err));
  });
