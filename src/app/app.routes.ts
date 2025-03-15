import { Routes } from '@angular/router';
import { TaskManagementComponent } from './components/task-management/task-management.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'gestion-tareas' },
    {
        path: 'gestion-tareas',
        component: TaskManagementComponent
    }
];
