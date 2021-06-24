import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Image } from './Image';
import { Rpg } from './Rpg';

@Entity('scenarios')
class Scenario{
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  rpg_id: string;

  @Column()
  name: string;

  @OneToOne(() => Image, image => image.scenario, {
    cascade: ['insert', 'update', 'remove']
  })
  image: Image;

  @ManyToOne(() => Rpg, rpg => rpg.scenarios)
  @JoinColumn({name: 'rpg_id'})
  rpg: Rpg;
}

export { Scenario }