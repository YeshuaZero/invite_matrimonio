import { Component, Inject } from '@angular/core';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FuncionesGeneralesService, TipoEnum } from 'src/app/core/funciones-generales.services';
import { PanelService } from '../../panel.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-crear-nuevo',
  templateUrl: './crear-nuevo.component.html',
  standalone: true,
  styleUrls: ['./crear-nuevo.component.css'],
  imports: [SharedModule, MatRadioModule, MatSlideToggleModule, MatDatepickerModule],
  providers: []
})
export class CrearNuevoInvitadoComponent{

  loading = false;

  dataUsuario: any = {
    activo: true
  };
  copiaDataUsuario: any = {
    activo: true
  };

  id: any = '';
  dataWeb: any = {};
  editar: boolean = false;

  dataWebBase: any = {
    "ConfigApp": {
      "colorFondo": "#f7f4ef",
      "colorFondoConfirmacion": "#bec092",
      "colorFondoVestuario": "#e5e0d8",
      "colorTexto": "#46515c",
      "colorTextoConfirmacion": "#222222",
      "colorTextoVestuario": "#222222",
      "encabezado": "1",
      "estiloConteoRegresivo": "1",
      "flores": "1",
      "floresEncabezado": true,
      "mostrarIcoSecciones": false,
      "ordenCeremonia": "1",
      "ordenFiesta": "1",
      "regalosImgPrincipal": "1",
      "regalosLateralesDer": "1",
      "regalosLateralesIzq": "1",
      "separadorConfirmacionBottom": "1",
      "separadorConfirmacionTop": "1",
      "separadorEncabezado": "1",
      "separadorVestuarioBottom": "1",
      "separadorVestuarioTop": "1",
      "tipoCeremonia": "1",
      "tipoFiesta": "1",
      "tipoRecuerdos": "1",
      "tipoTitulos": "1",
      "vestuarioImgPrincipal": "1",
      "vestuarioLateralesDer": "1",
      "vestuarioLateralesIzq": "1"
    },
    "Invitados": {
      "configuracion": {
        "confirmacionOk": "Respuesta enviada correctamente",
        "confirmacionOkDetalle": "Se ha enviado y registrado correctamente la respuesta... !Gracias por tomarte el tiempo y confirmar!",
        "graciasConfirmados": "¡Gracias!",
        "infoAdicional": "¿Algo que necesitemos saber?",
        "infoAdicionalInvitado": "Información...",
        "listaInvitados": "Selecciona tu nombre",
        "no": "No puedo",
        "preguntaAsistencia": "¿Asistirás a la Ceremonia?",
        "preguntaAsistenciaGrupo": "¿Asistirán a la Ceremonia?",
        "si": "Si! Por supuesto!",
        "todosConfirmados": "Todos los invitados han sido confirmados y han aceptado la invitación de ser parte de nuestra Boda... Si tú también confirmaste... ¡Nos vemos en la Boda!"
      },
      "listaInvitados": {}
    },
    "WebBodas": {
      "ceremonia": {
        "accionHora": "Agregar a mi Agenda",
        "accionLugar": "¿Como Llegar?",
        "appleCalendar": "Apple Calendar",
        "coordenadas": "3.4300882019548484, -76.54104432883662",
        "datoHora": "4:00pm",
        "datoLugar": "Lugar",
        "datoLugar2": "Texto Lugar 2",
        "datoLugar3": "Texto Lugar 3",
        "detalleCalendario": "Ceremonia y Fiesta de Celebración por la Boda",
        "duracion": "5",
        "googleCalendar": "Google Calendar",
        "googleMaps": "Google Maps",
        "hora": "Hora",
        "latitud": "3.4300882019548484",
        "longitud": "-76.54104432883662",
        "lugar": "Lugar",
        "microsoftCalendar": "Microsoft Calendar",
        "textoHora": "Si puedes agéndate toda la noche",
        "titulo": "Ceremonia",
        "tituloCalendario": "",
        "ubicacionCalendario": "Rozo",
        "waze": "Waze",
        "zonaHoraria": "'America/Bogota'"
      },
      "codigoVestuario": {
        "colorReservado1": "#fff",
        "colorReservado2": "#bec092",
        "colorSugeridoMujer1": "#cdb4db",
        "colorSugeridoMujer2": "#ffafcc",
        "colorSugeridoMujer3": "#a2d2ff",
        "colorSugeridoMujer4": "#ffbb77",
        "colorSugeridoMujer5": "#ffa69e",
        "colorSugeridoMujer6": "#aee5e5",
        "descripcionHombres": "DESCRIPCION VESTUARIO HOMBRES",
        "descripcionMujeres": "DESCRIPCION VESTUARIO MUJERES",
        "icono": "fab fa-pinterest",
        "linkHombres": "",
        "linkMujeres": "",
        "notaGeneral": "COLORES RESERVADOS",
        "tenPresente": "Recuerda...",
        "titulo": "Código de vestuario",
        "tituloHombres": "Hombres",
        "tituloMujeres": "Mujeres"
      },
      "confirmacionInvitados": {
        "confirmarAsistencia": "Haz click Aquí",
        "gracias": "¡Gracias por llegar hasta aquí!",
        "gracias2": "Si te ha llegado esta invitación es porque realmente queremos que seas parte de nuestra historia y compartir contigo nuestra alegría, te invitamos a que confirmes tu asistencia a esta fecha tan importante para nosotros, de verdad sería un honor que nos acompañaras.",
        "titulo": "Confirmación de asistencia"
      },
      "conteoRegresivo": {
        "dias": "Días",
        "horas": "Horas",
        "minutos": "Minutos",
        "segundos": "Segundos"
      },
      "encabezado": {
        "frase": "¡Nos Casamos!",
        "imgEncabezado": "",
        "invertirNombres": false,
        "nombreEl": "",
        "nombreElla": ""
      },
      "eslogan": {
        "autor": "Eclesiastés 3 :11",
        "frase": "Todo lo hizo hermoso en su tiempo."
      },
      "fiesta": {
        "accionHora": "Agregar a mi Agenda",
        "accionLugar": "¿Como Llegar?",
        "appleCalendar": "Apple Calendar",
        "coordenadas": "3.4300882019548484, -76.54104432883662",
        "datoHora": "4:00pm",
        "datoLugar": "Lugar",
        "datoLugar2": "Texto Lugar 2",
        "datoLugar3": "Texto Lugar 3",
        "detalleCalendario": "Ceremonia y Fiesta de Celebración por la Boda",
        "duracion": "4",
        "fiestaAparte": false,
        "googleCalendar": "Google Calendar",
        "googleMaps": "Google Maps",
        "hora": "Hora",
        "latitud": "3.4300882019548484",
        "longitud": "-76.54104432883662",
        "lugar": "Lugar",
        "microsoftCalendar": "Microsoft Calendar",
        "textoHora": "Si puedes agéndate toda la noche",
        "titulo": "Fiesta",
        "ubicacionCalendario": "Rozo",
        "waze": "Waze",
        "zonaHoraria": "'America/Bogota'"
      },
      "fotos": {
        "titulo": "Recuerdos de Amor"
      },
      "recuerdos": {
        "ayudanos": "Ayúdanos a crear recuerdos en Instagram...",
        "ayudanos2": "Las fotos que tomes el día del evento súbelas con el Hashtag",
        "icono": "fab fa-instagram",
        "imgFondo": ""
      },
      "regalos": {
        "lluviaSobres": "Lluvia de Sobres",
        "titulo": "Sugerencias de regalo",
        "tituloLluvia": "Tú presencia es suficiente, pero si es tu deseo regalarnos algo, recibiremos ese día los regalos a modo de..."
      }
    }
  };

