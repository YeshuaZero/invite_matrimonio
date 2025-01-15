import { SharedModule } from 'src/app/core/shared/shared.module';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PanelService } from '../panel.service';
import { FuncionesGeneralesService, TipoEnum} from 'src/app/core/funciones-generales.services';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MatDialog } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { ConfirmarAsistenciaComponent } from 'src/app/public/web-bodas/confirmar-asistencia/confirmar-asistencia.component';
import { MatTabsModule } from '@angular/material/tabs';
import { CrearNuevoInvitadoComponent } from './crear-nuevo/crear-nuevo.component';
import { distinctUntilChanged, Subscription } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { getAuth, signInAnonymously } from "firebase/auth";
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin',
    standalone: true,
    providers: [PanelService],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [SharedModule, MatButtonModule, MatMenuModule, CarouselModule, MatStepperModule, ConfirmarAsistenciaComponent, MatTabsModule]
})
export class AdminComponent implements OnInit, OnDestroy {

  id: string;
  listaUsuarios: any = [];
  
  loading: boolean = true;
  
  mostrarCompletado: boolean = false;

  columnas = ['email', 'pass', 'id', 'idAcceso', 'fechaUltimoLogueo', 'estadoUsuario', 'opciones'];

  opcionesTabla: any = [
    { id: 1, icono: 'fas fa-eye', nombre: 'Ver Web' },
    { id: 2, icono: 'fab fa-whatsapp', nombre: 'Enviar WhatsApp' },
    { id: 3, icono: 'fas fa-user-check', nombre: 'Activar Usuario' },
    { id: 4, icono: 'fas fa-user-times', nombre: 'Inactivar Usuario' },
    { id: 5, icono: 'fas fa-user-edit', nombre: 'Editar' }
  ];

  listaEstados: any = [
    `<i class="icoEstado fas fa-user-check"></i>
    <span>Activo</span>`,
    `<i class="icoEstado fas fa-user-times"></i>
    <span class="noAsiste">Inactivo</span>`,
  ]

  private subscriptions = new Subscription();

  readonly breakpoint$ = this.breakpointObserver
    .observe(['(min-width: 680px)', '(min-width: 750px)','(min-width: 1000px)', '(min-width: 1150px)','(min-width: 1320px)'])
    .pipe(
      distinctUntilChanged()
    );
  
  indexOpciones = 5;

  constructor(
    private funcionesGenerales: FuncionesGeneralesService,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private panelService: PanelService,
    private readonly router: Router,
    private location: Location
  ) {
    this.id = this.funcionesGenerales.getData('id');
  }

  ngOnInit(): void {
    this.consultarData();

    this.subscriptions.add(this.breakpoint$.subscribe(() => {
      if (this.breakpointObserver.isMatched('(max-width: 680px)')) {
        this.columnas = ['email', 'pass', 'estadoUsuario', 'opciones'];
        this.indexOpciones = 3;
      } else if (this.breakpointObserver.isMatched('(max-width: 750px)')) {
        this.columnas = ['email', 'pass', 'fechaUltimoLogueo', 'estadoUsuario', 'opciones'];
        this.indexOpciones = 4;
      } else if (this.breakpointObserver.isMatched('(max-width: 1000px)')) {
        this.columnas = ['id', 'email', 'pass', 'celular', 'fechaUltimoLogueo', 'estadoUsuario', 'opciones'];
        this.indexOpciones = 6;
      } else if (this.breakpointObserver.isMatched('(max-width: 1150px)')) {
        this.columnas = ['id', 'email', 'pass', 'celular', 'idAcceso', 'fechaUltimoLogueo', 'estadoUsuario', 'opciones'];
        this.indexOpciones = 7;
      } else if (this.breakpointObserver.isMatched('(max-width: 1320px)')) {
        this.columnas = ['id', 'email', 'pass', 'celular', 'fechaUltimoLogueo', 'estadoUsuario', 'opciones'];
        this.indexOpciones = 6;
      } else {
        this.columnas = ['id', 'email', 'pass', 'celular', 'idAcceso', 'fechaUltimoLogueo', 'estadoUsuario', 'opciones'];
        this.indexOpciones = 7;
      }
    }));
  }

  private isPageReloaded(): boolean {
    const navigationType = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return navigationType.type === 'reload';
  }

  consultarData() {
    const auth = getAuth();
    signInAnonymously(auth)
      .then(() => {
    this.panelService.getData(`users`).then((resp: any) => {
      if (resp){
        const listaUsuarios = this.listarInvitados(resp);
        this.listaUsuarios = listaUsuarios.map((e:any) => {
          e.estadoUsuario = e.activo ? this.listaEstados[0] : this.listaEstados[1];
          if (e.activo) e[`Activar UsuarioOcultar`] = true;
          if (!e.activo) e[`Inactivar UsuarioOcultar`] = true;
          if (!e.celular) e[`Enviar WhatsAppOcultar`] = true;
          return e;
        });
        this.loading = false;
      }
    });
    });
  }

  listarInvitados(obj: any): any[] {
      return Object.entries(obj).map(([id, data]) => ({
        idAcceso: id,
        ...(typeof data === 'object' ? data : {}),
      }));
  }

  opcionTablaSeleccionada(tipoOpcion: any) {
    if (tipoOpcion.id == 1) {
      this.verWeb(tipoOpcion.filaSeleccionada);
    } else if (tipoOpcion.id == 2) {
      this.enviarWhatsApp(tipoOpcion.filaSeleccionada);
    } else if (tipoOpcion.id == 3 || tipoOpcion.id == 4) {
      this.activarInactivarUsuario(tipoOpcion.filaSeleccionada);
    } else if (tipoOpcion.id == 5) {
      this.editarUsuario(tipoOpcion.filaSeleccionada);
    } 
  }

  verWeb(e:any){
    const urlBase = window.location.origin;
    window.open(`${urlBase}/boda/${e.id}`, '_blank');
  }

  enviarWhatsApp(e: any){
    const urlWhatsApp = `https://wa.me/${e.celular}`;
    window.open(urlWhatsApp, '_blank');
  }

  activarInactivarUsuario(e:any){
      this.panelService.saveData(`users/${e.idAcceso}/activo`, !e.activo)
        .then((resp) => {
          e.activo = !e.activo;
          e.estadoUsuario = e.activo ? this.listaEstados[0] : this.listaEstados[1];
          e[`Activar UsuarioOcultar`] = e.activo;
          e[`Inactivar UsuarioOcultar`] = !e.activo;
        }).catch((error) => {
          this.funcionesGenerales.openDialog('Panel.admin.guardadoNoConfirmado','Panel.admin.guardadoNoConfirmadoDesc',TipoEnum.WARNING);
        });
  }

  editarUsuario(e: any) {
    const crearEditar = this.dialog.open(CrearNuevoInvitadoComponent, { autoFocus: false, disableClose: true, data: { id: e.id, usuario: e } });

    crearEditar.afterClosed().subscribe(result => {
      this.consultarData();
    });
  }

  crearNuevo(){
    const crearEditar = this.dialog.open(CrearNuevoInvitadoComponent, { autoFocus: false, disableClose: true });
    
    crearEditar.afterClosed().subscribe(result => {
      this.consultarData();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
