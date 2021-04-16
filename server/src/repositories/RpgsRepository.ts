import { EntityRepository, Repository } from 'typeorm';
import { Rpg } from '../models/Rpg';

@EntityRepository(Rpg)
class RpgsRepository extends Repository<Rpg> {}

export { RpgsRepository }