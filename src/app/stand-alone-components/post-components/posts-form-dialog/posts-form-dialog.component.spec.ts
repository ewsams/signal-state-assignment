import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsFormDialogComponent } from './posts-form-dialog.component';

describe('PostsFormDialogComponent', () => {
  let component: PostsFormDialogComponent;
  let fixture: ComponentFixture<PostsFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostsFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
