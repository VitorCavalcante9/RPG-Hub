import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import {v4 as uuid} from 'uuid';
import { Character } from './Character';
import { Notes } from './Notes';
import { Rpg } from './Rpg';
import { User } from './User';

@Entity('rpg_participants')
class RpgParticipants{
  @PrimaryColumn()
  readonly id: string;

  @Column()
  user_id: string;
  
  @Column()
  rpg_id: string;
  
  @Column()
  character_id: string;

  constructor(){
    if(!this.id) this.id = uuid();
  }

  @ManyToOne(() => User, user => user.rpgs_participant)
  @JoinColumn({name: 'user_id'})
  user: User;

  @ManyToOne(() => Rpg, rpg => rpg.participants)
  @JoinColumn({name: 'rpg_id'})
  rpg: Rpg;

  @OneToOne(() => Character, character => character.permission)
  @JoinColumn({name: 'character_id'})
  character: Character;

  @OneToMany(() => Notes, notes => notes.rpgParticipant, {
    cascade: ['insert', 'update', 'remove']
  })
  @JoinColumn({name: 'rpg_id'})
  notes: Notes[];
}

export { RpgParticipants }