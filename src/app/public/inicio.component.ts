import { SharedModule } from 'src/app/core/shared/shared.module';
import { Component, OnInit } from '@angular/core';
import { InicioService } from './inicio.service';
import { FuncionesGeneralesService} from 'src/app/core/funciones-generales.services';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import * as AOS from 'aos';
import * as Parallax from 'parallax-js'
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarAsistenciaComponent } from './confirmar-asistencia/confirmar-asistencia.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  providers: [InicioService],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  imports: [SharedModule, MatButtonModule, MatMenuModule, CarouselModule]
})
export class InicioComponent implements OnInit {
  hide: boolean = true;
  loading: boolean = false;

  date: any;
  now: any = new Date().getTime();
  targetDate: any = new Date(2025, 1, 15, 16, 0, 0);
  targetTime: any = this.targetDate.getTime();
  difference: number = 0;
  tiempoRestante: any = {
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0
  };

  mostrarIcoSecciones = false;

  existeCoordenadas = this.funcionesGenerales.translate('Inicio.ceremonia.coordenadas');

  fechaActual = new Date();

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  };

  listaFotos: any = [
    { src: '/assets/imgs/IMG_9518.JPG', position: 'center'},
    {  src: '/assets/imgs/IMG_9501.JPG', position: 'center'},
    {  src: '/assets/imgs/IMG_9511.JPG', position: 'center'},
    { src: '/assets/imgs/IMG_9383.JPG', position: 'center'},
    {  src: '/assets/imgs/IMG_9402.JPG', position: 'center'},
    { src: '/assets/imgs/IMG_9410.JPG', position: 'center'},
    {  src: '/assets/imgs/IMG_9507.JPG', position: 'center'},
    {  src: '/assets/imgs/IMG_9436.JPG', position: 'center'},
    { src: '/assets/imgs/IMG_9514.JPG', position: 'bottom'},
  ];


  constructor(
    private funcionesGenerales: FuncionesGeneralesService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    AOS.init();
    const scene: any = document.getElementById('nombres');
    const parallaxInstance = new Parallax(scene);

    this.listaFotos.forEach((e: any, i: number) => {
      e.id = i + 1;
    });
  }

  ngAfterViewInit() {
    // Configurar un intervalo para actualizar el tiempo restante cada segundo
    setInterval(() => {
      this.calculateTimeRemaining();
    }, 1000);
  }

  calculateTimeRemaining() {
    const now = new Date().getTime(); // Obtener la hora actual en milisegundos
    const difference = this.targetTime - now; // Calcular la diferencia en milisegundos

    console.log('Hora actual:', new Date(now).toISOString());
    console.log('Hora objetivo:', new Date(this.targetTime).toISOString());
    console.log('Diferencia en milisegundos:', difference);

    if (difference > 0) {
      const seconds = Math.floor((difference / 1000) % 60);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));

      // Asignar los valores calculados
      this.tiempoRestante = {
        dias: days,
        horas: hours,
        minutos: minutes,
        segundos: seconds,
      };
    } else {
      // El tiempo se ha agotado
      this.tiempoRestante = {
        dias: 0,
        horas: 0,
        minutos: 0,
        segundos: 0,
      };
    }
  }

  addToAppleCalendar() {
    const icsContent = `
      BEGIN:VCALENDAR
      VERSION:2.0
      BEGIN:VEVENT
      SUMMARY: ${this.funcionesGenerales.translate('Inicio.ceremonia.tituloCalendario')}
      DESCRIPTION: ${this.funcionesGenerales.translate('Inicio.ceremonia.detalleCalendario')}
      DTSTART: ${this.funcionesGenerales.translate('Inicio.ceremonia.inicioCalendario')}
      DTEND: ${this.funcionesGenerales.translate('Inicio.ceremonia.finCalendario')}
      LOCATION: ${this.existeCoordenadas && this.existeCoordenadas != '' ? this.existeCoordenadas : this.funcionesGenerales.translate('Inicio.ceremonia.ubicacionCalendario')}
      END:VEVENT
      END:VCALENDAR
    `;
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'evento.ics';
    link.click();
  }

  addToGoogleCalendar() {
    const title = this.funcionesGenerales.translate('Inicio.ceremonia.tituloCalendario');
    const description = this.funcionesGenerales.translate('Inicio.ceremonia.detalleCalendario');
    const startDate = this.funcionesGenerales.translate('Inicio.ceremonia.inicioCalendario');
    const endDate = this.funcionesGenerales.translate('Inicio.ceremonia.finCalendario');
    const location = this.existeCoordenadas && this.existeCoordenadas != '' ? this.existeCoordenadas : this.funcionesGenerales.translate('Inicio.ceremonia.ubicacionCalendario');
    const timezone = this.funcionesGenerales.translate('Inicio.ceremonia.zonaHoraria');

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&ctz=${timezone}`;

    window.open(url, '_blank');
  }

  addToMicrosoftCalendar() {
    const title = this.funcionesGenerales.translate('Inicio.ceremonia.tituloCalendario');
    const description = this.funcionesGenerales.translate('Inicio.ceremonia.detalleCalendario');
    const startDate = this.funcionesGenerales.translate('Inicio.ceremonia.inicioCalendarioMicrosoft');
    const endDate = this.funcionesGenerales.translate('Inicio.ceremonia.finCalendarioMicrosoft');
    const location = this.existeCoordenadas && this.existeCoordenadas != '' ? this.existeCoordenadas : this.funcionesGenerales.translate('Inicio.ceremonia.ubicacionCalendario');

    const url = `https://outlook.live.com/calendar/0/deeplink/compose?startdt=${startDate}&enddt=${endDate}&subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

    window.open(url, '_blank');
  }

  abrirWaze() {
    const url = `https://waze.com/ul?ll=${this.funcionesGenerales.translate('Inicio.ceremonia.latitud')},${this.funcionesGenerales.translate('Inicio.ceremonia.longitud') }&navigate=yes`;
    window.open(url, '_blank');
  }

  abrirGoogleMaps() {
    const url = `https://www.google.com/maps/search/?api=1&query=${this.funcionesGenerales.translate('Inicio.ceremonia.latitud')},${this.funcionesGenerales.translate('Inicio.ceremonia.longitud') }`;
    window.open(url, '_blank');
  }

  abrirPinterest(sexo: string){
    const url = this.funcionesGenerales.translate(`Inicio.codigoVestuario.${sexo}`);
    window.open(url, '_blank');
  }

  verFormulario(){
    this.dialog.open(ConfirmarAsistenciaComponent, { autoFocus: false });
  }

}
