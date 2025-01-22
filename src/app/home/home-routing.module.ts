import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { AuthGuard } from '../guard/auth.guard';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', canActivate: [AuthGuard], component: HomeComponent }
    ])],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
