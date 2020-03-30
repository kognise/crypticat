import { useState } from 'react'
import { getSpaceStyles } from '../lib/stylegen'

type Props = {
  onSend: (content: string) => void
  room: string
}

export default ({ onSend, room }: Props) => {
  const [content, setContent] = useState('')

  return (
    <form onSubmit={(event) => {
      event.preventDefault()
      onSend(content)
      setContent('')
    }}>
      <input type='text' onChange={(event) => setContent(event.target.value)} value={content} placeholder={`Send a message in #${room}`} />
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
    </form>
  )
}