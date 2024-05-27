import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillShareOverviewComponent } from './skill-share-overview.component';

describe('SkillShareOverviewComponent', () => {
  let component: SkillShareOverviewComponent;
  let fixture: ComponentFixture<SkillShareOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillShareOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SkillShareOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
