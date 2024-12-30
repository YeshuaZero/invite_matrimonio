import { SharedModule } from 'src/app/core/shared/shared.module';
import { Component } from '@angular/core';
import { PanelService } from '../panel.service';
import { FuncionesGeneralesService} from 'src/app/core/funciones-generales.services';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-invitados',
  standalone: true,
  providers: [PanelService],
  templateUrl: './invitados.component.html',
  styleUrls: ['./invitados.component.css'],
  imports: [SharedModule, MatButtonModule, MatMenuModule, CarouselModule]
})
export class InvitadosComponent {

  constructor(
    private readonly funcionesGenerales: FuncionesGeneralesService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
  }


}
