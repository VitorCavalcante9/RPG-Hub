import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Rpg } from './Rpg';

@Entity('objects')
class ObjectItem{
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  rpg_id: string;

  @Column()
  name: string;

  @Column()
  image: string;

  @ManyToOne(() => Rpg, rpg => rpg.objects)
  @JoinColumn({name: 'rpg_id'})
  rpg: Rpg;
}

export { ObjectItem }