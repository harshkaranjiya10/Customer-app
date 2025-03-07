import { Routes } from '@angular/router';
import { CustomersComponent } from './routes/customers/customers.component';
import { PatientComponent } from './routes/patient/patient.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'customers',
        pathMatch: 'full'
    }, 
    {
        path: 'customers',
        component: CustomersComponent
    }, 
    {
        path: 'customers/view/:patient_id',
        component: PatientComponent 
    },
];
