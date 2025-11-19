import type { Role } from '@loltimeflash/shared';
import { ROLES } from '@loltimeflash/shared';
import { IsEnum } from 'class-validator';

export class FlashActionDto {
  @IsEnum(ROLES, {
    message: 'Role must be one of: TOP, JUNGLE, MID, ADC, SUPPORT',
  })
  role: Role;
}
