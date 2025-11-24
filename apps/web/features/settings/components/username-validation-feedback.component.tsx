import { cn } from '@/lib/utils'
import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from '@loltimeflash/shared'
import { memo } from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa'

interface IUsernameValidationFeedbackProps {
  usernameLength: number
  className?: string
}

const UsernameValidationFeedbackComponent = (
  props: IUsernameValidationFeedbackProps
) => {
  const { usernameLength, className } = props

  const isMinLengthValid = usernameLength >= MIN_USERNAME_LENGTH
  const isMaxLengthValid = usernameLength <= MAX_USERNAME_LENGTH

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center gap-2">
        {isMinLengthValid ? (
          <FaCheck className="h-3 w-3 text-green-500" />
        ) : (
          <FaTimes className="h-3 w-3 text-red-700" />
        )}
        <p
          className={cn('text-xs text-gray-400', {
            'text-green-500': isMinLengthValid,
            'text-red-700': !isMinLengthValid,
          })}
        >
          Must be at least {MIN_USERNAME_LENGTH} characters
        </p>
      </div>

      <div className="flex items-center gap-2">
        {isMaxLengthValid ? (
          <FaCheck className="h-3 w-3 text-green-500" />
        ) : (
          <FaTimes className="h-3 w-3 text-red-700" />
        )}
        <p
          className={cn('text-xs text-gray-400', {
            'text-green-500': isMaxLengthValid,
            'text-red-700': !isMaxLengthValid,
          })}
        >
          Must not exceed {MAX_USERNAME_LENGTH} characters
        </p>
      </div>
    </div>
  )
}

export const UsernameValidationFeedback = memo(
  UsernameValidationFeedbackComponent
)
