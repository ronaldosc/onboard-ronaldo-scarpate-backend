import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;
  @Column()
  name!: string;
  @Column()
  email!: string;
  @Column()
  birthdate!: string;
  @Column({ select: false })
  password!: string;
  @Column({ unique: true })
  salt!: string;
}
