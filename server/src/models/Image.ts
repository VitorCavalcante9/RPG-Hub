import { BeforeRemove, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DeleteFile, DeleteS3File } from '../services/deleteFile';
import { Character } from './Character';
import { ObjectItem } from './Object';
import { Rpg } from './Rpg';
import { Scenario } from './Scenario';
import { User } from './User';

@Entity('images')
class Image {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  user_id?: string;

  @Column()
  rpg_id?: string;

  @Column()
  character_id?: string;

  @Column()
  scenario_id?: number;

  @Column()
  object_id?: number;

  @Column()
  name: string;

  @Column()
  key: string;

  @Column()
  url: string;

  @BeforeRemove()
  async removeFile(){
    if(this.key){
      if(process.env.STORAGE_TYPE === 's3'){
        await DeleteS3File(this.key);
      } else {
        DeleteFile(this.key);
      }
    }
  }

  @OneToOne(() => User, user => user.icon)
  @JoinColumn({name: 'user_id'})
  user: User;

  @OneToOne(() => Rpg, rpg => rpg.icon)
  @JoinColumn({name: 'rpg_id'})
  rpg: Rpg;

  @OneToOne(() => Character, character => character.icon)
  @JoinColumn({name: 'character_id'})
  character: Character;

  @OneToOne(() => Scenario, scenario => scenario.image)
  @JoinColumn({name: 'scenario_id'})
  scenario: Scenario;

  @OneToOne(() => ObjectItem, object => object.image)
  @JoinColumn({name: 'object_id'})
  object: ObjectItem;

}

export { Image };