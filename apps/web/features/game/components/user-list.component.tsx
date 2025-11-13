interface IUserListProps {
  users: string[]
}

export const UserList = (props: IUserListProps) => {
  const { users } = props

  if (users.length === 0) return null

  return (
    <ul className="fixed bottom-4 left-10 z-50 flex h-auto w-1/6 flex-col items-center justify-center p-4 sm:bottom-auto sm:left-auto sm:right-10 sm:top-10">
      {users.map((user, index) => (
        <li
          key={`${user}-${index}`}
          className="flex w-[300%] items-center justify-start gap-2 sm:w-full"
        >
          <span className="shadow-green h-2 w-2 animate-pulse rounded-full bg-green-600"></span>
          <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
            {user}
          </p>
        </li>
      ))}
    </ul>
  )
}
