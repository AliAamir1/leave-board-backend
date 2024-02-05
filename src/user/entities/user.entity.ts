import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { Leave } from 'src/leave/entities/leave.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  resetKey: string;

  @OneToMany(() => Company, (company) => company.user)
  company: Company[];

  @ManyToMany(() => Company)
  companies: Company[];

  @OneToMany(() => Leave, (leave) => leave.user)
  leave: Leave[];
}
