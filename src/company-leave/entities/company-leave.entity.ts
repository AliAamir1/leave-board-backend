import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

@Entity()
export class CompanyLeave {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  LeaveType: string;

  @Column()
  DateRange: string;
}
