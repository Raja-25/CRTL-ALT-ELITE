import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dropout } from './dropout';

describe('Dropout', () => {
  let component: Dropout;
  let fixture: ComponentFixture<Dropout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Dropout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dropout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
