import { IsEnum, IsInt, Max, Min } from 'class-validator';
import type { Role } from '@app/shared';

export class AdjustTimerDto {
  @IsEnum(['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'])
  role: Role;

  @IsInt()
  @Min(-10) // Max -10s adjustment
  @Max(10) // Max +10s adjustment
  adjustmentSeconds: number;
}

