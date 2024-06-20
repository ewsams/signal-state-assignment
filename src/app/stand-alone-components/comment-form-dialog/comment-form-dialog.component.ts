import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Comment } from '../../models/Comment.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-comment-form-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './comment-form-dialog.component.html',
  styleUrls: ['./comment-form-dialog.component.scss'],
})
export class CommentFormDialogComponent {
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CommentFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { postId: number; comment?: Comment }
  ) {}

  commentForm = this.createFormGroup();

  createFormGroup() {
    return this.fb.group({
      name: [this.data?.comment?.name || '', Validators.required],
      email: [
        this.data?.comment?.email || '',
        [Validators.required, Validators.email],
      ],
      body: [this.data?.comment?.body || '', Validators.required],
    });
  }

  onSubmit() {
    const commentFormValue = this.commentForm.value;
    const newComment: Comment = {
      postId: this.data.postId,
      id: this.data.comment?.id || Math.floor(Math.random() * 1000),
      name: commentFormValue.name as string,
      email: commentFormValue.email as string,
      body: commentFormValue.body as string,
    };
    this.dialogRef.close(newComment);
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  get name() {
    return this.commentForm.get('name');
  }

  get email() {
    return this.commentForm.get('email');
  }

  get body() {
    return this.commentForm.get('body');
  }
}
