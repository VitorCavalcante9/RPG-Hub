import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Character } from './Character';
import { Rpg } from './Rpg';
import { User } from './User';

@Entity('rpg_participants')
class RpgParticipants{
  @Column()
  user_id: string;
  
  @Column()
  rpg_id: string;
  
  @Column()
  character_id: string;

  @ManyToOne(() => User, user => user.rpgs_participant)
  @JoinColumn({name: 'user_id'})
  user: User;

  @ManyToOne(() => Rpg, rpg => rpg.participants)
  @JoinColumn({name: 'rpg_id'})
  rpg: Rpg;

  @ManyToOne(() => Character, character => character.participant)
  @JoinColumn({name: 'character_id'})
  character: Character;
}

export { RpgParticipants }