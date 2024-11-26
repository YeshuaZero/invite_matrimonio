import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuncionesGeneralesService, TipoEnum } from '../funciones-generales.services';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-table',
  standalone: true,
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatMenuModule, MatSortModule, TranslateModule, MatCheckboxModule, MatTooltipModule, FormsModule, ReactiveFormsModule]
})
export class TableComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input('nombreTabla') nombreTabla: string = '';
  @Input('columnas') columnas: string[] = [];
  @Input('data') data: any = [];
  @Input('cantidadElementosMostrar') cantidadElementosMostrar: number = 10;
  @Input('mostrarPaginador') mostrarPaginador: boolean = true;
  @Input('ordenarTabla') ordenarTabla: boolean = true;
  @Input('indexActivo') indexActivo!: number;
  @Input('indexIcono') indexIcono: number = 999;
  @Input('icono') icono!: string;
  @Input('textoIcono') textoIcono!: string;
  @Input('indexCheck') indexCheck: number = 999;
  @Input('indexNoOrdenarColumna') indexNoOrdenarColumna: number = 999;
  @Input('opcionesTabla') opcionesTabla: any = [];
  @Input('atributoOpciones') atributoOpciones!: string;
  @Input('opcionesDependenValor') opcionesDependenValor: boolean = false;
  @Input('infoAdicional') infoAdicional: boolean = false;
  @Input('icoSinMenu') icoSinMenu: boolean = false;
  @Input('textoTabla') textoTabla: string = '';
  @Input('mostrarTextoTabla') mostrarTextoTabla: boolean = true;
  @Input('mediaQuery') mediaQuery!: any;
  @Input('indexInput') indexInput: number = 999;
  @Input('tipoLimiteInput') tipoLimiteInput: any = 'LETRAS_NUMEROS';
  @Input('tamInput') tamInput: string = 'auto';
  @Input('noTraducirTitulos') noTraducirTitulos: boolean = false;
  @Input('envioTratamientoDatos') envioTratamientoDatos: boolean = false;

  @Output() listaSeleccionados = new EventEmitter<any>();
  @Output() opcionSeleccionada = new EventEmitter<any>();
  @Output() opcionSeleccionada2 = new EventEmitter<any>();
  @Output() opcionSeleccionada3 = new EventEmitter<any>();
  @Output() cambioInput = new EventEmitter<any>();

  dataSource: any = [];
  clickOpciones: any;
  filaSeleccionada: any;

  listaCheckeados: any = [];

  mostrarTabla = false;
  visualizarTabla = false;

  mediaQueryArray: any = [];
  mediaQueryCantidades: any;
  breakpoint$: any;

  private subscriptions = new Subscription();

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private breakpointObserver: BreakpointObserver,
    public funcionesGeneralesService: FuncionesGeneralesService
  ) { }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit() {
    this.dataSource = this.mostrarPaginador ? new MatTableDataSource<any>(this.data) : this.data;
  }

  ngAfterViewInit(): void {
    if (this.mediaQuery) {
      this.mediaQueryArray = Object.keys(this.mediaQuery);
      this.breakpoint$ = this.breakpointObserver
        .observe(this.mediaQueryArray)
        .pipe(
          distinctUntilChanged()
        );

      this.subscriptions.add(this.breakpoint$.subscribe(() => {
        for (let index = 0; index < this.mediaQueryArray.length; index++) {
          const mediaQuery = this.mediaQueryArray[index];
          if (this.breakpointObserver.isMatched(mediaQuery)) {
            this.cantidadElementosMostrar = this.mediaQuery[mediaQuery];
            this.visualizarTabla = false;
            this.mostrarTabla = false;
            setTimeout(() => {
              this.mostrarTabla = true;
              setTimeout(() => {
                this.inicializarPaginadorOrdenar();
              }, 200);
            }, 200);
            break;
          }
        }
      }));
    } else {
      setTimeout(() => {
        this.mostrarTabla = true;
        setTimeout(() => {
          this.inicializarPaginadorOrdenar();
        }, 200);
      }, 200);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data']['currentValue']) {
      this.visualizarTabla = false;
      this.mostrarTabla = false;
      this.listaCheckeados = this.data.filter((dato: any) => dato.asistencia);
      this.dataSource = this.mostrarPaginador ? new MatTableDataSource<any>(this.data) : this.data;
      setTimeout(() => {
        this.mostrarTabla = true;
        setTimeout(() => {
          this.inicializarPaginadorOrdenar();
        }, 200);
      }, 200);
    }
  }


  inicializarPaginadorOrdenar() {
    if (this.mostrarPaginador) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.ordenarTabla) this.dataSource.sort = this.sort;
    setTimeout(() => { this.visualizarTabla = true, 0 });
  }

  mostrarOpciones() { }

  abrirOpcion(opcion: any, filaSeleccionada: any) {
    opcion.filaSeleccionada = filaSeleccionada;
    this.opcionSeleccionada.emit(opcion);
  }


  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  ejecutarAccion(element: any) {
    this.opcionSeleccionada.emit(element);
  }

  ejecutarAccion2(element: any) {
    this.opcionSeleccionada2.emit(element);
  }

  ejecutarAccion3(element: any) {
    this.opcionSeleccionada3.emit(element);
  }

  verOpciones(fila: any) {
    this.filaSeleccionada = fila;
  }

  cambioCheck(dato: any, columna: string) {
    dato[columna] = !dato[columna];
    const indexExiste = this.listaCheckeados.findIndex((datoLista: any) => datoLista.codDavidka == dato.codDavidka);
    if (dato[columna]) {
      if (indexExiste == -1) this.listaCheckeados.push(dato);
    } else {
      if (indexExiste >= 0) this.listaCheckeados.splice(indexExiste, 1);
    }

    this.listaSeleccionados.emit(this.listaCheckeados);
  }

  esArray(valor: any): boolean {
    return Array.isArray(valor);
  }

  cambioCasillaInput(dato: any, columna: string) {
    console.log('dato:', dato)
    if (dato[columna] != dato[`${columna}Inicial`]) {
      if (this.tipoLimiteInput == 'NOTA') {
        dato[columna] = dato[columna].replace(/,/g, '.');
        const expresion = /^(0(\.\d+)?|[1-4](\.\d+)?|5(\.0+)?)$/;
        if (!expresion.test(dato[columna])) {
          dato[columna] = null;
          this.funcionesGeneralesService.openDialog('General.notaErrada', 'General.notaErradaDetalle', TipoEnum.ERROR);
        } else {
          this.cambioInput.emit(dato);
        }
      } else {
        this.cambioInput.emit(dato);
      }
    }
  }

  abrirWhatsApp(celular: any) {
    const urlWhatsApp = `https://wa.me/${celular}`;
    window.open(urlWhatsApp, '_blank');
  }

}
