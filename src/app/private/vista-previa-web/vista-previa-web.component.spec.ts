import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaPreviaWebComponent } from './vista-previa-web.component';

describe('VistaPreviaWebComponent', () => {
  let component: VistaPreviaWebComponent;
  let fixture: ComponentFixture<VistaPreviaWebComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VistaPreviaWebComponent]
    });
    fixture = TestBed.createComponent(VistaPreviaWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
