import { Component } from '@angular/core';
import { ToasterModule, ToasterService, ToasterConfig } from 'angular2-toaster';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public toasterconfig: ToasterConfig = new ToasterConfig({
    tapToDismiss: true,
    timeout: 5000
  });

  constructor() {
  }
}
