import { Component, OnInit, ViewChild } from '@angular/core';
import { IOption, SelectComponent } from 'ng-select';
import { CookieService } from 'ngx-cookie-service';
import { View } from 'app/views/view';
import { Injector } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './app-header.component.html'
})
export class AppHeaderComponent extends View implements OnInit {
    @ViewChild('dropdown') dropdown: SelectComponent;

    public controlCenters: Array<IOption> = new Array();
    public username = '';

    constructor(injector: Injector, private cookieService: CookieService, private toasterService: ToasterService, public router: Router) {
        super(injector)
    }

    ngOnInit() {

    }
}