  claveSecreta = "y35hu4d4v1d";
  iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");

  constructor(
    private readonly funcionesGeneralesService: FuncionesGeneralesService,
    public dialogRef: MatDialogRef<CrearNuevoInvitadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private panelService: PanelService
  ) {
    if (data){
      this.id = data.id;
      this.dataWeb = data.dataWeb;
      if (data.usuario) {
        this.editar = true;
        this.dataUsuario = {...data.usuario};
        this.copiaDataUsuario = { ...data.usuario };
        this.dataUsuario.dateEvento = new Date(this.dataUsuario.fechaEvento);
      }
    } else {
      this.dataWeb = { ...this.dataWebBase };
    }
  }


  guardarUsuario() {
    this.guardarNombres();
    this.dataUsuario.id = `${this.dataUsuario.nombre.toLowerCase()}_&_${this.dataUsuario.nombre2.toLowerCase()}`;
    const fecha = this.dataUsuario.dateEvento instanceof Date ? this.dataUsuario.dateEvento : this.dataUsuario.dateEvento.toDate();
    const fechaEvento = this.funcionesGeneralesService.formatearFecha(fecha, 'YYYY-MM-ddTHH:mm:ss').toUpperCase();
    const dataUsuario: any = {
      id: this.dataUsuario.id,
      fechaEvento,
      nombre: this.dataUsuario.nombre,
      nombre2: this.dataUsuario.nombre2,  
      email: this.dataUsuario.email,
      celular: this.dataUsuario.celular,
      activo: this.dataUsuario.activo
    };

    if(!this.editar){
      dataUsuario.pass = this.generarPass();
      this.dataUsuario.idAcceso = this.encriptarKey(`${this.dataUsuario.email}_${dataUsuario.pass}`);
    }
    
    this.panelService.editarUser(`users`, this.dataUsuario.idAcceso, dataUsuario).then(() => {
      if (!this.editar || dataUsuario.id != this.copiaDataUsuario.id){
        this.setearDataNuevo();
      } else {
        this.funcionesGeneralesService.openDialog('Panel.admin.datosGuardadosOK', 'Panel.admin.datosGuardadosOKDetalle', TipoEnum.OK);
      }
      this.cerrar();
    }, ()=> {
      this.funcionesGeneralesService.openDialog('Panel.admin.guardadoNoConfirmado', 'Panel.admin.guardadoNoConfirmadoDesc', TipoEnum.ERROR);
    });
  }

