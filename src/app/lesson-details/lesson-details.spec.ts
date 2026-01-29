import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonDetails } from './lesson-details';

describe('LessonDetails', () => {
  let component: LessonDetails;
  let fixture: ComponentFixture<LessonDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LessonDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
