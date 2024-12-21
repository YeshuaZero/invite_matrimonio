import { SharedModule } from 'src/app/core/shared/shared.module';
import { Component } from '@angular/core';
import { PanelService } from './panel.service';
import { FuncionesGeneralesService} from 'src/app/core/funciones-generales.services';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-panel',
  standalone: true,
  providers: [PanelService],
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
  imports: [SharedModule, MatButtonModule, MatMenuModule, CarouselModule]
})
export class PanelComponent {

  fechaActual = new Date();

  listaInfoIncluye: any = [
    { icono: 'fas fa-wrench', titulo: 'Inicio.infoIncluye.personalizaTitulo', detalle: 'Inicio.infoIncluye.personalizaDesc' },
    { icono: 'fas fa-user-cog', titulo: 'Inicio.infoIncluye.administraTitulo', detalle: 'Inicio.infoIncluye.administraDesc' },
    { icono: 'fas fa-paper-plane', titulo: 'Inicio.infoIncluye.envioTitulo', detalle: 'Inicio.infoIncluye.envioDesc' },
    { icono: 'fas fa-music', titulo: 'Inicio.infoIncluye.musicaTitulo', detalle: 'Inicio.infoIncluye.musicaDesc' },
    { icono: 'fas fa-hourglass-half', titulo: 'Inicio.infoIncluye.cuentaRegresivaTitulo', detalle: 'Inicio.infoIncluye.cuentaRegresivaDesc' },
    { icono: 'fas fa-church', titulo: 'Inicio.infoIncluye.ceremoniaTitulo', detalle: 'Inicio.infoIncluye.ceremoniaDesc' },
    { icono: 'fas fa-glass-cheers', titulo: 'Inicio.infoIncluye.fiestaTitulo', detalle: 'Inicio.infoIncluye.fiestaDesc' },
    { icono: 'fas fa-camera-retro', titulo: 'Inicio.infoIncluye.galeriaTitulo', detalle: 'Inicio.infoIncluye.galeriaDesc' },
    { icono: 'fas fa-user-tie', titulo: 'Inicio.infoIncluye.vestuarioTitulo', detalle: 'Inicio.infoIncluye.vestuarioDesc' },
    { icono: 'fas fa-gift', titulo: 'Inicio.infoIncluye.regalosTitulo', detalle: 'Inicio.infoIncluye.regalosDesc' },
    { icono: 'fas fa-vote-yea', titulo: 'Inicio.infoIncluye.confirmacionTitulo', detalle: 'Inicio.infoIncluye.confirmacionDesc' },
    { icono: 'fab fa-instagram', titulo: 'Inicio.infoIncluye.instagramTitulo', detalle: 'Inicio.infoIncluye.instagramDesc' },
  ];

  planClassic = {
    id: 1, titulo: 'Inicio.precios.plan1', valor: 'Inicio.precios.valor1', caracteristicas: [
      { info: 'Inicio.precios.caracteristicas.nro1' },
      { info: 'Inicio.precios.caracteristicas.nro2' },
      { info: 'Inicio.precios.caracteristicas.nro3' }
    ]
  };

  planVIP = {
    id: 2, titulo: 'Inicio.precios.plan2', valor: 'Inicio.precios.valor2', caracteristicas: [
      { info: 'Inicio.precios.caracteristicas.nro1Pro' },
      { info: 'Inicio.precios.caracteristicas.nro2Pro' },
      { info: 'Inicio.precios.caracteristicas.nro3Pro' }
    ]
  };

  constructor(
    private readonly funcionesGenerales: FuncionesGeneralesService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
  }

  scroll(div: string){
    this.funcionesGenerales.scroll(div);
  }

}