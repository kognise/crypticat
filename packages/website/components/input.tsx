import { PropsWithChildren } from 'react'
import { MarginProps } from '../lib/types'
import { getSpaceStyles } from '../lib/stylegen'

type Props = {
  onChange?: (value: string) => void
  value?: string
  type?: 'text' | 'email' | 'password'
  placeholder: string
} & MarginProps

export default ({
  onChange, value, placeholder, type = 'text',
  m, mx, my, ml, mr, mt, mb
}: Props) => (<>
  <input type={type} onChange={(event) => onChange && onChange(event.target.value)} value={value} placeholder={placeholder} />
  <style jsx>{`
    input {
      ${getSpaceStyles({ m, mx, my, ml, mr, mt, mb, px: 16 })}
      font-size: var(--font-sm);

      width: 100%;
      max-width: 408px;
      height: var(--field-height);
      line-height: var(--field-height);

      background-color: var(--background-input);
      border: 0;
      color: #FFFFFF;

      display: block;
      border-radius: var(--radius-sm);
      box-sizing: border-box;
      vertical-align: middle;
    }

    ::placeholder {
      color: var(--text-muted);
    }
  `}</style>
</>)