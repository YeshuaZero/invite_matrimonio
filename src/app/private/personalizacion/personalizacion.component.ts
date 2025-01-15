import { SharedModule } from 'src/app/core/shared/shared.module';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PanelService } from '../panel.service';
import { FuncionesGeneralesService, TipoEnum } from 'src/app/core/funciones-generales.services';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { WebBodasComponent } from "../../public/web-bodas/web-bodas.component";
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { VistaPreviaWebComponent } from '../vista-previa-web/vista-previa-web.component';

@Component({
  selector: 'app-personalizacion',
  standalone: true,
  providers: [PanelService],
  templateUrl: './personalizacion.component.html',
  styleUrls: ['./personalizacion.component.css'],
  imports: [SharedModule, MatButtonModule, MatMenuModule, CarouselModule, WebBodasComponent, MatStepperModule, MatDatepickerModule, NgxMatDatetimePickerModule, NgxMatTimepickerModule, MatCheckboxModule, MatRadioModule, NgxMatFileInputModule]
})
export class PersonalizacionComponent implements OnInit, OnDestroy {

  id: string;
  dataWeb: any = {};
  copiaDataWeb: any = {};
  listaIds = ['', '', 'encabezadoId', 'ceremoniaId', 'fiestaId', 'galeriaId', 'codigoVestuarioId', 'regalosId', 'confirmacionAsistenciaId', 'recuerdosId'];

  listaFotosGaleria: any = [];
  selectImagen: any;

  loading: any = {
    titulos: false,
    encabezado: false,
    ceremonia: false,
    fiesta: false,
    fotos: false,
    codigoVestuario: false,
    regalos: false,
    confirmacionInvitados: false,
    recuerdos: false
  };

  dataIniciada = false;

  saveObs = new Subject<any>();
  private subscriptions = new Subscription();

  constructor(
    public readonly funcionesGenerales: FuncionesGeneralesService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private panelService: PanelService
  ) {
    this.id = this.funcionesGenerales.getData('id');
    this.dataWeb = this.funcionesGenerales.getData('t0k3nD1g1t4lM0m3nt5', true);
    this.copiaDataWeb = this.funcionesGenerales.getData('t0k3nD1g1t4lM0m3nt5', true);
    this.dataWeb.WebBodas.fecha = new Date(this.dataWeb.WebBodas.fechaBoda);
    this.dataWeb.WebBodas.ceremonia.fechaInicio = new Date(this.dataWeb.WebBodas.ceremonia.inicioCalendarioMicrosoft);
    this.dataWeb.WebBodas.fiesta.fechaInicio = new Date(this.dataWeb.WebBodas.fiesta.inicioCalendarioMicrosoft);
    console.log('this.dataWeb:', this.dataWeb)
  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    if (this.isPageReloaded()) {
      this.consultarData();
    }
    this.consultarImagenes();

    this.subscriptions.add(this.saveObs.pipe(debounceTime(500)).subscribe((data: any) => {
      this.guardar(data.seccion, data.seccionLoading);
    }));
  }

  private isPageReloaded(): boolean {
    const navigationType = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return navigationType.type === 'reload';
  }

  consultarData() {
    this.panelService.getData(`dataWeb/${this.id}`).then((resp: any) => {
      console.log('resp:', resp);
      this.dataWeb = resp;
      this.funcionesGenerales.setData('t0k3nD1g1t4lM0m3nt5', this.dataWeb, true);
      this.copiaDataWeb = this.funcionesGenerales.getData('t0k3nD1g1t4lM0m3nt5', true);
    });
  }

  consultarImagenes() {
    this.panelService.getFiles(`${this.id}/galeriaFotos`).subscribe((urls: any) => {
      console.log('URLs de los archivos:', urls);
      this.listaFotosGaleria = urls;
      setTimeout(() => {
        this.dataIniciada = true;
      }, 1000)
    });
  }

  cambioFiesta() {
    if (this.dataWeb.WebBodas.fiesta.fiestaAparte) setTimeout(() => this.scroll('fiestaId'), 200);
    this.guardarDataWeb('fiesta', 'fiestaAparte');
  }

  agregarColor(tipoColor: any) {
    let indexAgregar = 1;
    for (let i = 1; i <= 6; i++) {
      if (!this.dataWeb.WebBodas.codigoVestuario[`${tipoColor}${i}`]) {
        indexAgregar = i;
        break;
      }
    }
    this.dataWeb.WebBodas.codigoVestuario[`${tipoColor}${indexAgregar}`] = '#000';
    this.guardar(`${tipoColor}${indexAgregar}`, 'codigoVestuario');
  }

