import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Rpg } from './Rpg';
import { Image } from './Image';

@Entity('objects')
class ObjectItem{
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  rpg_id: string;

  @Column()
  name: string;
  
  @OneToOne(() => Image, image => image.object, {
    cascade: ['insert', 'update', 'remove']
  })
  image: Image;

  @ManyToOne(() => Rpg, rpg => rpg.objects)
  @JoinColumn({name: 'rpg_id'})
  rpg: Rpg;
}

export { ObjectItem }