  setearDataNuevo(){
    this.panelService.saveData(`dataWeb/${this.dataUsuario.id}`, this.dataWebBase)
      .then((resp) => {
        this.eliminarDataUsuario();
        this.funcionesGeneralesService.openDialog('Panel.admin.datosGuardadosOK', 'Panel.admin.datosGuardadosOKDetalle', TipoEnum.OK);
      });
  }

  eliminarDataUsuario() {
    this.panelService.eliminarUser(`users`, this.copiaDataUsuario.idAcceso);
    this.panelService.eliminarUser(`dataWeb`, this.copiaDataUsuario.id);
  }

  guardarNombres() {
    const nombre1Cap = this.funcionesGeneralesService.capitalize(this.dataUsuario.nombre.toLowerCase());
    const nombre2Cap = this.funcionesGeneralesService.capitalize(this.dataUsuario.nombre2.toLowerCase());
    this.dataWeb.WebBodas.encabezado.nombreEl = nombre1Cap;
    this.dataWeb.WebBodas.encabezado.nombreElla = nombre2Cap;
    this.dataWeb.WebBodas.ceremonia.tituloCalendario = `Boda ${nombre1Cap} & ${nombre2Cap}`;
    this.dataWeb.WebBodas.fiesta.tituloCalendario = `Fiesta ${nombre1Cap} & ${nombre2Cap}`;
    this.dataWeb.WebBodas.recuerdos.hashtag = `${nombre1Cap.toLowerCase()}_${nombre2Cap.toLowerCase()}`;
    this.dataWebBase.WebBodas.encabezado.nombreEl = nombre1Cap;
    this.dataWebBase.WebBodas.encabezado.nombreElla = nombre2Cap;
    this.dataWebBase.WebBodas.ceremonia.tituloCalendario = `Boda ${nombre1Cap} & ${nombre2Cap}`;
    this.dataWebBase.WebBodas.fiesta.tituloCalendario = `Fiesta ${nombre1Cap} & ${nombre2Cap}`;
    this.dataWebBase.WebBodas.recuerdos.hashtag = `${nombre1Cap.toLowerCase()}_${nombre2Cap.toLowerCase()}`;

    if (this.editar && this.dataUsuario.id == this.copiaDataUsuario.id){
      this.panelService.saveData(`dataWeb/${this.dataUsuario.id}/WebBodas`, this.dataWeb.WebBodas);
    }
  }

