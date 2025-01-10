import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FuncionesGeneralesService, TipoEnum } from 'src/app/core/funciones-generales.services';
import { PanelService } from '../panel.service';
import { WebBodasComponent } from "../../public/web-bodas/web-bodas.component";


@Component({
    selector: 'app-vista-previa-web',
    templateUrl: './vista-previa-web.component.html',
    standalone: true,
    styleUrls: ['./vista-previa-web.component.css'],
    providers: [],
    imports: [SharedModule, MatRadioModule, WebBodasComponent]
})
export class VistaPreviaWebComponent {

  loading = false;

  dataWeb: any = {};
  listaFotosGaleria: any = [];

  constructor(
    public dialogRef: MatDialogRef<VistaPreviaWebComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data){
      this.dataWeb = data.dataWeb;
      this.listaFotosGaleria = data.listaFotosGaleria;
    }
  }

  cerrar() {
    if (this.dialogRef) {  
      this.dialogRef.close();
    }
  }

}
