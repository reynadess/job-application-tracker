import { Module } from '@nestjs/common';
import { AbilitiesGuard } from './abilities.guard';
import { AbilityFactory } from './ability.factory';

@Module({
  providers: [AbilityFactory, AbilitiesGuard],
  exports: [AbilitiesGuard, AbilityFactory],
})
export class AbilityModule {}
