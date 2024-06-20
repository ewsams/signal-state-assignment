import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Comment } from '../../../models/Comment.model';
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
export class CommentFormDialogComponent implements OnInit {
  commentForm = this.createCommentForm();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CommentFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { postId: number; comment?: Comment }
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.comment) {
      this.commentForm.patchValue({
        name: this.data.comment.name,
        email: this.data.comment.email,
        body: this.data.comment.body,
      });
    }
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

  createCommentForm() {
    return this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      body: ['', Validators.required],
    });
  }

  get name() {
    return this.commentForm.get('name') as FormControl<string>;
  }

  get email() {
    return this.commentForm.get('email') as FormControl<string>;
  }

  get body() {
    return this.commentForm.get('body') as FormControl<string>;
  }
}
