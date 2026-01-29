import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillRatings } from './skill-ratings';

describe('SkillRatings', () => {
  let component: SkillRatings;
  let fixture: ComponentFixture<SkillRatings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillRatings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillRatings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
