import { IsEnum } from 'class-validator'
import { ROLES } from '../../shared/constants/roles'
import type { Role } from '../../shared/types/game.types'

export class FlashActionDto {
  @IsEnum(ROLES, { message: 'Role must be one of: TOP, JUNGLE, MID, ADC, SUPPORT' })
  role: Role
}

