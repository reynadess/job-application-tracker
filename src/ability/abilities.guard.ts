import { ForbiddenError } from '@casl/ability';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_ABILITY, RequiredRule } from './ability.decorator';
import { AbilityFactory } from './ability.factory';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const rules =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
      [];
    const { user } = context.switchToHttp().getRequest(); // FIXME: user is not defined
    const ability = this.abilityFactory.defineAbility(user);

    try {
      rules.forEach(
        (rule) =>
          ForbiddenError.from(ability).throwUnlessCan(
            rule.action,
            rule.subject,
          ), // FIXME: Have to integrate nest-casl, so that we can implement hooks to compare accessing resource with the user's ability
      );
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
    return true;
  }
}
