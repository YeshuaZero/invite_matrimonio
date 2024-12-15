import { SharedModule } from 'src/app/core/shared/shared.module';
import { Component, HostListener, OnInit } from '@angular/core';
import { InicioService } from './inicio.service';
import { FuncionesGeneralesService} from 'src/app/core/funciones-generales.services';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import * as AOS from 'aos';
import * as Parallax from 'parallax-js'
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarAsistenciaComponent } from './confirmar-asistencia/confirmar-asistencia.component';
import { ActivatedRoute } from '@angular/router';

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

  id: any = '';

  date: any;
  now: any = new Date().getTime();
  targetDate: any;
  targetTime: any;
  difference: number = 0;
  tiempoRestante: any = {
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0
  };

  listaBackground = ['#f7f4ef', '#f9f6e9', '#e5ebf1', '#e2ece9', '#f7f4e9', '#fff7f7', '#f7f1ff'];
  background = '#ffffff';
  listaBackgroundVestuario = ['#f9c7c9', '#ffc69a', '##F8E8A0', '#dbe1bc', '#cfd5b3', '#93b3a7', '#a6c6dd', '#cca3c1'];
  backgroundVestuario = '#e5e0d8';
  listaBackgroundConfirmacion = ['#f9c7c9', '#ffc69a', '##F8E8A0', '#dbe1bc', '#cfd5b3', '#93b3a7', '#a6c6dd', '#cca3c1'];
  backgroundConfirmacion = '#bec092';
  imgPrincipal = '';
  imgSecundaria = '';
  existeCoordenadas = '';
  
  mostrarIcoSecciones = false;

  cantidadColoresSugeridos = 6;
  coloresReservados = true;
  cantidadColoresReservados = 2;


  fechaActual = new Date();

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['<i class="fas fa-chevron-left margin0"></i>', '<i class="fas fa-chevron-right margin0"></i>'],
    responsive: {
      0: {
        items: 1
      },
      500: {
        items: 2
      },
      750: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  };

  listaFotos: any = [
    { src: '/assets/imgs/fotos/1.jpg', position: 'center'},
    {  src: '/assets/imgs/fotos/2.jpg', position: 'center'},
    {  src: '/assets/imgs/fotos/3.jpg', position: 'center'},
    { src: '/assets/imgs/fotos/4.jpg', position: 'center'},
    {  src: '/assets/imgs/fotos/5.jpg', position: 'center'},
    { src: '/assets/imgs/fotos/6.jpg', position: 'center'},
    {  src: '/assets/imgs/fotos/7.jpg', position: 'center'},
    {  src: '/assets/imgs/fotos/8.jpg', position: 'center'},
    { src: '/assets/imgs/fotos/9.jpg', position: 'bottom'},
  ];


  constructor(
    private readonly funcionesGenerales: FuncionesGeneralesService,
    private readonly inicioService: InicioService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id') ? `${params.get('id')}.` : null; 
      this.id = this.id ?? 'yeshua_&_ana.';
      console.log(this.id);
    });
  }

  ngOnInit() {
    this.background = this.funcionesGenerales.translate(this.id + 'ConfigApp.colorFondo');
    this.backgroundVestuario = this.funcionesGenerales.translate(this.id + 'ConfigApp.colorFondoVestuario');
    this.backgroundConfirmacion = this.funcionesGenerales.translate(this.id + 'ConfigApp.colorFondoConfirmacion');
    this.imgPrincipal = this.funcionesGenerales.translate(this.id + 'Inicio.encabezado.imgEncabezado');
    this.imgSecundaria = this.funcionesGenerales.translate(this.id + 'Inicio.encabezado.imgSecundaria');
    this.existeCoordenadas = this.funcionesGenerales.translate(this.id + 'Inicio.ceremonia.coordenadas');
    this.listaFotos.forEach((e: any, i: number) => {
      e.id = i + 1;
    });

    this.targetDate = new Date(this.funcionesGenerales.translate(this.id + 'Inicio.conteoRegresivo.fecha'));
    this.targetTime = this.targetDate.getTime();

    AOS.init();

    const tipoEncabezado = this.funcionesGenerales.translate(this.id + 'ConfigApp.encabezado');
    const scene: any = document.getElementById('nombres' + `${tipoEncabezado}`);
    const parallaxInstance = new Parallax(scene);

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
      SUMMARY: ${this.funcionesGenerales.translate(this.id + 'Inicio.ceremonia.tituloCalendario')}
      DESCRIPTION: ${this.funcionesGenerales.translate(this.id + 'Inicio.ceremonia.detalleCalendario')}
      DTSTART: ${this.funcionesGenerales.translate(this.id + 'Inicio.ceremonia.inicioCalendario')}
      DTEND: ${this.funcionesGenerales.translate(this.id + 'Inicio.ceremonia.finCalendario')}
      LOCATION: ${this.existeCoordenadas && this.existeCoordenadas != '' ? this.existeCoordenadas : this.funcionesGenerales.translate(this.id + 'Inicio.ceremonia.ubicacionCalendario')}
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
    const title = this.funcionesGenerales.translate(this.id + 'Inicio.ceremonia.tituloCalendario');
    const description = this.funcionesGenerales.translate(this.id + 'Inicio.ceremonia.detalleCalendario');
    const startDate = this.funcionesGenerales.translate(this.id + 'Inicio.ceremonia.inicioCalendario');
    const endDate = this.funcionesGenerales.translate(this.id + 'Inicio.ceremonia.finCalendario');
    const location = this.existeCoordenadas && this.existeCoordenadas != '' ? this.existeCoordenadas : this.funcionesGenerales.translate(this.id + 'Inicio.ceremonia.ubicacionCalendario');
    const timezone = this.funcionesGenerales.translate(this.id + 'Inicio.ceremonia.zonaHoraria');

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&ctz=${timezone}`;

    window.open(url, '_blank');
  }

  addToMicrosoftCalendar() {
    const title = this.funcionesGenerales.translate(this.id + 'Inicio.ceremonia.tituloCalendario');
    const description = this.funcionesGenerales.translate(this.id + 'Inicio.ceremonia.detalleCalendario');
    const startDate = this.funcionesGenerales.translate(this.id + 'Inicio.ceremonia.inicioCalendarioMicrosoft');
    const endDate = this.funcionesGenerales.translate(this.id + 'Inicio.ceremonia.finCalendarioMicrosoft');
    const location = this.existeCoordenadas && this.existeCoordenadas != '' ? this.existeCoordenadas : this.funcionesGenerales.translate(this.id + 'Inicio.ceremonia.ubicacionCalendario');

    const url = `https://outlook.live.com/calendar/0/deeplink/compose?startdt=${startDate}&enddt=${endDate}&subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

    window.open(url, '_blank');
  }

  abrirWaze() {
    const url = `https://waze.com/ul?ll=${this.funcionesGenerales.translate(this.id + 'Inicio.ceremonia.latitud')},${this.funcionesGenerales.translate(this.id + 'Inicio.ceremonia.longitud') }&navigate=yes`;
    window.open(url, '_blank');
  }

  abrirGoogleMaps() {
    const url = `https://www.google.com/maps/search/?api=1&query=${this.funcionesGenerales.translate(this.id + 'Inicio.ceremonia.latitud')},${this.funcionesGenerales.translate(this.id + 'Inicio.ceremonia.longitud') }`;
    window.open(url, '_blank');
  }

  abrirPinterest(sexo: string){
    const url = this.funcionesGenerales.translate(`${this.id}Inicio.codigoVestuario.${sexo}`);
    window.open(url, '_blank');
  }

  verFormulario(){
    this.dialog.open(ConfirmarAsistenciaComponent, { autoFocus: false, data: { id: this.id } });
  }

}
