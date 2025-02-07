import { ForbiddenError } from '@casl/ability';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
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

    rules.forEach(
      (rule) =>
        ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject), // FIXME: Not throwing error
    );
    return true;
  }
}
