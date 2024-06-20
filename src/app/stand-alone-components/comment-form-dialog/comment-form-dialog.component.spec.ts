import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentFormDialogComponent } from './comment-form-dialog.component';

describe('CommentFormDialogComponent', () => {
  let component: CommentFormDialogComponent;
  let fixture: ComponentFixture<CommentFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
