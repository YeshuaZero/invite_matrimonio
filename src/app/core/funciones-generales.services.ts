import { Component, HostListener, Inject, Injectable } from '@angular/core';
import { TranslateUtilService } from './i18n/translate-util.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CapitalizePipe } from './pipes/capitalize';
import { LoaderComponent } from './loader/loader.component';
import { Subject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import html2canvas from 'html2canvas';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer } from '@angular/platform-browser';


export enum TipoEnum {
    OK = 'OK',
    INFO = 'INFO',
    WARNING = 'WARNING',
    QUESTION = 'QUESTION',
    CONFIRM = 'CONFIRM',
    DELETE = 'DELETE',
    ERROR = 'ERROR',
    ACCION = 'ACCION',
    ACCION_WARNING = 'ACCION_WARNING'
}

export enum TipoDatoEnum {
    DATE = 'DATE',
    STRING = 'STRING',
    NUMBER = 'NUMBER',
    NIVEL = 'NIVEL',
    BOOLEAN = 'BOOLEAN'
}

export enum TipoOrdenEnum {
    ASC = 1,
    DESC = -1
}

export enum TipoLimiteInputEnum {
    LETRAS = 'LETRAS',
    LETRAS_NUMEROS = 'LETRAS_NUMEROS',
    ESPACIOS = 'ESPACIOS',
    GUIONES = 'GUIONES',
    NUMEROS = 'NUMEROS',
    NOTA = 'NOTA',
    NUMEROS_GUION = 'NUMEROS_GUION',
    NUMEROS_GUION_PUNTO = 'NUMEROS_GUION_PUNTO',
    SANGRE = 'SANGRE',
    DIRECCION = 'DIRECCION',
    CORREO = 'CORREO'
}

@Injectable({
    providedIn: 'root'
})
export class FuncionesGeneralesService {

    dataLogin: any = {};
    dataInvolucrados: any = [];
    dataMinisterios: any = [];
    meses = [
        { valor: '1' },
        { valor: '2' },
        { valor: '3' },
        { valor: '4' },
        { valor: '5' },
        { valor: '6' },
        { valor: '7' },
        { valor: '8' },
        { valor: '9' },
        { valor: '10' },
        { valor: '11' },
        { valor: '12' }
    ];

    nivelesOrdenar: any = {
        'MC': 10,
        'DP': 9,
        'A': 8,
        'B': 7,
        'C': 6,
        'S': 5,
        'MIC': 4,
        'NVO': 3,
        'G.O': 2,
        'PERS.NAT': 1
    };

    tiposSangre: any[] = [
        { tipo: 'A+' },
        { tipo: 'A-' },
        { tipo: 'B+' },
        { tipo: 'B-' },
        { tipo: 'AB+' },
        { tipo: 'AB-' },
        { tipo: 'O+' },
        { tipo: 'O-' }
    ];

    listaEstadosCivil: any[] = [];

    retornaLinks: any = {};

    loaderPopUp: any;
    ejecutarAccionDashboard = new Subject();
    dataDiscipulosCambio = new Subject();
    datePipe = new DatePipe('ES');
    currencyPipe = new CurrencyPipe('ES');

    restarFactor = 0;
    colorBaseNuevo: any;
    timeoutColorNuevo: any;

    constructor(
        private translateUtilService: TranslateUtilService,
        public dialog: MatDialog
    ) {
        this.dataLogin = this.getDataLoginToken();
        this.dataInvolucrados = this.getData('dataInvolucrados', true);
        this.dataMinisterios = this.getData('dataMinisterios', true);
        this.retornaLinks = this.getData('retornaLinks', true);
        setTimeout(() => {
            this.listaEstadosCivil = [
                { id: '1', nombre: this.translate('Discipulos.listaEstadoCivil.casado') },
                { id: '2', nombre: this.translate('Discipulos.listaEstadoCivil.soltero') },
                { id: '3', nombre: this.translate('Discipulos.listaEstadoCivil.divorciado') },
                { id: '4', nombre: this.translate('Discipulos.listaEstadoCivil.separado') },
                { id: '5', nombre: this.translate('Discipulos.listaEstadoCivil.unionLibre') },
                { id: '6', nombre: this.translate('Discipulos.listaEstadoCivil.viudo') }
            ];
        }, 500);
        console.log('this.dataLogin:', this.dataLogin)
        console.log('this.dataInvolucrados:', this.dataInvolucrados)
        console.log('this.dataMinisterios:', this.dataMinisterios)
        console.log('this.retornaLinks:', this.retornaLinks)
        console.log('this.listaEstadosCivil:', this.listaEstadosCivil)
    }

