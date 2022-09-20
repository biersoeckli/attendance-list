import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuickUserInfoComponent } from './quick-user-info.component';

describe('QuickUserInfoComponent', () => {
  let component: QuickUserInfoComponent;
  let fixture: ComponentFixture<QuickUserInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickUserInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