  generarPass(){
    const nombre1 = this.funcionesGeneralesService.capitalize(this.dataUsuario.nombre.toLowerCase());
    const nombre2 = this.funcionesGeneralesService.capitalize(this.dataUsuario.nombre2.toLowerCase());
    const celular = this.dataUsuario.celular.toString();
    return `Admin${nombre1.substring(0, 3)}${nombre2.substring(0, 3)}${celular.substring(celular.length - 4)}`;
  }

  cambiaFechaBoda() {
    console.log('this.dataWeb.WebBodas:', this.dataWebBase.WebBodas)
    this.dataWebBase.WebBodas.fecha = this.dataUsuario.dateEvento instanceof Date ? this.dataUsuario.dateEvento : this.dataUsuario.dateEvento.toDate();
    this.dataWebBase.WebBodas.fechaBoda = this.funcionesGeneralesService.formatearFecha(this.dataWebBase.WebBodas.fecha, 'YYYY-MM-ddTHH:mm:ss').toUpperCase();
    this.dataWebBase.WebBodas.encabezado.fechaBoda = this.funcionesGeneralesService.formatearFecha(this.dataWebBase.WebBodas.fecha, 'dd.MM.YYYY');
    this.dataWebBase.WebBodas.conteoRegresivo.fecha = this.funcionesGeneralesService.formatearFecha(this.dataWebBase.WebBodas.fecha, 'YYYY-MM-ddTHH:mm:ss').toUpperCase();
    this.dataWebBase.WebBodas.conteoRegresivo.dia = this.funcionesGeneralesService.formatearFecha(this.dataWebBase.WebBodas.fecha, 'd');
    this.dataWebBase.WebBodas.conteoRegresivo.mes = this.funcionesGeneralesService.formatearFecha(this.dataWebBase.WebBodas.fecha, 'MMMM');
    this.dataWebBase.WebBodas.conteoRegresivo.year = this.funcionesGeneralesService.formatearFecha(this.dataWebBase.WebBodas.fecha, 'YYYY');

    this.ajustesFecha('ceremonia');
    this.ajustesFecha('fiesta');
  }

  ajustesFecha(seccion: any) {
    this.dataWebBase.WebBodas[seccion].fechaInicio = this.dataWebBase.WebBodas.fecha;
    this.dataWebBase.WebBodas[seccion].fechaFinal = new Date(this.dataWebBase.WebBodas.fecha);
    this.dataWebBase.WebBodas[seccion].fechaFinal.setHours(this.dataWebBase.WebBodas.fecha.getHours() + parseInt(this.dataWebBase.WebBodas[seccion].duracion));
    this.dataWebBase.WebBodas[seccion].inicioCalendario = this.funcionesGeneralesService.formatearFecha(this.dataWebBase.WebBodas[seccion].fechaInicio, 'YYYYMMddTHHmmss').toUpperCase();
    this.dataWebBase.WebBodas[seccion].finCalendario = this.funcionesGeneralesService.formatearFecha(this.dataWebBase.WebBodas[seccion].fechaFinal, 'YYYYMMddTHHmmss').toUpperCase();
    this.dataWebBase.WebBodas[seccion].inicioCalendarioMicrosoft = this.funcionesGeneralesService.formatearFecha(this.dataWebBase.WebBodas[seccion].fechaInicio, 'YYYY-MM-ddTHH:mm:ss').toUpperCase();
    this.dataWebBase.WebBodas[seccion].finCalendarioMicrosoft = this.funcionesGeneralesService.formatearFecha(this.dataWebBase.WebBodas[seccion].fechaFinal, 'YYYY-MM-ddTHH:mm:ss').toUpperCase();
    this.dataWebBase.WebBodas[seccion].datoHora = this.formatearHora(this.dataWebBase.WebBodas.fecha);
  }

  formatearHora(fecha: Date): string {
    const horas = fecha.getHours() % 12 || 12;
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const amPm = fecha.getHours() >= 12 ? 'pm' : 'am';
    return `${horas}:${minutos}${amPm}`;
  }

  encriptarKey(textoAEncriptar: string) {
    const encrypted = CryptoJS.AES.encrypt(textoAEncriptar, CryptoJS.enc.Utf8.parse(this.claveSecreta), {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    const key = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
    return key;
  }

  cerrar() {
    if (this.dialogRef) {  
      this.dialogRef.close();
    }
  }

}
