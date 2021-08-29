import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Image } from './Image';
import { PermissionChange } from './PermissionChange';
import { Rpg } from './Rpg';
import { RpgParticipants } from './RpgParticipants';

interface Status {
  name: string;
  color: string;
  current: number;
  limit: number;
}

interface Skills {
  name: string;
  current: number;
  limit: number;
}

@Entity('characters')
class Character {
  @PrimaryColumn()
  readonly id: string;

  @Column()
  name: string;

  @Column()
  rpg_id: string;

  // @Column('json')
  // inventory?: string[];

  // @Column('json')
  // status?: Status[];

  // @Column('json')
  // skills?: Skills[];

  @Column('json')
  sheet: any[];

  // @Column()
  // limitOfPoints?: number;

  constructor() {
    if (!this.id) this.id = uuid();
  }

  @ManyToOne(() => Rpg, (rpg) => rpg.characters)
  @JoinColumn({ name: 'rpg_id' })
  rpg: Rpg;

  @OneToOne(() => Image, (image) => image.character, {
    cascade: ['insert', 'update', 'remove'],
  })
  icon: Image;

  @OneToOne(
    () => RpgParticipants,
    (rpgs_participant) => rpgs_participant.character
  )
  participant: RpgParticipants;

  @OneToOne(() => PermissionChange, (permission) => permission.character, {
    cascade: ['insert', 'update', 'remove'],
  })
  permission: PermissionChange;
}

export { Character };
