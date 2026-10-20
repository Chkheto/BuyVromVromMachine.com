import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreYouSure } from './are-you-sure';

describe('AreYouSure', () => {
  let component: AreYouSure;
  let fixture: ComponentFixture<AreYouSure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreYouSure]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreYouSure);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
