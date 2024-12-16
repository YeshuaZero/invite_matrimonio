import { Component, Inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FuncionesGeneralesService, TipoEnum } from 'src/app/core/funciones-generales.services';
import { DomSanitizer } from '@angular/platform-browser';
import { WebBodasService } from '../web-bodas.service';


@Component({
  selector: 'app-confirmar-asistencia',
  templateUrl: './confirmar-asistencia.component.html',
  standalone: true,
  styleUrls: ['./confirmar-asistencia.component.css'],
  imports: [SharedModule, MatRadioModule],
  providers: []
})
export class ConfirmarAsistenciaComponent implements OnInit {

  loading = true;
  id = '';
  usarGoogleForms = false;
  form: any;
  linkForm: any;
  familia: any;

  listaInvitados: any = [];
  listaInvitadosCompleta: any = [
    {
      nombre: 'Familia Novio', invitados: [
        { nombre: 'Nestor León López' },
        { nombre: 'Bertha Liliana Piedrahita' },
        { nombre: 'Cristhian Fernando López' },
        { nombre: 'Ximena Garces' },
        { nombre: 'Carmen Mora' },
        { nombre: 'Maria Alejandra López' },
        { nombre: 'Robert Morales' },
        { nombre: 'Ana Maria Piedrahita' },
        { nombre: 'Daniel Piedrahita' },
        { nombre: 'Gloria Piedrahita' },
        { nombre: 'Lida Piedrahita' },
        { nombre: 'Luciana Flórez' },
        { nombre: 'Anita Arbelaez' },
        { nombre: 'Julian García' },
        { nombre: 'Hernan López' },
        { nombre: 'Oliva Agudelo' },
        { nombre: 'Esperanza' }
      ]
    },
    { nombre: 'Familia Novia', invitados: [
        { nombre: 'Barbara León' },
        { nombre: 'Edward Sáenz León' },
        { nombre: 'Tatiana Sáenz Arenas' },
        { nombre: 'Jaiver Sáenz León' },
        { nombre: 'Laura Sáenz Arenas' },
        { nombre: 'Brian Sáenz Arenas' },
        { nombre: 'Lina Campuzano' },
        { nombre: 'Paulina Sáenz Campuzano' },
        { nombre: 'Antonella Sáenz Campuzano' },
        { nombre: 'Diego Sáenz Arenas' },
        { nombre: 'Maria Arenas Cardona' },
        { nombre: 'German Sáenz León' },
        { nombre: 'Yaneth Amaya' },
        { nombre: 'Natalia Sáenz Amaya' },
        { nombre: 'David Olarte' },
        { nombre: 'Daniel Echeverry Sáenz' },
        { nombre: 'Luz Mary Sáenz León' },
        { nombre: 'Esteban Echeverry Sáenz' },
        { nombre: 'Andrés Echeverry Sáenz' },
        { nombre: 'Daniel Echeverry' },
        { nombre: 'José Echeverry' },
        { nombre: 'Isabella Ortiz' },
        { nombre: 'Sarabella Echeverry Ortiz' },
        { nombre: 'Ehimar Sáenz León' },
        { nombre: 'Paola García' },
        { nombre: 'Wilver Sáenz León' },
        { nombre: 'Luz Elena Gómez' },
        { nombre: 'Alejandro Sáenz Gómez' },
        { nombre: 'Juan Manuel Sáenz Gómez' },
        { nombre: 'Carolina Giraldo' },
        { nombre: 'Luz Aida Hincapié' },
        { nombre: 'Nelsida Hincapié' },
        { nombre: 'Socorro Hincapié' },
        { nombre: 'Alexander Giraldo Nieto' },
        { nombre: 'Adriana Sáenz' },
        { nombre: 'Isabella Giraldo Sáenz' },
        { nombre: 'Alejandro Paz' },
        { nombre: 'Alberto Sáenz Ojeda' },
        { nombre: 'Nora de Saenz' },
        { nombre: 'Miriam Nieto' },
        { nombre: 'Luz Marina Restrepo' },
        { nombre: 'Rosmira Nieto' },
        { nombre: 'Patricia Giraldo Nieto' },
        { nombre: 'Luis Romero' },
        { nombre: 'Camila Romero Giraldo' },
        { nombre: 'Fabio Giraldo' },
        { nombre: 'Rosalba Moreno' },
        { nombre: 'Wilmer Arcos' },  
        { nombre: 'Viviana Giraldo Nieto' },
        { nombre: 'Amy Arcos Giraldo' },
      ]
    },
    {
      nombre: 'Amigos', invitados: [
        { nombre: 'Ana Otero' },
        { nombre: 'Andrés Prado' },
        { nombre: 'Laura Lozada' },
        { nombre: 'Andrea Flor' },
        { nombre: 'Andrés Palomar' },
        { nombre: 'Dayana Zuluaga' },
        { nombre: 'Johan Angulo' },
        { nombre: 'Johanna Caicedo' },
        { nombre: 'Mariana López' },
        { nombre: 'Melissa Trejos' },
        { nombre: 'Nelson Herrera' },
        { nombre: 'Laura Valencia' },
        { nombre: 'Oscar Sosa' },
        { nombre: 'Octavio Gómez' },
        { nombre: 'Lida Gómez' },
        { nombre: 'Valeria Vargas' },
        { nombre: 'Alvaro Fernandez' },
        { nombre: 'Andrés Sanchez' },
        { nombre: 'Lina Rivera' },
        { nombre: 'Mauricio Sanchez' },
        { nombre: 'Samuel Sanchez' },
        { nombre: 'Mario Delgado' },
        { nombre: 'Patricia Atehortua' },
        { nombre: 'Santiago Delgado' },
        { nombre: 'Edwin Marin' },
        { nombre: 'Veronica Tamayo' },
        { nombre: 'Laura Marin' },
        { nombre: 'Elmer Reina' },
        { nombre: 'Jessica Rojas' },
        { nombre: 'Juan Martin Reina' }
      ]
    }
  ];

