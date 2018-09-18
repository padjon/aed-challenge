import { ToasterModule, ToasterService } from 'angular2-toaster';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';

// Import containers
import {
    FullLayoutComponent,
    SimpleLayoutComponent
} from './containers';

const APP_CONTAINERS = [
    FullLayoutComponent,
    SimpleLayoutComponent
]

// Import components
import {
    AppAsideComponent,
    AppBreadcrumbsComponent,
    AppFooterComponent,
    AppHeaderComponent,
    AppSidebarComponent,
    AppSidebarFooterComponent,
    AppSidebarFormComponent,
    AppSidebarHeaderComponent,
    AppSidebarMinimizerComponent,
    APP_SIDEBAR_NAV
} from './components';

const APP_COMPONENTS = [
    AppAsideComponent,
    AppBreadcrumbsComponent,
    AppFooterComponent,
    AppHeaderComponent,
    AppSidebarComponent,
    AppSidebarFooterComponent,
    AppSidebarFormComponent,
    AppSidebarHeaderComponent,
    AppSidebarMinimizerComponent,
    APP_SIDEBAR_NAV
]

// Import directives
import {
    AsideToggleDirective,
    NAV_DROPDOWN_DIRECTIVES,
    ReplaceDirective,
    SIDEBAR_TOGGLE_DIRECTIVES
} from './directives';

const APP_DIRECTIVES = [
    AsideToggleDirective,
    NAV_DROPDOWN_DIRECTIVES,
    ReplaceDirective,
    SIDEBAR_TOGGLE_DIRECTIVES
]

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SelectModule } from 'ng-select';
import { ErrorService } from 'app/data/services';
import { APP_INITIALIZER } from '@angular/core';
import { Injector } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core/core.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Ng5SliderModule } from 'ng5-slider';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ChartsModule,
        BsDropdownModule.forRoot(),
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        ToasterModule,
        SelectModule,
        FormsModule,
        HttpClientModule,
        AgmCoreModule.forRoot({
            libraries: ['drawing'],
            apiKey: 'AIzaSyD4vbG6X4RKrvcSu5nrr4SLyaR5KBbpIfE'
        }),
        Ng5SliderModule
    ],
    declarations: [
        AppComponent,
        ...APP_CONTAINERS,
        ...APP_COMPONENTS,
        ...APP_DIRECTIVES
    ],
    providers: [
        CookieService,
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        },
        {
            provide: APP_INITIALIZER,
            useFactory: AppModule.onAppInit,
            multi: true,
            deps: [Injector]
        },
        ErrorService,
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
    private static onAppInit(injector: Injector) {
        return () => {
            return new Promise<void>((resolve, reject) => {
                resolve();
            })
        }
    }
}
