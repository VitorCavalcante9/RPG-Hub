import { EntityRepository, Repository } from 'typeorm';
import { Notes } from '../models/Notes';

@EntityRepository(Notes)
class NotesRepository extends Repository<Notes> {}

export { NotesRepository }