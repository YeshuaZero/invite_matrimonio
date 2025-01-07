import { SharedModule } from 'src/app/core/shared/shared.module';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { InfoPrincipalComponent } from "./info-principal/info-principal.component";
import { InvitadosComponent } from "./invitados/invitados.component";
import { PersonalizacionComponent } from "./personalizacion/personalizacion.component";
import { Router } from '@angular/router';

@Component({
    selector: 'app-panel',
    standalone: true,
    providers: [],
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.css'],
    imports: [SharedModule, MatSidenavModule, MatButtonModule, MatMenuModule, CarouselModule, InfoPrincipalComponent, InvitadosComponent, PersonalizacionComponent]
})
export class PanelComponent {

  fechaActual = new Date();
  component: string = 'infoPrincipal';

  constructor(
    public dialog: MatDialog,
    private readonly router: Router
  ) {
  }

  abrir(component: string){
    this.component = component;
  }

  cerrarSesion(){
    this.router.navigate(['/']);
  }

}
