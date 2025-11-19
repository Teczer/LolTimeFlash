import type { Role } from '@app/shared';
import { ROLES } from '@app/shared';
import { IsEnum } from 'class-validator';

export class FlashActionDto {
  @IsEnum(ROLES, {
    message: 'Role must be one of: TOP, JUNGLE, MID, ADC, SUPPORT',
  })
  role: Role;
}
