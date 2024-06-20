import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Post } from '../../models/Post.models';

@Component({
  selector: 'app-posts-form-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './posts-form-dialog.component.html',
  styleUrls: ['./posts-form-dialog.component.scss'],
})
export class PostsFormDialogComponent {
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PostsFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { post?: Post }
  ) {}

  postForm = this.createFormGroup();

  createFormGroup() {
    return this.fb.group({
      title: [this.data?.post?.title || '', Validators.required],
      authorName: [this.data?.post?.author.name || '', Validators.required],
      authorEmail: [
        this.data?.post?.author.email || '',
        [Validators.required, Validators.email],
      ],
      body: [this.data?.post?.body || '', Validators.required],
    });
  }

  onSubmit() {
    const postFormValue = this.postForm.value;
    const newPost: Post = {
      userId: this.data?.post?.userId || Math.floor(Math.random() * 1000),
      id: this.data?.post?.id || Math.floor(Math.random() * 1000),
      title: postFormValue.title as string,
      body: postFormValue.body as string,
      author: {
        name: postFormValue.authorName as string,
        email: postFormValue.authorEmail as string,
      },
      metadata: {
        createdAt:
          this.data?.post?.metadata.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      comments: this.data?.post?.comments || [],
    };
    this.dialogRef.close(newPost);
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  get title() {
    return this.postForm.get('title');
  }

  get authorName() {
    return this.postForm.get('authorName');
  }

  get authorEmail() {
    return this.postForm.get('authorEmail');
  }

  get body() {
    return this.postForm.get('body');
  }
}
