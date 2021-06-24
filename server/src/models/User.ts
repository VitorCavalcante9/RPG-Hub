import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import {v4 as uuid} from 'uuid';
import bcrypt from 'bcryptjs';

import { Rpg } from './Rpg';
import { RpgParticipants } from './RpgParticipants';
import { Notes } from './Notes';
import { PermissionChange } from './PermissionChange';
import { Image } from './Image';

@Entity('users')
class User{
  @PrimaryColumn()
  readonly id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: string;

  constructor(){
    if(!this.id) this.id = uuid();
  }

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword(){
    this.password = bcrypt.hashSync(this.password, 8);
  }

  @OneToMany(() => Rpg, rpg => rpg.user, {
    cascade: ['insert', 'update', 'remove']
  })
  @JoinColumn({name: 'user_id'})
  rpgs: Rpg[];

  @OneToOne(() => Image, image => image.user, {
    cascade: ['insert', 'update', 'remove']
  })
  icon: Image;

  @OneToMany(() => RpgParticipants, rpgs_participant => rpgs_participant.user, {
    cascade: ['insert', 'update', 'remove']
  })
  @JoinColumn({name: 'user_id'})
  rpgs_participant: RpgParticipants[];

  @OneToMany(() => Notes, notes => notes.user, {
    cascade: ['insert', 'update', 'remove']
  })
  @JoinColumn({name: 'user_id'})
  notes: Notes[];
}

export { User }