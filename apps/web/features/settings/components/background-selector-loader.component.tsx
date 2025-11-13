/**
 * Background Selector Loader
 * Skeleton loader for background selector sheet
 */

import { Skeleton } from '@/components/ui/skeleton'

export const BackgroundSelectorLoader = () => {
  return (
    <>
      {/* Champion Icon Skeleton */}
      <div className="flex h-auto w-1/5 flex-col items-center justify-start gap-2 p-4">
        <Skeleton className="h-14 w-14" />
        <Skeleton className="h-2 w-16 rounded-sm" />
      </div>

      {/* Skins Grid Skeleton */}
      <ul className="flex h-full w-4/5 flex-wrap items-center justify-start gap-4 p-4">
        {Array.from({ length: 9 }).map((_, index) => (
          <li
            key={index}
            className="flex cursor-pointer flex-col items-center justify-start gap-2 transition-all hover:scale-110"
          >
            <Skeleton className="h-28 w-28 rounded-sm" />
            <Skeleton className="h-2 w-28 rounded-sm" />
          </li>
        ))}
      </ul>
    </>
  )
}