    getDataLogin() {
        return { ...this.dataLogin };
    }

    getDataInvolucrados() {
        return this.dataInvolucrados.map((dato: any) => { return { ...dato } });
    }

    getDataMinisterios() {
        return this.dataMinisterios.map((dato: any) => { return { ...dato } });
    }

    getEstadosCivil() {
        return this.listaEstadosCivil.map((dato: any) => { return { ...dato } });
    }

    loader() {
        this.loaderPopUp = this.dialog.open(LoaderComponent, {
            panelClass: 'contenedorLoaderPopUp',
            disableClose: true,
            closeOnNavigation: true
        });
    }

    cerrarLoader() {
        if (this.loaderPopUp) this.loaderPopUp.close();
    }

    openDialog(titulo: string, texto: string, tipoPopUp: TipoEnum, ico?: string, tituloAccion?: string): any {
        const dialogGeneral = this.dialog.open(PopUpDialog, {
            panelClass: 'contenedorPopUpGeneral',
            data: {
                titulo,
                texto,
                tipoPopUp,
                ico,
                tituloAccion: tituloAccion ? this.translate(tituloAccion) : ''
            }
        });

        if (tipoPopUp == TipoEnum.ACCION_WARNING || tipoPopUp == TipoEnum.ACCION || TipoEnum.QUESTION || tipoPopUp == TipoEnum.CONFIRM || tipoPopUp == TipoEnum.DELETE) return dialogGeneral;
    }

    verPDF(tituloPopUp: string, url: string, tipoVisor: string, permiteDescarga?: boolean, nombreArchivoDescarga?: string, extension?: string) {
        this.dialog.open(VisorDocumentoPopUp, {
            data: {
                titulo: this.translate(tituloPopUp),
                url: this.translate(url),
                tipoVisor,
                permiteDescarga,
                nombreArchivoDescarga: nombreArchivoDescarga ? this.translate(nombreArchivoDescarga) : null,
                extension: extension ? extension.toLowerCase() : 'pdf'
            },
            autoFocus: false
        });
    }

    translate(texto: string): string {
        return this.translateUtilService.getTranslateText(texto);
    }

    capitalize(texto: string, primeraLetra?: boolean) {
        let capitalizePipe = new CapitalizePipe()
        return capitalizePipe.transform(texto, primeraLetra);
    }

    setDataLogin(data: any) {
        this.dataLogin = data;
        localStorage.setItem('t0k3nD4v1dk4', JSON.stringify(data));
    }

    getDataLoginToken() {
        const data: any = localStorage.getItem('t0k3nD4v1dk4');
        return data ? JSON.parse(data) : null;
    }

    setData(nombre: string, data: any, esObjeto?: boolean) {
        const dataGuardar = esObjeto ? JSON.stringify(data) : data;
        localStorage.setItem(nombre, dataGuardar);

        if (nombre == 'dataInvolucrados') {
            this.dataInvolucrados = data;
        } else if (nombre == 'dataMinisterios') {
            this.dataMinisterios = data;
        } else if (nombre == 'retornaLinks') {
            this.retornaLinks = data;
        }
    }

    getData(nombre: string, esObjeto?: boolean) {
        const data: any = localStorage.getItem(nombre);
        return esObjeto ? (data ? JSON.parse(data) : nombre == 'retornaLinks' ? {} : []) : data;
    }

    deleteData(nombre: string) {
        localStorage.removeItem(nombre);
    }

    findDiscipulo(codDavidka: string) {
        const dataDiscipulo = this.dataInvolucrados.find((dato: any) => dato.codDavidka == codDavidka);
        return dataDiscipulo ? { ...dataDiscipulo } : null;
    }

