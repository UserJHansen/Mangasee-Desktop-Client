export default interface PostResult {
  PostID: string;
  UserID: string;
  Username: string;
  PostTitle: string;
  PostContent: string;
  PostType: string;
  TimePosted: string;
  Notification: string;
  Comments: PostComment[];
}

interface PostComment {
  CommentID: string;
  UserID: string;
  Username: string;
  CommentContent: string;
  TimeCommented: string;
  ReplyCount: string;
  LikeCount: string;
  Liked: boolean;
  ShowReply: boolean;
  Replying: boolean;
  ReplyLimit: number;
  ReplyMessage: string;
  Replies: CommentComment[];
}

interface CommentComment {
  CommentID: string;
  UserID: string;
  Username: string;
  CommentContent: string;
  TimeCommented: string;
}
