import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from './User';
import { Post } from './Post';

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sentNotifications)
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedNotifications)
  @JoinColumn({ name: 'recipientId' })
  recipient: User;

  @ManyToOne(() => Post, (post) => post.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Column({ type: 'numeric' })
  type: number;

  @Column({ type: 'boolean', default: false })
  read: boolean;

  @CreateDateColumn()
  created_at: Date;
}
