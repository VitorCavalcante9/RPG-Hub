import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import {v4 as uuid} from 'uuid';
import { Rpg } from './Rpg';
import { User } from './User';

@Entity('notes')
class Notes{
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  user_id: string;
  
  @Column()
  rpg_id: string;
  
  @Column('json')
  notes: string[];

  @ManyToOne(() => User, user => user.notes)
  @JoinColumn({name: 'user_id'})
  user: User;

  @ManyToOne(() => Rpg, rpg => rpg.notes)
  @JoinColumn({name: 'rpg_id'})
  rpg: Rpg;
}

export { Notes }