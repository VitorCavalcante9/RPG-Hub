import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import {v4 as uuid} from 'uuid';
import { Rpg } from './Rpg';
import { RpgParticipants } from './RpgParticipants';

@Entity('characters')
class Character{
  @PrimaryColumn()
  readonly id: string;

  @Column()
  rpg_id: string;

  @Column()
  icon: string;

  @Column('json')
  inventory: string;

  @Column('json')
  status: string;

  @Column('json')
  skills: string;

  constructor(){
    if(!this.id) this.id = uuid();
  }

  @ManyToOne(() => Rpg, rpg => rpg.characters)
  @JoinColumn({name: 'rpg_id'})
  rpg: Rpg;

  @OneToMany(() => RpgParticipants, rpgs_participant => rpgs_participant.character_id)
  @JoinColumn({name: 'character_id'})
  participant: RpgParticipants;
}

export { Character }