import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FuncionesGeneralesService, TipoEnum } from 'src/app/core/funciones-generales.services';
import { PanelService } from '../../panel.service';


@Component({
  selector: 'app-crear-nuevo',
  templateUrl: './crear-nuevo.component.html',
  standalone: true,
  styleUrls: ['./crear-nuevo.component.css'],
  imports: [SharedModule, MatRadioModule],
  providers: []
})
export class CrearNuevoInvitadoComponent implements OnInit {

  loading = false;

  dataInvitado: any = {};
  listaGrupos: any = [];

  id: any = '';
  dataWeb: any = {};
  editar: boolean = false;

  constructor(
    private readonly funcionesGeneralesService: FuncionesGeneralesService,
    public dialogRef: MatDialogRef<CrearNuevoInvitadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private panelService: PanelService
  ) {
    if (data){
      this.id = data.id;
      this.dataWeb = data.dataWeb;
      if (data.invitado) {
        this.editar = true;
        this.dataInvitado = {...data.invitado};
      }
    }
  }

  ngOnInit(): void {
    this.dataWeb.Invitados.listaInvitados.forEach((e: any) => {
      if (!this.listaGrupos.some((grupo: any) => grupo.nombre == e.grupo)) this.listaGrupos.push({nombre: e.grupo});
    });
    this.listaGrupos.forEach((e:any, i: number) => {
      e.id = i+1;
    });
    this.listaGrupos.push({id: 0, nombre:'Nuevo Grupo'});
    console.log('this.dataInvitado:', this.dataInvitado)
    this.dataInvitado.grupo = this.listaGrupos.find((e: any) => e.nombre == this.dataInvitado.grupo);
  }

  guardarInvitado() {
    const grupo = !this.listaGrupos || this.listaGrupos?.length == 0 || !this.dataInvitado?.grupo || this.dataInvitado?.grupo.id == 0 ? this.dataInvitado.nombreNuevoGrupo : this.dataInvitado.grupo.nombre;
    const dataInvitado: any = {
      nombre: this.dataInvitado.nombre,
      estado: 0
    };

    if (grupo) dataInvitado.grupo = grupo;
    if (this.dataInvitado.celular) dataInvitado.celular = this.dataInvitado.celular;

    const peticion = this.editar ? this.panelService.editarUser(`dataWeb/${this.id}/Invitados/listaInvitados`, this.dataInvitado.id, dataInvitado) : this.panelService.agregarConfirmado(`dataWeb/${this.id}/Invitados/listaInvitados`, dataInvitado);
    
    peticion.then(() => {
      this.funcionesGeneralesService.openDialog(this.editar ? 'Panel.invitados.invitadoEditadoOK' : 'Panel.invitados.invitadoAgregadoOK', this.editar ? 'Panel.invitados.invitadoEditadoOKDetalle' : 'Panel.invitados.invitadoAgregadoOKDetalle', TipoEnum.OK);
      this.cerrar();
    }, ()=> {
      this.funcionesGeneralesService.openDialog(this.editar ? 'Panel.invitados.invitadoEditadoError' : 'Panel.invitados.invitadoAgregadoError', this.editar ? 'Panel.invitados.invitadoEditadoErrorDetalle' : 'Panel.invitados.invitadoAgregadoErrorDetalle', TipoEnum.ERROR);
    });
  }

  cerrar() {
    if (this.dialogRef) {  
      this.dialogRef.close();
    }
  }

}
