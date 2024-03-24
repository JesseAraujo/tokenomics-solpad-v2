import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FairLaunchComponent } from './fair-launch.component';

describe('FairLaunchComponent', () => {
  let component: FairLaunchComponent;
  let fixture: ComponentFixture<FairLaunchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FairLaunchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FairLaunchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
