import type { Role } from '@loltimeflash/shared';
import { ROLES } from '@loltimeflash/shared';
import { IsEnum, IsIn } from 'class-validator';

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
