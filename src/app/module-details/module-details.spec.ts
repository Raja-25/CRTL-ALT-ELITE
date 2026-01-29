import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleDetails } from './module-details';

describe('ModuleDetails', () => {
  let component: ModuleDetails;
  let fixture: ComponentFixture<ModuleDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModuleDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
