import { Skeleton } from '../../skeleton'

const DialogCoverLoader: React.FC = () => {
  return (
    <>
      <div className="w-1/5 h-auto flex flex-col gap-2 justify-start items-center p-4">
        <Skeleton className="w-14 h-14" />
        <Skeleton className="w-16 h-2 rounded-sm" />
      </div>

      <ul className="w-4/5 h-full flex flex-wrap gap-4 justify-start items-center p-4">
        {Array.from({ length: 9 }).map((_, index) => (
          <li
            className="cursor-pointer flex flex-col gap-2 justify-start items-center transition-all hover:scale-110"
            key={index}
          >
            <Skeleton className="w-28 h-28 rounded-sm" />
            <Skeleton className="w-28 h-2 rounded-sm" />
          </li>
        ))}
      </ul>
    </>
  )
}

export default DialogCoverLoader
