import { MarginProps } from '../lib/types'
import { getSpaceStyles } from '../lib/stylegen'

type Props = {
  onChange?: (value: string) => void
  value?: string
  type?: 'text' | 'email' | 'password'
  placeholder: string
  autoFocus?: boolean
  [x: string]: any
} & MarginProps

export default ({
  onChange, value, placeholder, type = 'text',
  m, mx, my, ml, mr, mt, mb,
  autoFocus,
  ...props
}: Props) => (<>
  <input autoFocus={autoFocus} type={type} onChange={(event) => onChange && onChange(event.target.value)} value={value} placeholder={placeholder} {...props} />
  <style jsx>{`
    input {
      ${getSpaceStyles({ m, mx, my, ml, mr, mt, mb, px: 16 })}
      font-size: var(--font-sm);
      font-family: inherit;

      width: 100%;
      max-width: 440px;
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