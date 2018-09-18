import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SimulationComponent } from 'app/views/simulation/simulation.component';


const routes: Routes = [
  {
    path: '',
    component: SimulationComponent,
    data: {
      title: 'AED Simulation',
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SimulationRoutingModule { }
