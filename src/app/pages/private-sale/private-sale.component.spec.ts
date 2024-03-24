import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateSaleComponent } from './private-sale.component';

describe('PrivateSaleComponent', () => {
  let component: PrivateSaleComponent;
  let fixture: ComponentFixture<PrivateSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivateSaleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrivateSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
