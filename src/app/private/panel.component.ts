import { SharedModule } from 'src/app/core/shared/shared.module';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { InfoPrincipalComponent } from "./info-principal/info-principal.component";
import { InvitadosComponent } from "./invitados/invitados.component";
import { PersonalizacionComponent } from "./personalizacion/personalizacion.component";
import { Router } from '@angular/router';
import { distinctUntilChanged, Subscription } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
    selector: 'app-panel',
    standalone: true,
    providers: [],
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.css'],
    imports: [SharedModule, MatSidenavModule, MatButtonModule, MatMenuModule, CarouselModule, InfoPrincipalComponent, InvitadosComponent, PersonalizacionComponent]
})
export class PanelComponent implements OnInit, OnDestroy {

  fechaActual = new Date();
  modoDrawer: any = 'side';
  component: string = 'infoPrincipal';

  private subscriptions = new Subscription();

  readonly breakpoint$ = this.breakpointObserver
    .observe(['(min-width: 470px)'])
    .pipe(
      distinctUntilChanged()
    );

  menuAbierto = true;

  constructor(
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.subscriptions.add(this.breakpoint$.subscribe(() => {
      if (this.breakpointObserver.isMatched('(max-width: 470px)')) {
        this.modoDrawer = 'over';
        this.menuAbierto = false;
      } else {
        this.modoDrawer = 'side';
        this.menuAbierto = true;
      }
    }));
  }

  abrir(component: string, drawer: any){
    drawer.close();
    this.component = component;
  }

  cerrarSesion(){
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
