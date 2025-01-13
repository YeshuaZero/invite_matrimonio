import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearNuevoInvitadoComponent } from './crear-nuevo.component';

describe('CrearNuevoInvitadoComponent', () => {
  let component: CrearNuevoInvitadoComponent;
  let fixture: ComponentFixture<CrearNuevoInvitadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CrearNuevoInvitadoComponent]
    });
    fixture = TestBed.createComponent(CrearNuevoInvitadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
