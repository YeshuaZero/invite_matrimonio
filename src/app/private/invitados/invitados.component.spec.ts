import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitadosComponent } from './invitados.component';

describe('InvitadosComponent', () => {
  let component: InvitadosComponent;
  let fixture: ComponentFixture<InvitadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InvitadosComponent]
    });
    fixture = TestBed.createComponent(InvitadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
