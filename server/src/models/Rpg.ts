import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import {v4 as uuid} from 'uuid';
import { Character } from './Character';
import { ObjectItem } from './Object';
import { RpgParticipants } from './RpgParticipants';
import { Scenario } from './Scenario';
import { User } from './User';

@Entity('rpgs')
class Rpg{
  @PrimaryColumn()
  readonly id: string;

  @Column()
  user_id: string;

  @Column()
  name: string;

  @Column()
  icon: string;

  @Column('json')
  dices: string[];

  @Column('json')
  sheet: {status: [], skills: [], limitOfPoints: number};

  constructor(){
    if(!this.id) this.id = uuid();
  }

  @ManyToOne(() => User, user => user.rpgs)
  @JoinColumn({name: 'user_id'})
  user: User;

  @OneToMany(() => Character, character => character.rpg_id, {
    cascade: ['insert', 'update', 'remove']
  })
  @JoinColumn({name: 'rpg_id'})
  characters: Character[];

  @OneToMany(() => Scenario, scenario => scenario.rpg_id, {
    cascade: ['insert', 'update', 'remove']
  })
  @JoinColumn({name: 'rpg_id'})
  scenarios: Scenario[];

  @OneToMany(() => ObjectItem, objectItem => objectItem.rpg_id, {
    cascade: ['insert', 'update', 'remove']
  })
  @JoinColumn({name: 'rpg_id'})
  objects: ObjectItem[];

  @OneToMany(() => RpgParticipants, rpgs_participant => rpgs_participant.rpg_id, {
    cascade: ['insert', 'update', 'remove']
  })
  @JoinColumn({name: 'rpg_id'})
  participants: RpgParticipants[];
}

export { Rpg }