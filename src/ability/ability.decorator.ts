import { SetMetadata } from '@nestjs/common';
import { Subjects } from './ability.factory';
import { Action } from './action.enum';

export interface RequiredRule {
  action: Action;
  subject: Subjects;
}

export const CHECK_ABILITY = 'check_ability';

export const CheckAbilities = (...abilities: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY, abilities);
