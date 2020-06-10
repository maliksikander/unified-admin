import {AdminMainComponent} from './admin-main/admin-main.component';
import {Routes} from '@angular/router';
export const adminRoutes: Routes = [
    {
        path: '', component: AdminMainComponent,
        children: [
        ]
    }
];
