import { Component, Inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FuncionesGeneralesService } from 'src/app/core/funciones-generales.services';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-confirmar-asistencia',
  templateUrl: './confirmar-asistencia.component.html',
  standalone: true,
  styleUrls: ['./confirmar-asistencia.component.css'],
  imports: [SharedModule, MatRadioModule],
  providers: []
})
export class ConfirmarAsistenciaComponent implements OnInit {

  loading = false;
  form = this.funcionesGeneralesService.translate('Inicio.confirmacionInvitados.linkFormulario');
  linkForm = this.sanitizer.bypassSecurityTrustResourceUrl(this.form);


  constructor(
    private funcionesGeneralesService: FuncionesGeneralesService,
    public dialogRef: MatDialogRef<ConfirmarAsistenciaComponent>,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
  }

  busquedaMundial() {
  }

  cerrar() {
    this.dialogRef.close();
  }

}
