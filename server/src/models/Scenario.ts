import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Rpg } from './Rpg';

@Entity('scenarios')
class Scenario{
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  rpg_id: string;

  @Column()
  name: string;

  @Column()
  image: string;

  @ManyToOne(() => Rpg, rpg => rpg.scenarios)
  @JoinColumn({name: 'rpg_id'})
  rpg: Rpg;
}

export { Scenario }