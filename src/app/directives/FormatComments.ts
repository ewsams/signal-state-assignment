import { Pipe, PipeTransform } from '@angular/core';
import { Comment } from '../models/Comment.model';

@Pipe({
  name: 'formatComments',
  standalone: true,
})
export class FormatCommentsPipe implements PipeTransform {
  transform(comments: Comment[], maxLength: number = 30): string {
    if (!comments || comments.length === 0) {
      return 'No Comments';
    }

    return comments
      .map(
        (comment, index) => `
╔═════════════════════════════════════════╗
║ Comment ${index + 1}:
║ Name: ${comment.name}
║ Email: ${comment.email}
║ Body:
${this.formatBody(comment.body, maxLength)}
╚═════════════════════════════════════════╝
        `
      )
      .join('\n');
  }

  private formatBody(body: string, maxLength: number): string {
    const truncatedBody =
      body.length > maxLength ? body.slice(0, maxLength) + '...' : body;
    return truncatedBody
      .split('\n')
      .map((line) => `║ ${line}`)
      .join('\n');
  }
}
