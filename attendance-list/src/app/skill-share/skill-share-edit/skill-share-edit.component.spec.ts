import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillShareEditComponent } from './skill-share-edit.component';

describe('SkillShareEditComponent', () => {
  let component: SkillShareEditComponent;
  let fixture: ComponentFixture<SkillShareEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillShareEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SkillShareEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
