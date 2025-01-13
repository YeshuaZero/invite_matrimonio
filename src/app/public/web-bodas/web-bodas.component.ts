import { SharedModule } from 'src/app/core/shared/shared.module';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
import { getAuth, signInAnonymously } from "firebase/auth";

@Component({
  selector: 'app-web-bodas',
  standalone: true,
  providers: [WebBodasService],
  templateUrl: './web-bodas.component.html',
  styleUrls: ['./web-bodas.component.css'],
  imports: [SharedModule, MatButtonModule, MatMenuModule, CarouselModule]
})
export class WebBodasComponent implements OnInit, OnChanges {

  @Input('dataWeb') dataWeb: any = {};
  @Input('listaFotosGaleria') listaFotosGaleria: any = [];
  @Input('previa') previa: boolean = false;

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
    private readonly webBodasService: WebBodasService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id') ? `${params.get('id')}` : null; 
      this.id = this.id ?? 'yeshua_&_ana';
    });
  }

  ngOnInit() {
    const auth = getAuth();
    signInAnonymously(auth)
      .then(() => {
        console.log('entro')
        if (this.dataWeb?.ConfigApp){
          this.inicializarData();
        } else {
          this.consultarImagenes();
          this.cargarDataWeb();
        }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['dataWeb']?.currentValue?.WebBodas){
      this.targetDate = new Date(this.dataWeb.WebBodas.conteoRegresivo.fecha);
      this.targetTime = this.targetDate.getTime();
      setInterval(() => {
        this.calculateTimeRemaining();
      }, 500);
    }
  }

  consultarImagenes() {
    this.webBodasService.getFiles(`${this.id}/galeriaFotos`).subscribe((urls: any) => {
      this.listaFotosGaleria = urls;
    });
  }

  cargarDataWeb(){
    this.webBodasService.getDataWeb(`dataWeb/${this.id}`).then((resp: any) => {
      this.dataWeb = resp;
      if (this.dataWeb.Invitados?.listaInvitados){
        this.dataWeb.Invitados.listaInvitados = Object.entries(this.dataWeb.Invitados.listaInvitados).map(([id, data]) => {
          if (typeof data === 'object' && data !== null) {
            return { id, ...data };
          } else {
            return { id };
          }
        });
      }
      this.inicializarData();
    })
  }

  inicializarData(){
    this.imgPrincipal = this.dataWeb.WebBodas.encabezado.imgEncabezado;
    this.imgSecundaria = this.dataWeb.WebBodas.encabezado.imgSecundaria;
    this.existeCoordenadas = this.dataWeb.WebBodas.ceremonia.coordenadas;
    this.listaFotos.forEach((e: any, i: number) => {
      e.id = i + 1;
    });

    this.targetDate = new Date(this.dataWeb.WebBodas.conteoRegresivo.fecha);
    this.targetTime = this.targetDate.getTime();

    const tipoEncabezado = this.dataWeb.ConfigApp.encabezado;


    if (this.previa) {
      const elements = document.querySelectorAll('[data-aos]');
      elements.forEach((element) => {
        element.removeAttribute('data-aos');
        element.removeAttribute('data-aos-duration');
        element.removeAttribute('data-aos-offset');
      });
    } else {
      setTimeout(() => {
        const scene: any = document.getElementById('nombres' + `${tipoEncabezado}`);
        const parallaxInstance = new Parallax(scene);
      }, 500)
    }
    
    AOS.init();
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

  abrirSugerencias(sexo: string){
    const url = this.funcionesGenerales.translate(`${this.dataWeb.WebBodas.codigoVestuario[sexo]}`);
    window.open(url, '_blank');
  }

  verFormulario(){
    if (!this.previa){
      this.dialog.open(ConfirmarAsistenciaComponent, { autoFocus: false, data: { id: this.id, dataWeb: this.dataWeb } });
    }
  }

}
