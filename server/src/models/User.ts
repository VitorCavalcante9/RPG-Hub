import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm';
import {v4 as uuid} from 'uuid';
import bcrypt from 'bcryptjs';

import { Rpg } from './Rpg';
import { RpgParticipants } from './RpgParticipants';

@Entity('users')
class User{
  @PrimaryColumn()
  readonly id: string;

  @Column()
  name: string;

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

  @OneToMany(() => Rpg, rpg => rpg.user_id, {
    cascade: ['insert', 'update', 'remove']
  })
  @JoinColumn({name: 'user_id'})
  rpgs: Rpg[];

  @OneToMany(() => RpgParticipants, rpgs_participant => rpgs_participant.user_id)
  @JoinColumn({name: 'user_id'})
  rpgs_participant: RpgParticipants[];
}

export { User }