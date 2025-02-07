import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Applicant } from 'src/applicants/applicant.entity';
import { Action } from './action.enum';

export type Subjects = InferSubjects<typeof Applicant> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  defineAbility(applicant: Applicant) {
    // Can define in JSON and store it database
    const abilityBuilder = new AbilityBuilder<AppAbility>(createMongoAbility);
    abilityBuilder.can(Action.Manage, Applicant, {
      username: applicant.username,
    }); // FIXME Change this that only the owner can manage the applicant's some fields.
    return abilityBuilder.build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    }); // TODO Read Subject Type Detection in CASL
  }
}