  quitarColor(tipoColor: any) {
    let indexQuitar = 6;
    for (let i = 6; i > 0; i--) {
      if (this.dataWeb.WebBodas.codigoVestuario[`${tipoColor}${i}`]) {
        indexQuitar = i;
        break;
      }
    }
    this.dataWeb.WebBodas.codigoVestuario[`${tipoColor}${indexQuitar}`] = null;
    this.guardar(`${tipoColor}${indexQuitar}`, 'codigoVestuario');
  }

  onStepChange(event: StepperSelectionEvent) {
    console.log('event:', event)
    const elementId = this.listaIds[event.selectedIndex];
      this.scroll(elementId);
  }

  scroll(elementId: any, margen?: any) {
    if (elementId) this.funcionesGenerales.scroll(elementId, false, 'screen', elementId == 'fiestaId' ? 100 : margen);
  }

  saveData(seccion: string, seccionLoading?: string){
    this.saveObs.next({ seccion, seccionLoading });
  }

  cargarArchivo(file: any, nombre: string, seccionLoading: string) {
    this.loading[seccionLoading] = true;
    if (file) {
      const filePath = nombre == 'fotoGaleria' ? `${this.id}/galeriaFotos/${file.name}` : `${this.id}/${nombre}`;
      this.panelService.uploadFile(filePath, file).subscribe((url) => {
        console.log('url:', url)
        this.loading[seccionLoading] = false;
        switch (nombre) {
          case 'imgPrincipal':
            this.dataWeb.WebBodas.encabezado.imgEncabezado = url;
            this.guardarDataWeb('encabezado', 'imgEncabezado', 'encabezado');
            break;
          case 'imgFondo':
            this.dataWeb.WebBodas.recuerdos.imgFondo = url;
            this.guardarDataWeb('recuerdos', 'imgFondo', 'recuerdos');
            break;
          case 'fotoGaleria':
            this.selectImagen = null;
            this.listaFotosGaleria.push({
              path: `${this.id}/galeriaFotos/${file.name}`,
              url
            });
            break;
          default:
            break;
        }
      });
    }
  }

  guardarDataWeb(seccion: string, atributo?: string, seccionLoading?: string): void {
    if (seccionLoading) this.loading[seccionLoading] = true;

    let path: string;
    let dataToSave: any;
    if (atributo) {
      path = `dataWeb/${this.id}/WebBodas/${seccion}/${atributo}`;
      console.log('this.dataWeb:', this.dataWeb)
      console.log('this.dataWeb.WebBodas:', this.dataWeb.WebBodas)
      console.log('seccion:', seccion)
      console.log('atributo:', atributo)
      console.log('this.dataWeb.WebBodas[seccion]:', this.dataWeb.WebBodas[seccion])
      dataToSave = this.dataWeb.WebBodas[seccion][atributo];
      console.log('dataToSave:', dataToSave)
    } else if (seccion) {
      path = `dataWeb/${this.id}/WebBodas/${seccion}`;
      dataToSave = this.dataWeb.WebBodas[seccion];
    } else {
      path = `dataWeb/${this.id}/WebBodas`;
      dataToSave = this.dataWeb.WebBodas;
    }

console.log('wntro')
    if (!atributo || !seccion || this.dataWeb.WebBodas[seccion][atributo] !== this.copiaDataWeb.WebBodas[seccion][atributo]) {
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

  guardar(atributo: string, seccionLoading?: string): void {
    if (seccionLoading) this.loading[seccionLoading] = true;

    let path: string;
    let dataToSave: any;
    if (atributo) {
      path = `dataWeb/${this.id}/ConfigApp/${atributo}`;
      dataToSave = this.dataWeb.ConfigApp[atributo];
    } else {
      path = `dataWeb/${this.id}/ConfigApp`;
      dataToSave = this.dataWeb.ConfigApp;
    }


    if (!atributo || this.dataWeb.ConfigApp[atributo] !== this.copiaDataWeb.ConfigApp[atributo]) {
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

  eliminarImagen(img: any, index: any){
    this.panelService.deleteFile(img.path).then((resp) => {
      console.log('resp:', resp)
      this.listaFotosGaleria.splice(index, 1);
    });
  }

  verWeb() {
    this.dialog.open(VistaPreviaWebComponent, { autoFocus: false, disableClose: true, data: { dataWeb: this.dataWeb, listaFotosGaleria: this.listaFotosGaleria } });
  }

  cambioEstiloBase(){
    console.log('this.dataWeb.ConfigApp.estilosBase:', this.dataWeb.ConfigApp.estilosBase)
  }

}