    actualizarDiscipulo(dataDiscipulo: any) {
        const discipulo = this.dataInvolucrados.find((dato: any) => dato.codDavidka == dataDiscipulo.codDavidka);

        discipulo.codLider = dataDiscipulo.codLider;
        discipulo.lider = dataDiscipulo.lider;
        discipulo.celular = dataDiscipulo.celular;
        discipulo.correo = dataDiscipulo.correo;
        discipulo.dias = dataDiscipulo.dias;
        discipulo.documento = dataDiscipulo.documento;
        discipulo.estado = dataDiscipulo.estado;
        discipulo.idEstado = dataDiscipulo.idEstado;
        discipulo.idRazon = dataDiscipulo.idRazon;
        discipulo.idNivel = dataDiscipulo.idNivel;
        discipulo.ministerio = dataDiscipulo.ministerio;
        discipulo.nivel = dataDiscipulo.nivel;
        discipulo.nombreCompleto = dataDiscipulo.nombreCompleto;
        discipulo.tipoDoc = dataDiscipulo.tipoDoc;
        discipulo.identificacion = dataDiscipulo.identificacion;

        this.dataInvolucrados = this.ordenar(this.dataInvolucrados, TipoDatoEnum.STRING, 'nombreCompleto');
        localStorage.setItem('dataInvolucrados', JSON.stringify(this.dataInvolucrados));
    }

    agregarNuevoDiscipulo(dataNuevoDiscipulo: any) {
        this.dataInvolucrados.push(dataNuevoDiscipulo);
        this.dataInvolucrados = this.ordenar(this.dataInvolucrados, TipoDatoEnum.STRING, 'nombreCompleto');
        localStorage.setItem('dataInvolucrados', JSON.stringify(this.dataInvolucrados));
    }

    validarCaracteresEspeciales(input: string): string {
        const from = 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýýþÿŔŕ';
        const to = 'aaaaaaaceeeeiiiidnoooooouuuuybsaaaaaaaceeeeiiiidnoooooouuuyybyRr';
        const regex = new RegExp(`[${from}]`, 'g');
        return input.replace(regex, (match) => to.charAt(from.indexOf(match)));
    }

    ordenar(data: any, tipoDato?: TipoDatoEnum, ordenarPor?: string, tipoOrden?: TipoOrdenEnum) {
        if (data) {
            return data.sort((a: any, b: any): any => {
                let valorA = ordenarPor ? a[ordenarPor] : a;
                let valorB = ordenarPor ? b[ordenarPor] : b;
                const tipoOrd: any = tipoOrden ? tipoOrden : 1;

                if (ordenarPor == 'nivel' || tipoDato == TipoDatoEnum.NIVEL) {
                    valorA = valorA ? this.nivelesOrdenar[valorA] : 0;
                    valorB = valorB ? this.nivelesOrdenar[valorB] : 0;
                } else if (tipoDato == TipoDatoEnum.NUMBER) {
                    valorA = valorA ? parseFloat(valorA) : 0;
                    valorB = valorB ? parseFloat(valorB) : 0;
                } else if (tipoDato == TipoDatoEnum.DATE) {
                    valorA = valorA ? new Date(valorA) : new Date('01/01/1900');
                    valorB = valorB ? new Date(valorB) : new Date('01/01/1900');
                }
                return (valorA > valorB ? 1 : valorA < valorB ? -1 : 0) * tipoOrd;
            });
        } else {
            return [];
        }
    }

