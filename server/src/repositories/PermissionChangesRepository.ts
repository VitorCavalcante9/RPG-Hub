import { EntityRepository, Repository } from 'typeorm';
import { PermissionChange } from '../models/PermissionChange';

@EntityRepository(PermissionChange)
class PermissionChangeRepository extends Repository<PermissionChange> {}

export { PermissionChangeRepository }