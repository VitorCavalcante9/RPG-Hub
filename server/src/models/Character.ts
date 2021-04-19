import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import {v4 as uuid} from 'uuid';
import { Rpg } from './Rpg';
import { RpgParticipants } from './RpgParticipants';

interface Status{
  name: string;
  color: string;
  current: number;
  limit: number;
}

interface Skills{
  name: string;
  current: number;
  limit: number;
}

@Entity('characters')
class Character{
  @PrimaryColumn()
  readonly id: string;

  @Column()
  name: string;

  @Column()
  rpg_id: string;

  @Column()
  icon: string;

  @Column('json')
  inventory: string[];

  @Column('json')
  status: Status[];

  @Column('json')
  skills: Skills[];

  constructor(){
    if(!this.id) this.id = uuid();
  }

  @ManyToOne(() => Rpg, rpg => rpg.characters)
  @JoinColumn({name: 'rpg_id'})
  rpg: Rpg;

  @OneToOne(() => RpgParticipants, rpgs_participant => rpgs_participant.character)
  participant: RpgParticipants;
}

export { Character }