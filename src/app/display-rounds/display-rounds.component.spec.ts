import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayRoundsComponent } from './display-rounds.component';

describe('DisplayRoundsComponent', () => {
  let component: DisplayRoundsComponent;
  let fixture: ComponentFixture<DisplayRoundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayRoundsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisplayRoundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
