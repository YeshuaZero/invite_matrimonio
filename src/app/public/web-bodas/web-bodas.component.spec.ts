import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebBodasComponent } from './web-bodas.component';

describe('WebBodasComponent', () => {
  let component: WebBodasComponent;
  let fixture: ComponentFixture<WebBodasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WebBodasComponent]
    });
    fixture = TestBed.createComponent(WebBodasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
