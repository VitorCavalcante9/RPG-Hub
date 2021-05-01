import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Character } from './Character';
import { Rpg } from './Rpg';

@Entity('permission_change')
class PermissionChange{
  @PrimaryGeneratedColumn('increment')
  id: number;
  
  @Column()
  rpg_id: string;
  
  @Column()
  character_id: string;
  
  @Column()
  permission: boolean;

  @ManyToOne(() => Rpg, rpg => rpg.permissions)
  @JoinColumn({name: 'rpg_id'})
  rpg: Rpg;

  @OneToOne(() => Character, character => character.permission)
  @JoinColumn({name: 'character_id'})
  character: Character;
}

export { PermissionChange }