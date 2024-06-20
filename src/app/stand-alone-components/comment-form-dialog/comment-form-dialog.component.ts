import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Comment } from '../../models/Comment.model';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-comment-form-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormField,
    MatError,
    MatLabel,
  ],
  templateUrl: './comment-form-dialog.component.html',
  styleUrl: './comment-form-dialog.component.scss',
})
export class CommentFormDialogComponent {
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CommentFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { postId: number; comment?: Comment }
  ) {}

  commentForm = this.createFormGroup();

  createFormGroup(comment?: Comment) {
    return this.fb.group({
      name: [comment?.name || '', Validators.required],
      email: [comment?.email || '', [Validators.required, Validators.email]],
      body: [comment?.body || '', Validators.required],
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
    this.dialogRef.close();
  }
}
