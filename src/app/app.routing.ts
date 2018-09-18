import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import {
    FullLayoutComponent
} from './containers';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: 'app/simulation',
                pathMatch: 'full',
            },
            {
                path: 'app',
                component: FullLayoutComponent,
                data: {
                    title: 'Home',
                    requiresAuthentication: true
                },
                children: [
                    {
                        path: 'simulation',
                        loadChildren: './views/simulation/simulation.module#SimulationModule'
                    }
                ]
            }]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