    limitarInput(event: KeyboardEvent, tipoLimite: any) {
        let expresion;

        switch (tipoLimite) {
            case TipoLimiteInputEnum.NUMEROS:
                expresion = /^\d$/;
                break;
            case TipoLimiteInputEnum.NUMEROS_GUION:
                expresion = /[\d\/\-() ]/;
                break;
            case TipoLimiteInputEnum.NUMEROS_GUION_PUNTO:
                expresion = /[\d\.\-]/;
                break;
            case TipoLimiteInputEnum.NOTA:
                expresion = /^\d*([.,]?\d*)?$/;
                break;
            case TipoLimiteInputEnum.LETRAS_NUMEROS:
                expresion = /[a-z0-9\-]/;
                break;
            case TipoLimiteInputEnum.CORREO:
                expresion = /[a-z0-9_\-\@\.\s]/i;
                break;
            case TipoLimiteInputEnum.SANGRE:
                expresion = /^[abo\-+]$/i;
                break;
            case TipoLimiteInputEnum.DIRECCION:
                expresion = /[a-z0-9\-#.\s]/;
                break;
            case TipoLimiteInputEnum.GUIONES:
                expresion = /[a-z\- ]/;
                break;
            case TipoLimiteInputEnum.ESPACIOS:
                expresion = /[a-z ]/;
                break;
            default:
                expresion = /[a-z]/;
        }

        const key = event.key.toLowerCase();
        const especiales = ["Backspace", "ArrowLeft", "ArrowRight", "Delete"]; // Teclas especiales

        if (!expresion.test(key) && !especiales.includes(event.key)) {
            event.preventDefault();
        }
    }

    setFechaInicialPermitida() {
        const fechaInicialPermitida = new Date();
        if (this.retornaLinks.VC_DIAS) {
            fechaInicialPermitida.setDate(fechaInicialPermitida.getDate() - (parseInt(this.retornaLinks.VC_DIAS) + 1));
        } else {
            fechaInicialPermitida.setDate(1);
        }
        return fechaInicialPermitida;
    }

    fechaSinSeparadoresYMD(fecha: string) {
        const year = fecha.substring(0, 4);
        const month = fecha.substring(4, 6);
        const day = fecha.substring(6, 8);

        const fechaFormateada = `${year}/${month}/${day}`;
        return new Date(fechaFormateada);
    }

    fechaSinHoras(fecha: any) {
        const fechaAFormatear = new Date(fecha);
        return new Date(fechaAFormatear.getFullYear(), fechaAFormatear.getMonth(), fechaAFormatear.getDate());
    }

    scroll(elementId: string, top?: boolean) {
        setTimeout(() => {
            const element = document.getElementById(elementId);
            if (element) {
                if (top) {
                    element.scrollTo({ behavior: 'smooth', top: 0 });
                } else {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }, 200);
    }

    exportarArchivo(blobUrl: any, nombreArchivo: string, extension: string, urlString?: boolean) {
        console.log('blobUrl: any, nombreArchivo: string, extension: string, urlString:', blobUrl, nombreArchivo, extension, urlString)
        const urlCompleta = window.location.href;
        let arrayUrl: any = [];
        let urlApp: any = '';
        if (urlCompleta) {
            arrayUrl = urlCompleta.split('/panel');
            urlApp = `${arrayUrl[0]}`;
            console.log('urlApp:', urlApp)
        }

        let datePipe = new DatePipe('ES');
        const fecha = datePipe.transform(new Date(), 'yyyyMMdd hh:mm:ss');
        const link = document.createElement('a');
        const url = urlString ? blobUrl : window.URL.createObjectURL(blobUrl);
        link.href = url;
        link.download = `${nombreArchivo}${nombreArchivo.includes('Informe') ? ' ' + fecha : ''}${extension ? '.' + extension : ''}`;
        console.log('blobUrl:', blobUrl)
        if (urlString && !blobUrl.includes(urlApp)) {
            link.target = '_blank';
        }
        document.body.appendChild(link);
        console.log('link:', link)
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        this.cerrarLoader();
    }

    obtenerFecha(dataFecha: string, formatoNecesitado?: string) {
        let fecha: any = new Date(dataFecha);
        const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;
        const regex2 = /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/;
        const regex3 = /^\d{2}\.\d{2}\.\d{4}$/;
        const regex4 = /^\d{2}\-\d{2}\-\d{4}$/;
        if (regex.test(dataFecha)) {
            const nuevaFecha = dataFecha.replace(regex, '$3/$2/$1');
            fecha = new Date(nuevaFecha);
        } else if (regex2.test(dataFecha)) {
            const year = parseInt(dataFecha.substring(0, 4), 10);
            const month = parseInt(dataFecha.substring(4, 6), 10) - 1;
            const day = parseInt(dataFecha.substring(6, 8), 10);
            fecha = new Date(year, month, day);
        } else if (regex3.test(dataFecha)) {
            const [day, month, year] = dataFecha.split('.');
            const fechaAjustada = `${year}-${month}-${day}`;
            fecha = new Date(fechaAjustada);
        } else if (regex4.test(dataFecha)) {
            const [day, month, year] = dataFecha.split('-');
            const fechaAjustada = `${year}-${month}-${day}`;
            fecha = new Date(fechaAjustada);
        }

        if (formatoNecesitado) {
            fecha = this.formatearFecha(fecha, formatoNecesitado);
        }

        return fecha;
    }

    formatearFecha(fecha: Date, formatoNecesitado: string) {
        const fechaFormateada: any = this.datePipe.transform(fecha, formatoNecesitado);
        return this.capitalize(fechaFormateada);
    }

    formatearValor(dato: any) {
        const valorFormatear = parseFloat(dato.toString());
        const valorFormateado = this.currencyPipe.transform(valorFormatear, '$ ', 'symbol-narrow', '1.0-2', 'en');
        return valorFormateado;
    }

    descargarDiv(idDiv: string, nombre: string) {
        const div = document.getElementById(idDiv);
        if (div) {
            html2canvas(div, {
                scrollY: 0,
                scrollX: 0,
                windowWidth: div.scrollWidth,
                windowHeight: div.scrollHeight
            }).then(canvas => {
                const capturedImage = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = capturedImage;

                // Establecer el nombre del archivo para la descarga
                link.download = `${nombre}.png`;

                // Simular un clic en el enlace para iniciar la descarga
                link.click();
            });
        }
    }

    validarCorreo(dato: string) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const esValido = emailPattern.test(dato);
        if (!esValido) {
            this.openDialog(`General.correoNoValido`, `General.correoNoValidoDetalle`, TipoEnum.ERROR);
        }
        return esValido;
    };

    calcularEdad(fechaNacimiento: any) {
        if (!fechaNacimiento) {
            return null;
        }

        const hoy: Date = new Date();
        const cumple: Date = new Date(fechaNacimiento);

        let edad: number = hoy.getFullYear() - cumple.getFullYear();

        const mesActual: number = hoy.getMonth() + 1;
        const mesCumple: number = cumple.getMonth() + 1;
        if (mesCumple > mesActual || (mesCumple === mesActual && cumple.getDate() > hoy.getDate())) {
            edad--;
        }
        return edad;
    }

    iconoDoc(extension: string) {
        const dataIcono: any = {};
        extension = extension ? extension.toLowerCase() : extension;
        switch (extension) {
            case 'drive':
                dataIcono.color = '#236512';
                dataIcono.icono = 'fab fa-google-drive';
                dataIcono.tipoVisor = 'DRIVE';
                break;
            case 'csv':
                dataIcono.color = '#236512';
                dataIcono.icono = 'fas fa-file-csv';
                dataIcono.tipoVisor = 'CSV';
                break;
            case 'xls':
            case 'xlsx':
                dataIcono.color = '#236512';
                dataIcono.icono = 'fas fa-file-excel';
                dataIcono.tipoVisor = 'OFFICE';
                break;
            case 'pdf':
                dataIcono.color = '#df1a19';
                dataIcono.icono = 'fas fa-file-pdf';
                dataIcono.tipoVisor = 'PDF';
                break;
            case 'doc':
            case 'docx':
                dataIcono.color = '#2c45ba';
                dataIcono.icono = 'fas fa-file-word';
                dataIcono.tipoVisor = 'OFFICE';
                break;
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'png':
                dataIcono.color = '#ff8900';
                dataIcono.icono = 'fas fa-file-image';
                dataIcono.tipoVisor = 'IMG';
                break;
            case 'rar':
            case 'zip':
                dataIcono.color = '#183153';
                dataIcono.icono = 'fas fa-file-archive';
                dataIcono.tipoVisor = 'DOWNLOAD';
                break;
            case 'html':
            case 'htm':
                dataIcono.color = '#222';
                dataIcono.icono = 'fas fa-file-code';
                dataIcono.tipoVisor = 'HTML';
                break;
            default:
                dataIcono.color = '#222';
                dataIcono.icono = 'fas fa-file-alt';
                dataIcono.tipoVisor = 'DOWNLOAD';
        }

        return dataIcono;
    }

    aclararColor(colorCMYK: string, factor: number): string {
        const colorSinHash = this.colorBaseNuevo ? this.colorBaseNuevo.replace('#', '') : colorCMYK.replace('#', '');
        let r = Math.min(255, parseInt(colorSinHash.substring(0, 2), 16) + factor - this.restarFactor);
        let g = Math.min(255, parseInt(colorSinHash.substring(2, 4), 16) + factor - this.restarFactor);
        let b = Math.min(255, parseInt(colorSinHash.substring(4, 6), 16) + factor - this.restarFactor);
        let retornarColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

        if (retornarColor.includes('ffff')) {
            this.restarFactor = factor - 90;
            r = r - factor + 30;
            g = g - factor - 90;
            b = b - factor + 30;
            const nuevoColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
            this.colorBaseNuevo = nuevoColor;
            retornarColor = this.aclararColor(nuevoColor, factor);
        }

        if (this.timeoutColorNuevo) clearTimeout(this.timeoutColorNuevo);
        this.timeoutColorNuevo = setTimeout(() => {
            this.restarFactor = 0;
            this.colorBaseNuevo = null;
        }, 3000);
        return retornarColor;
    }
}

@Component({
    selector: 'app-pop-up',
    template: `
    <div class="popUp" [ngClass]="{'error': tipoPopUp == 'ERROR' || tipoPopUp == 'DELETE', 'warning': tipoPopUp == 'WARNING' || tipoPopUp == 'ACCION_WARNING'}" (keydown)="onKeydown($event)">
      <div class="contenedorTituloPopUp">
        <span></span>
        <i class="cerrar fas fa-times" (click)="cerrar()"></i>
      </div>
        <div class="contenedorInfo flex flexColumn">
            <i class="{{icoMostrar}}"></i>
            <p class="titulo">{{titulo | translate}}</p>
            <p class="texto">{{texto | translate}}</p>
        </div>

        <div *ngIf="mostrarBotones" class="flex flexColumn">
            <a class="confirmar" (click)="cerrar(true)" [ngClass]="{'tituloAccionPq': textoAccionGrande}">{{(tipoPopUp == 'ACCION_WARNING' || tipoPopUp == 'ACCION' ? tituloAccion : tipoPopUp == 'DELETE' ? 'General.eliminar' : tipoPopUp == 'CONFIRM' ? 'General.aceptar' : 'General.si') | translate}}</a>
            <a class="cancelar" (click)="cerrar()">{{(tipoPopUp == 'ACCION_WARNING' || tipoPopUp == 'ACCION' || tipoPopUp == 'DELETE' || tipoPopUp == 'CONFIRM' ? 'General.cancelar' : 'General.no') | translate}}</a>
        </div>
    </div>
  `,
    standalone: true,
    imports: [CommonModule, TranslateModule]
})
export class PopUpDialog {

    titulo: string = 'DAVIDKA';
    texto: string;
    tipoPopUp!: TipoEnum;
    mostrarBotones: boolean = false;
    icoOK = 'fas fa-check-circle';
    icoINFO = 'fas fa-envelope-open-text';
    icoWARNING = 'fas fa-exclamation-triangle';
    icoQUESTION = 'far fa-question-circle';
    icoCONFIRM = 'far fa-question-circle';
    icoDELETE = 'fas fa-trash-alt';
    icoERROR = 'far fa-times-circle';
    icoACCION = 'fas fa-vote-yea';
    icoACCION_WARNING = 'fas fa-exclamation-triangle';
    icoMostrar = this.icoINFO;
    tituloAccion: string = '';
    textoAccionGrande: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<PopUpDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.titulo = data.titulo;
        this.texto = data.texto;
        this.tipoPopUp = data.tipoPopUp;

        this.mostrarBotones = this.tipoPopUp == TipoEnum.ACCION_WARNING || this.tipoPopUp == TipoEnum.ACCION || this.tipoPopUp == TipoEnum.QUESTION || this.tipoPopUp == TipoEnum.CONFIRM || this.tipoPopUp == TipoEnum.DELETE;
        this.icoMostrar = this[`ico${this.tipoPopUp}`];

        if (data.ico) this.icoMostrar = data.ico;
        if (data.tituloAccion) {
            this.tituloAccion = data.tituloAccion;
            this.textoAccionGrande = this.tituloAccion.length > 15;
        }
    }

    @HostListener('window:keydown', ['$event'])
    onKeydown(event: KeyboardEvent) {
        console.log('event:', event)
        if (event.key === 'Enter') {
            this.cerrar(true);
        } else if (event.key === 'Escape') {
            this.cerrar();
        }
    }

    cerrarPopup() {
        this.dialogRef.close();
    }

    cerrar(valor?: boolean) {
        this.dialogRef.close(!!valor);
    }
}

@Component({
    selector: 'app-pop-up',
    template: `
    <div class="popUp popUpVisorDocs">
    <div class="contenedorTituloPopUp">
        <span>{{titulo}}</span>
        <button *ngIf="permiteDescarga" class="botonDescargarPDF" mat-raised-button (click)="descargar()" autofocus="false">
            <i class="fas fa-save"></i>
            {{'General.descargar' | translate}}
        </button>
        <i class="cerrar fas fa-times" (click)="cerrar()"></i>
    </div>
    <div class="contenedorVisorPlanTrabajo flex flexColumn" [ngSwitch]="tipoVisor" [ngClass]="{'tamHeightAuto': tamHeightAuto}">
            <app-loader class="loaderFondoGeneral"></app-loader>
            <div class="contenedorVisoresDocsGeneral" *ngSwitchCase="'PDF'">
                <pdf-viewer class="docViewer" [src]="url" [render-text]="true"
                    [original-size]="false"></pdf-viewer>
            </div>
            <div class="contenedorImg docViewer contenedorVisoresDocsGeneral" *ngSwitchCase="'IMG'">
                <img [src]="url" [alt]="titulo">
            </div>
            <div class="contenedorVisoresDocsGeneral" *ngSwitchCase="'OFFICE'">
                <ngx-doc-viewer class="docViewer" [url]="url" viewer="url"></ngx-doc-viewer>
            </div>
            <div class="contenedorVisoresDocsGeneral" *ngSwitchCase="'HTML'">
                <iframe class="docViewer" [src]="url"></iframe>
            </div>
        </div>
    </div>
  `,
    standalone: true,
    imports: [CommonModule, TranslateModule, PdfViewerModule, NgxDocViewerModule, MatButtonModule, LoaderComponent]
})
export class VisorDocumentoPopUp {

