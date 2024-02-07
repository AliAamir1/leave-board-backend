// export class Leave {}
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  JoinTable,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Leave {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column()
  leaveType: string;

  @Column()
  duration: string;

  @Column()
  status: string;

  @Column()
  date: string;

  @Column()
  comment: string;

  @ManyToOne(() => User, (user) => user.leave)
  user: User;
}
