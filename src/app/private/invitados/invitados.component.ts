import { SharedModule } from 'src/app/core/shared/shared.module';
import { Component } from '@angular/core';
import { PanelService } from '../panel.service';
import { FuncionesGeneralesService, TipoEnum} from 'src/app/core/funciones-generales.services';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { ConfirmarAsistenciaComponent } from 'src/app/public/web-bodas/confirmar-asistencia/confirmar-asistencia.component';
import { MatTabsModule } from '@angular/material/tabs';
import { CrearNuevoInvitadoComponent } from './crear-nuevo/crear-nuevo.component';

@Component({
    selector: 'app-invitados',
    standalone: true,
    providers: [PanelService],
    templateUrl: './invitados.component.html',
    styleUrls: ['./invitados.component.css'],
  imports: [SharedModule, MatButtonModule, MatMenuModule, CarouselModule, MatStepperModule, ConfirmarAsistenciaComponent, MatTabsModule]
})
export class InvitadosComponent {

  id: string;
  dataWeb: any = {};
  copiaDataWeb: any = {};
  
  loading: any = {
    listaInvitados: false,
    configuracion: false
  };
  
  mostrarCompletado: boolean = false;

  columnas = ['nombre', 'celular', 'grupo', 'estadoInvitacion', 'infoAdicional', 'opciones'];

  opcionesTabla: any = [
    { id: 0, icono: 'fas fa-comment-alt', nombre: 'Ver Info Adicional' },
    { id: 1, icono: 'fab fa-whatsapp', nombre: 'Enviar WhatsApp' },
    { id: 2, icono: 'fas fa-user-edit', nombre: 'Editar' },
    { id: 3, icono: 'fas fa-user-times', nombre: 'Eliminar' }
  ];

  listaEstados: any = [
    `<i class="icoEstado fas fa-user-clock"></i>
    <span>Pendiente</span>`,
    `<i class="icoEstado fas fa-user-check"></i>
    <span class="confirmado">Confirmado</span>`,
    `<i class="icoEstado fas fa-user-times"></i>
    <span class="noAsiste">No Asiste</span>`,
  ]

  constructor(
    private funcionesGenerales: FuncionesGeneralesService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private panelService: PanelService
  ) {
    this.id = this.funcionesGenerales.getData('id');
    this.dataWeb = this.funcionesGenerales.getData('t0k3nD1g1t4lM0m3nt5', true);
    this.copiaDataWeb = this.funcionesGenerales.getData('t0k3nD1g1t4lM0m3nt5', true);
  }

  ngOnInit(): void {
    if (this.isPageReloaded()) {
      this.consultarData();
    }

  }

  private isPageReloaded(): boolean {
    const navigationType = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return navigationType.type === 'reload';
  }

  consultarData() {
    this.panelService.getData(`dataWeb/${this.id}/Invitados`).then((resp: any) => {
      this.dataWeb.Invitados = {
        configuracion: resp.configuracion
      };
      if (resp.listaInvitados){
        const listaInvitados = this.listarInvitados(resp.listaInvitados);
        this.dataWeb.Invitados.listaInvitados = listaInvitados.map((e:any) => {
          e.estadoInvitacion = this.listaEstados[e.estado];
          if (!e.infoAdicional) e[`Ver Info AdicionalOcultar`] = true;
          if (!e.celular) e[`Enviar WhatsAppOcultar`] = true;
          return e;
        });

        this.dataWeb.Invitados.listaInvitadosPendientes = listaInvitados.filter((e: any) => e.estado == 0);
        this.dataWeb.Invitados.listaInvitadosConfirmados = listaInvitados.filter((e: any) => e.estado == 1);
        this.dataWeb.Invitados.listaInvitadosRechazados = listaInvitados.filter((e: any) => e.estado == 2);
      }


      this.dataWeb = { ...this.dataWeb };
      console.log('this.dataWeb.Invitados:', this.dataWeb.Invitados)
      this.funcionesGenerales.setData('t0k3nD1g1t4lM0m3nt5', this.dataWeb, true);
      this.copiaDataWeb = this.funcionesGenerales.getData('t0k3nD1g1t4lM0m3nt5', true);
    });
  }

  listarInvitados(obj: any): any[] {
      return Object.entries(obj).map(([id, data]) => ({
        id,
        ...(typeof data === 'object' ? data : {}),
      }));
  }

