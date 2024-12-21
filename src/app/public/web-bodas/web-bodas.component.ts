import { SharedModule } from 'src/app/core/shared/shared.module';
import { Component, OnInit } from '@angular/core';
import { WebBodasService } from './web-bodas.service';
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
  selector: 'app-web-bodas',
  standalone: true,
  providers: [WebBodasService],
  templateUrl: './web-bodas.component.html',
  styleUrls: ['./web-bodas.component.css'],
  imports: [SharedModule, MatButtonModule, MatMenuModule, CarouselModule]
})
export class WebBodasComponent implements OnInit {
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
  dataWeb: any = {};
  
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
    private readonly webBodasService: WebBodasService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id') ? `${params.get('id')}` : null; 
      this.id = this.id ?? 'yeshua_&_ana';
      console.log(this.id);
    });
  }

  ngOnInit() {
    this.cargarDataWeb();
  }

  cargarDataWeb(){
    this.webBodasService.getDataWeb(`dataWeb/${this.id}`).then((resp: any) => {
      console.log('resp:', resp);
      this.dataWeb = resp;
      this.background = this.dataWeb.ConfigApp.colorFondo;
      this.backgroundVestuario = this.dataWeb.ConfigApp.colorFondoVestuario;
      this.backgroundConfirmacion = this.dataWeb.ConfigApp.colorFondoConfirmacion;
      this.imgPrincipal = this.dataWeb.WebBodas.encabezado.imgEncabezado;
      this.imgSecundaria = this.dataWeb.WebBodas.encabezado.imgSecundaria;
      this.existeCoordenadas = this.dataWeb.WebBodas.ceremonia.coordenadas;
      this.listaFotos.forEach((e: any, i: number) => {
        e.id = i + 1;
      });

      this.targetDate = new Date(this.dataWeb.WebBodas.conteoRegresivo.fecha);
      this.targetTime = this.targetDate.getTime();

      AOS.init();

      const tipoEncabezado = this.dataWeb.ConfigApp.encabezado;
      console.log('tipoEncabezado:', tipoEncabezado)
      setTimeout(()=>{
        const scene: any = document.getElementById('nombres' + `${tipoEncabezado}`);
        console.log('scene:', scene)
        const parallaxInstance = new Parallax(scene);  
      }, 500)

      setInterval(() => {
        this.calculateTimeRemaining();
      }, 1000);
    })
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
      SUMMARY: ${this.dataWeb.WebBodas.ceremonia.tituloCalendario}
      DESCRIPTION: ${this.dataWeb.WebBodas.ceremonia.detalleCalendario}
      DTSTART: ${this.dataWeb.WebBodas.ceremonia.inicioCalendario}
      DTEND: ${this.dataWeb.WebBodas.ceremonia.finCalendario}
      LOCATION: ${this.existeCoordenadas && this.existeCoordenadas != '' ? this.existeCoordenadas : this.dataWeb.WebBodas.ceremonia.ubicacionCalendario}
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
    const title = this.dataWeb.WebBodas.ceremonia.tituloCalendario;
    const description = this.dataWeb.WebBodas.ceremonia.detalleCalendario;
    const startDate = this.dataWeb.WebBodas.ceremonia.inicioCalendario;
    const endDate = this.dataWeb.WebBodas.ceremonia.finCalendario;
    const location = this.existeCoordenadas && this.existeCoordenadas != '' ? this.existeCoordenadas : this.dataWeb.WebBodas.ceremonia.ubicacionCalendario;
    const timezone = this.dataWeb.WebBodas.ceremonia.zonaHoraria;

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&ctz=${timezone}`;

    window.open(url, '_blank');
  }

  addToMicrosoftCalendar() {
    const title = this.dataWeb.WebBodas.ceremonia.tituloCalendario;
    const description = this.dataWeb.WebBodas.ceremonia.detalleCalendario;
    const startDate = this.dataWeb.WebBodas.ceremonia.inicioCalendarioMicrosoft;
    const endDate = this.dataWeb.WebBodas.ceremonia.finCalendarioMicrosoft;
    const location = this.existeCoordenadas && this.existeCoordenadas != '' ? this.existeCoordenadas : this.dataWeb.WebBodas.ceremonia.ubicacionCalendario;

    const url = `https://outlook.live.com/calendar/0/deeplink/compose?startdt=${startDate}&enddt=${endDate}&subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

    window.open(url, '_blank');
  }

  abrirWaze() {
    const url = `https://waze.com/ul?ll=${this.dataWeb.WebBodas.ceremonia.latitud},${this.dataWeb.WebBodas.ceremonia.longitud}&navigate=yes`;
    window.open(url, '_blank');
  }

  abrirGoogleMaps() {
    const url = `https://www.google.com/maps/search/?api=1&query=${this.dataWeb.WebBodas.ceremonia.latitud},${this.dataWeb.WebBodas.ceremonia.longitud}`;
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