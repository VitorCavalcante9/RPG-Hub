import { EntityRepository, Repository } from 'typeorm';
import { Scenario } from '../models/Scenario';

@EntityRepository(Scenario)
class ScenariosRepository extends Repository<Scenario> {}

export { ScenariosRepository }