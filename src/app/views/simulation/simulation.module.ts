import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { SelectModule } from 'ng-select';

// DataTable
import { DataTableModule } from 'angular2-datatable';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable'

// Routing
import { SimulationRoutingModule } from './simulation.routing';
import { MapEntityService } from 'app/data/modelservices';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown/bs-dropdown.module';
import { ModalModule } from 'ngx-bootstrap/modal/modal.module';
import { TabsModule } from 'ngx-bootstrap/tabs/tabs.module';
import { SimulationComponent } from 'app/views/simulation/simulation.component';
import { BsDatepickerModule, TimepickerModule } from 'ngx-bootstrap';
import { Ng5SliderModule } from 'ng5-slider';

//
@NgModule({
    imports: [
        SimulationRoutingModule,
        CommonModule,
        DataTableModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        NgxDatatableModule,
        BsDropdownModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TimepickerModule.forRoot(),
        ModalModule.forRoot(),
        TabsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyC_bfCU1S_SpJlOHzWh7pIycWgukTKxaQA'
          }),
        SelectModule,
        Ng5SliderModule
    ],
    declarations: [
        SimulationComponent
    ],
    providers: [
        MapEntityService,
    ]
})
export class SimulationModule { }
