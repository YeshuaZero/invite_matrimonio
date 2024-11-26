import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { FuncionesGeneralesService, TipoEnum } from './core/funciones-generales.services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = undefined;
  isAppStandalone: boolean = false;

  constructor(
    private idle: Idle,
    private keepalive: Keepalive,
    private router: Router,
    private funcionesGeneralesService: FuncionesGeneralesService
  ) {
    this.isAppStandalone = this.isStandalone();
    if (this.isAppStandalone) {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.goFullscreen();
        }
      });
    } else {
      // Establecer tiempo de inactividad (30 minutos)
      idle.setIdle(28800);
      // Establecer tiempo de espera después de inactividad (1 minuto)
      idle.setTimeout(60);
      // Establecer las fuentes de interrupción
      idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

      idle.onTimeout.subscribe(() => {
        this.idleState = 'Timed out!';
        this.timedOut = true;
        this.handleLogout();
      });
      idle.onInterrupt.subscribe(() => this.saveState());

      // Configurar Keepalive
      keepalive.interval(15);
      keepalive.onPing.subscribe(() => {
        this.lastPing = new Date()
      });

      this.reset();
    }
  }

  ngOnInit(): void { }

  isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
  }

  goFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  }

  reset(): void {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  saveState() {
    if (this.router.url != '/') {
      localStorage.setItem('lastActivity', new Date().toISOString());
    }
    const ultimaFecha = this.funcionesGeneralesService.getData('lastActivity');
  }

  private handleLogout(): void {
    const token = this.funcionesGeneralesService.getDataLoginToken();
    if (token) {
      this.funcionesGeneralesService.openDialog('General.sesionCerradaPorInactividad', 'General.sesionCerradaPorInactividadDetalle', TipoEnum.WARNING);
      localStorage.clear();
      this.router.navigate(['/']);
    }
    this.reset();
  }
}
