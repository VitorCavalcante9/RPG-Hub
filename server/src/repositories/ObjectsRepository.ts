import { EntityRepository, Repository } from 'typeorm';
import { ObjectItem } from '../models/Object';

@EntityRepository(ObjectItem)
class ObjectsRepository extends Repository<ObjectItem> {}

export { ObjectsRepository }