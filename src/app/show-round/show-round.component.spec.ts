import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRoundComponent } from './show-round.component';

describe('ShowRoundComponent', () => {
  let component: ShowRoundComponent;
  let fixture: ComponentFixture<ShowRoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowRoundComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
