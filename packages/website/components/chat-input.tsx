import { useState, FormEvent, ReactEventHandler } from 'react'
import { getSpaceStyles } from '../lib/stylegen'
import Box from './box'

type Props = {
  onSend: (content: string) => void,
  onType: (empty: boolean) => void,
  room: string
}

export default ({ onType, onSend, room }: Props) => {
  const [content, setContent] = useState('')

  const onChange = (event: any) => {
    const value = event.target.value
    setContent(value)
    const empty = value === ""
    onType(empty)
  }
  return (
    <Box $='form' onSubmit={(event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!content.trim()) return
      onSend(content.trim())
      setContent('')
    }}>
      <input type='text' autoFocus onChange={onChange} value={content} placeholder={`Send a message in #${room}`} />
      <style jsx>{`
        input {
          ${getSpaceStyles({ px: 24, py: 28 })}
          font-size: var(--font-md);
          font-family: inherit;
          width: 100%;

          background-color: var(--background-input);
          border: 0;
          color: #FFFFFF;

          display: block;
          box-sizing: border-box;
        }

        ::placeholder {
          color: var(--text-muted);
        }
      `}</style>
    </Box>
  )
}