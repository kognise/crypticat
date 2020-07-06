import { useMemo } from 'react'
import Box from './box'
import Text from './text'

// interface TypingUser {
//   nick: string
// }
type TypingUser = string
interface Props {
  typingUsers?: TypingUser[]
}

const getTypingText = (nicknames: string[]) => {
  if (nicknames.length > 0) {
    const terms = []
    let unnickedPeople = 0
    for (let nickname of nicknames) {
      if (nickname) {
        terms.push(nickname)
      } else {
        unnickedPeople++
      }
    }

    if (unnickedPeople === 1) {
      terms.push('an unnicked person')
    } else if (unnickedPeople > 1) {
      terms.push(`${unnickedPeople} unnicked people`)
    }

    if (terms.length === 1) {
      return `${terms[0]} is typing...`
    } else if (terms.length === 2) {
      return `${terms[0]} and ${terms[1]} are typing...`
    } else if (terms.length < 5) {
      return `${terms.slice(0, -1).join(', ')}, and ${
        terms[terms.length - 1]
      } are typing...`
    } else {
      return `${nicknames.length} people are typing...`
    }
  }
}

export default ({ typingUsers = [] }: Props) => {
  const typingText = useMemo(() => getTypingText(typingUsers), [ typingUsers ])

  if (typingUsers.length > 0) {
    return (
      <Box background='main' px={24} py={16}>
        <Text color='text-normal' size="sm">
          {typingText}
        </Text>
      </Box>
    )
  }

  return null
}
