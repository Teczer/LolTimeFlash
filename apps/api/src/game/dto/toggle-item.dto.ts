import { IsEnum, IsIn } from 'class-validator';
import { ROLES } from '../../shared/constants/roles';
import type { Role } from '../../shared/types/game.types';

const ITEMS = ['lucidityBoots', 'cosmicInsight'] as const;
type Item = (typeof ITEMS)[number];

export class ToggleItemDto {
  @IsEnum(ROLES, {
    message: 'Role must be one of: TOP, JUNGLE, MID, ADC, SUPPORT',
  })
  role: Role;

  @IsIn(ITEMS, {
    message: 'Item must be either lucidityBoots or cosmicInsight',
  })
  item: Item;
}
