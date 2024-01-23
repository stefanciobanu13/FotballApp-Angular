import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbPlayersComponent } from './db-players.component';

describe('DbPlayersComponent', () => {
  let component: DbPlayersComponent;
  let fixture: ComponentFixture<DbPlayersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DbPlayersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DbPlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