  dataConfirmacion: any = {};

  constructor(
    private readonly funcionesGeneralesService: FuncionesGeneralesService,
    public dialogRef: MatDialogRef<ConfirmarAsistenciaComponent>,
    private readonly sanitizer: DomSanitizer,
    private readonly webServiceService: WebBodasService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = data.id;
  }

  ngOnInit(): void {
    this.funcionesGeneralesService.translate(this.id + 'ConfigApp.familia');
    this.form = this.funcionesGeneralesService.translate(this.id + 'WebBodas.confirmacionInvitados.linkFormulario');
    this.linkForm = this.sanitizer.bypassSecurityTrustResourceUrl(this.form);
    this.obtenerConfirmados();
  }

  // Consultar datos
  obtenerConfirmados() {
    this.webServiceService.getData(`${this.familia}/usuarios`).then((resp: any) => {
      console.log('Datos consultados:', resp);
      if (resp?.length > 0) {
        this.listaInvitadosCompleta.forEach((familia: any) => {
          familia.invitados = familia.invitados.filter((inv: any) => !resp.some((e: any) => e.nombre == inv.nombre));
        });

        this.listaInvitados = this.listaInvitadosCompleta.filter((familia: any) => familia.invitados?.length > 0);
        console.log('this.listaInvitados:', this.listaInvitados)
      } else {
        this.listaInvitados = this.listaInvitadosCompleta;
      }
      this.loading = false;
    });
  }

  enviar() {
    const data: any = [];
    this.dataConfirmacion.invitado.forEach((e: any) => {
        e.asistencia = this.dataConfirmacion.asistencia == '1';
        e.fecha = this.funcionesGeneralesService.formatearFecha(new Date(), 'dd/MM/yyyy');
        if (this.dataConfirmacion.infoAdicional) e.infoAdicional = this.dataConfirmacion.infoAdicional;
        data.push(e);
    });
    
    this.webServiceService.agregarConfirmados(this.familia, data).then(() => {
      this.funcionesGeneralesService.openDialog(this.id + 'WebBodas.confirmacionInvitados.confirmacionOk', this.id + 'WebBodas.confirmacionInvitados.confirmacionOkDetalle', TipoEnum.OK);
      this.cerrar();
    }, ()=> {
      this.funcionesGeneralesService.openDialog(this.id + 'WebBodas.confirmacionInvitados.confirmacionFallo', this.id + 'WebBodas.confirmacionInvitados.confirmacionFalloDetalle', TipoEnum.ERROR)
      this.cerrar();
    });
  }

  cerrar() {
    this.dialogRef.close();
  }

}
