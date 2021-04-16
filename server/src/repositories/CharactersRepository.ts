import { EntityRepository, Repository } from 'typeorm';
import { Character } from '../models/Character';

@EntityRepository(Character)
class CharactersRepository extends Repository<Character> {}

export { CharactersRepository }