  saveData(seccion: string, atributo?: string, seccionLoading?: string): void {
    if (seccionLoading) this.loading[seccionLoading] = true;

    let path: string;
    let dataToSave: any;
    if (atributo) {
      path = `dataWeb/${this.id}/Invitados/${seccion}/${atributo}`;
      dataToSave = this.dataWeb.Invitados[seccion][atributo];
    } else if (seccion) {
      path = `dataWeb/${this.id}/Invitados/${seccion}`;
      dataToSave = this.dataWeb.Invitados[seccion];
    } else {
      path = `dataWeb/${this.id}/Invitados`;
      dataToSave = this.dataWeb.Invitados;
    }

    if (!atributo || !seccion || this.dataWeb.Invitados[seccion][atributo] !== this.copiaDataWeb.Invitados[seccion][atributo]) {
      this.panelService.saveData(path, dataToSave)
        .then((resp) => {
          console.log('Info guardada exitosamente.', resp);
          this.funcionesGenerales.setData('t0k3nD1g1t4lM0m3nt5', this.dataWeb, true);
          this.copiaDataWeb = this.funcionesGenerales.getData('t0k3nD1g1t4lM0m3nt5', true);
        })
        .catch((error) => {
          console.error('Error al guardar los datos:', error);
          this.dataWeb = this.funcionesGenerales.getData('t0k3nD1g1t4lM0m3nt5', true);
          this.funcionesGenerales.openDialog(
            'Panel.infoPrincipal.guardadoNoConfirmado',
            'Panel.infoPrincipal.guardadoNoConfirmadoDesc',
            TipoEnum.WARNING
          );
        })
        .finally(() => {
          if (seccionLoading) this.loading[seccionLoading] = false;
        });
    } else if (seccionLoading) {
      this.loading[seccionLoading] = false;
    }
  }

  opcionTablaSeleccionada(tipoOpcion: any) {
    if (tipoOpcion.id == 0) {
      this.funcionesGenerales.openDialog(`${tipoOpcion.filaSeleccionada.nombre} ${this.funcionesGenerales.translate('Panel.invitados.dice')}`, tipoOpcion.filaSeleccionada.infoAdicional, TipoEnum.INFO);
    } else if (tipoOpcion.id == 1) {
      this.enviarWhatsApp(tipoOpcion.filaSeleccionada);
    } else if (tipoOpcion.id == 2) {
      this.editarInvitado(tipoOpcion.filaSeleccionada);
    } else if (tipoOpcion.id == 3) {
      this.eliminarInvitado(tipoOpcion.filaSeleccionada);
    }
  }

  enviarWhatsApp(e: any){
    const urlWhatsApp = `https://wa.me/${e.celular}`;
    const url = `https://wa.me/${e.celular}?text=${encodeURIComponent(this.funcionesGenerales.translate('dataApp'))}`;
    window.open(urlWhatsApp, '_blank');
  }

  editarInvitado(e: any) {
    const crearEditar = this.dialog.open(CrearNuevoInvitadoComponent, { autoFocus: false, disableClose: true, data: { id: this.id, dataWeb: this.dataWeb, invitado: e } });

    crearEditar.afterClosed().subscribe(result => {
      this.consultarData();
    });
  }

  eliminarInvitado(e: any) { 
    const dialogPregunta = this.funcionesGenerales.openDialog(`Panel.invitados.preguntaEliminar`, `Panel.invitados.preguntaEliminarDetalle`, TipoEnum.DELETE);

    dialogPregunta.afterClosed().subscribe((result: any) => {
      if (result) {
        this.confirmarEliminarInvitado(e);
      }
    });
  }

  confirmarEliminarInvitado(e: any) {
    this.panelService.eliminarInvitado(`dataWeb/${this.id}/Invitados/listaInvitados`, e.id).then(() => {
      this.funcionesGenerales.openDialog('Panel.invitados.invitadoEliminadoOK', 'Panel.invitados.invitadoEliminadoOKDetalle', TipoEnum.OK);
      this.consultarData();
    }, () => {
      this.funcionesGenerales.openDialog('Panel.invitados.invitadoEliminadoError', 'Panel.invitados.invitadoEliminadoErrorDetalle', TipoEnum.ERROR);
    });
  }

  crearNuevo(){
    const crearEditar = this.dialog.open(CrearNuevoInvitadoComponent, { autoFocus: false, disableClose: true, data: { id: this.id, dataWeb: this.dataWeb } });
    
    crearEditar.afterClosed().subscribe(result => {
      this.consultarData();
    });
  }

  
}
