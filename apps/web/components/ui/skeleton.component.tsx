import { cn } from '@/lib/utils'

interface ISkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const Skeleton = (props: ISkeletonProps) => {
  const { className, ...rest } = props

  return (
    <div
      className={cn('bg-primary/10 animate-pulse rounded-md', className)}
      {...rest}
    />
  )
}
