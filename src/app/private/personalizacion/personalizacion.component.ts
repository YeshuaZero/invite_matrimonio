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
  listaIds = ['encabezadoId', 'ceremoniaId', 'fiestaId', 'galeriaId', 'codigoVestuarioId', 'regalosId', 'confirmacionAsistenciaId', 'recuerdosId'];

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
      this.guardar(data.seccion, data.atributo, data.seccionLoading);
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

  cambiaFechaBoda() {
    console.log('this.dataWeb.WebBodas:', this.dataWeb.WebBodas)
    this.dataWeb.WebBodas.fecha = this.dataWeb.WebBodas.fecha instanceof Date ? this.dataWeb.WebBodas.fecha : this.dataWeb.WebBodas.fecha.toDate();
    this.dataWeb.WebBodas.fechaBoda = this.funcionesGenerales.formatearFecha(this.dataWeb.WebBodas.fecha, 'YYYY-MM-ddTHH:mm:ss').toUpperCase();
    this.dataWeb.WebBodas.encabezado.fechaBoda = this.funcionesGenerales.formatearFecha(this.dataWeb.WebBodas.fecha, 'dd.MM.YYYY');
    this.dataWeb.WebBodas.conteoRegresivo.fecha = this.funcionesGenerales.formatearFecha(this.dataWeb.WebBodas.fecha, 'YYYY-MM-ddTHH:mm:ss').toUpperCase();
    this.dataWeb.WebBodas.conteoRegresivo.dia = this.funcionesGenerales.formatearFecha(this.dataWeb.WebBodas.fecha, 'd');
    this.dataWeb.WebBodas.conteoRegresivo.mes = this.funcionesGenerales.formatearFecha(this.dataWeb.WebBodas.fecha, 'MMMM');
    this.dataWeb.WebBodas.conteoRegresivo.year = this.funcionesGenerales.formatearFecha(this.dataWeb.WebBodas.fecha, 'YYYY');

    this.ajustesFecha('ceremonia');
    this.ajustesFecha('fiesta');

    this.guardar('', '', 'encabezado');
    this.dataWeb = { ...this.dataWeb };
  }

  ajustesFecha(seccion: any) {
    this.dataWeb.WebBodas[seccion].fechaInicio = this.dataWeb.WebBodas.fecha;
    this.dataWeb.WebBodas[seccion].fechaFinal = new Date(this.dataWeb.WebBodas.fecha);
    this.dataWeb.WebBodas[seccion].fechaFinal.setHours(this.dataWeb.WebBodas.fecha.getHours() + parseInt(this.dataWeb.WebBodas[seccion].duracion));
    this.dataWeb.WebBodas[seccion].inicioCalendario = this.funcionesGenerales.formatearFecha(this.dataWeb.WebBodas[seccion].fechaInicio, 'YYYYMMddTHHmmss').toUpperCase();
    this.dataWeb.WebBodas[seccion].finCalendario = this.funcionesGenerales.formatearFecha(this.dataWeb.WebBodas[seccion].fechaFinal, 'YYYYMMddTHHmmss').toUpperCase();
    this.dataWeb.WebBodas[seccion].inicioCalendarioMicrosoft = this.funcionesGenerales.formatearFecha(this.dataWeb.WebBodas[seccion].fechaInicio, 'YYYY-MM-ddTHH:mm:ss').toUpperCase();
    this.dataWeb.WebBodas[seccion].finCalendarioMicrosoft = this.funcionesGenerales.formatearFecha(this.dataWeb.WebBodas[seccion].fechaFinal, 'YYYY-MM-ddTHH:mm:ss').toUpperCase();
    this.dataWeb.WebBodas[seccion].datoHora = this.formatearHora(this.dataWeb.WebBodas.fecha);
  }

  cambiaFecha(seccion: any) {
    console.log('this.dataWeb.WebBodas:', this.dataWeb.WebBodas)
    this.dataWeb.WebBodas[seccion].fechaFinal = new Date(this.dataWeb.WebBodas[seccion].fechaInicio);
    this.dataWeb.WebBodas[seccion].fechaFinal.setHours(this.dataWeb.WebBodas[seccion].fechaInicio.getHours() + parseInt(this.dataWeb.WebBodas[seccion].duracion));
    this.dataWeb.WebBodas[seccion].datoHora = this.formatearHora(this.dataWeb.WebBodas[seccion].fechaInicio);
    this.dataWeb.WebBodas[seccion].inicioCalendario = this.funcionesGenerales.formatearFecha(this.dataWeb.WebBodas[seccion].fechaInicio, 'YYYYMMddTHHmmss').toUpperCase();
    this.dataWeb.WebBodas[seccion].finCalendario = this.funcionesGenerales.formatearFecha(this.dataWeb.WebBodas[seccion].fechaFinal, 'YYYYMMddTHHmmss').toUpperCase();
    this.dataWeb.WebBodas[seccion].inicioCalendarioMicrosoft = this.funcionesGenerales.formatearFecha(this.dataWeb.WebBodas[seccion].fechaInicio, 'YYYY-MM-ddTHH:mm:ss').toUpperCase();
    this.dataWeb.WebBodas[seccion].finCalendarioMicrosoft = this.funcionesGenerales.formatearFecha(this.dataWeb.WebBodas[seccion].fechaFinal, 'YYYY-MM-ddTHH:mm:ss').toUpperCase();
    this.saveData(seccion, '', seccion);
    this.dataWeb = { ...this.dataWeb };
  }

  formatearHora(fecha: Date): string {
    const horas = fecha.getHours() % 12 || 12;
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const amPm = fecha.getHours() >= 12 ? 'pm' : 'am';
    return `${horas}:${minutos}${amPm}`;
  }

  cambioLugar(seccion: any) {
    this.dataWeb.WebBodas[seccion].ubicacionCalendario = this.dataWeb.WebBodas[seccion].datoLugar;
    this.saveData(seccion, 'ubicacionCalendario', seccion);
  }

  cambioFiesta() {
    if (this.dataWeb.WebBodas.fiesta.fiestaAparte) setTimeout(() => this.scroll('fiestaId'), 200);
    this.saveData('fiesta', 'fiestaAparte', 'fiesta')
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
    this.guardar('codigoVestuario', `${tipoColor}${indexAgregar}`, 'codigoVestuario');
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
    this.guardar('codigoVestuario', `${tipoColor}${indexQuitar}`, 'codigoVestuario');
  }

  onStepChange(event: StepperSelectionEvent) {
    console.log('event:', event)
    const elementId = this.listaIds[event.selectedIndex];
    this.scroll(elementId);
  }

  scroll(elementId: any) {
    if (elementId) this.funcionesGenerales.scroll(elementId);
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
            this.saveData('encabezado', 'imgEncabezado', 'encabezado');
            break;
          case 'imgFondo':
            this.dataWeb.WebBodas.recuerdos.imgFondo = url;
            this.saveData('recuerdos', 'imgFondo', 'recuerdos');
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

  saveData(seccion: string, atributo?: string, seccionLoading?: string){
    this.saveObs.next({ seccion, atributo, seccionLoading });
  }

  guardar(seccion: string, atributo?: string, seccionLoading?: string): void {
    if (seccionLoading) this.loading[seccionLoading] = true;

    let path: string;
    let dataToSave: any;
    if (atributo) {
      path = `dataWeb/${this.id}/WebBodas/${seccion}/${atributo}`;
      dataToSave = this.dataWeb.WebBodas[seccion][atributo];
    } else if (seccion) {
      path = `dataWeb/${this.id}/WebBodas/${seccion}`;
      dataToSave = this.dataWeb.WebBodas[seccion];
    } else {
      path = `dataWeb/${this.id}/WebBodas`;
      dataToSave = this.dataWeb.WebBodas;
    }


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

  eliminarImagen(img: any, index: any){
    this.panelService.deleteFile(img.path).then((resp) => {
      console.log('resp:', resp)
      this.listaFotosGaleria.splice(index, 1);
    });
  }

}
