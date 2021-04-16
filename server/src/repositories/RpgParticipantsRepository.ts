import { EntityRepository, Repository } from 'typeorm';
import { RpgParticipants } from '../models/RpgParticipants';

@EntityRepository(RpgParticipants)
class RpgParticipantsRepository extends Repository<RpgParticipants> {}

export { RpgParticipantsRepository }