    titulo: string = 'General.verPDF';
    permiteDescarga: string;
    nombreArchivoDescarga: string;
    urlOriginal: any;
    url: any;
    tipoVisor: string;
    extension: string;
    tamHeightAuto: boolean;

    constructor(
        private funcionesGeneralesService: FuncionesGeneralesService,
        public dialogRef: MatDialogRef<PopUpDialog>,
        private sanitizer: DomSanitizer,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.titulo = data.titulo;
        this.tamHeightAuto = this.titulo.includes(this.funcionesGeneralesService.translate('Dashboard.tituloCategorizacion'));
        this.permiteDescarga = data.permiteDescarga;
        this.nombreArchivoDescarga = data.nombreArchivoDescarga;
        this.urlOriginal = data.url;
        this.tipoVisor = data.tipoVisor ? data.tipoVisor : 'PDF';
        this.extension = data.extension ? data.extension : 'pdf';
        this.url = this.tipoVisor == 'OFFICE' ? `https://docs.google.com/gview?url=${data.url}&embedded=true` : data.url;
        if (['IMG', 'HTML'].includes(this.tipoVisor)) {
            this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
        }
    }

    @HostListener('window:keydown', ['$event'])
    onKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            this.cerrar();
        }
    }

    descargar() {
        this.funcionesGeneralesService.loader();
        this.funcionesGeneralesService.exportarArchivo(this.urlOriginal, this.nombreArchivoDescarga, this.extension, true);
    }

    cerrarPopup() {
        this.dialogRef.close();
    }

    cerrar(valor?: boolean) {
        this.dialogRef.close(!!valor);
    }
}