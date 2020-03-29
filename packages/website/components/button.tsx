import { PropsWithChildren } from 'react'
import { MarginProps } from '../lib/types'
import { getSpaceStyles } from '../lib/stylegen'

type Props = PropsWithChildren<{ onClick?: () => void, disabled?: boolean } & MarginProps>

export default ({
  children, onClick, disabled,
  m, mx, my, ml, mr, mt, mb
}: Props) => (
    <button onClick={onClick} disabled={disabled}>
      {children}

      <style jsx>{`
        button {
          ${getSpaceStyles({ m, mx, my, ml, mr, mt, mb, px: 16 })}
          font-size: var(--font-md);

          height: var(--field-height);

          background-color: var(--accent);
          border: 0;
          color: #FFFFFF;
          font-weight: 500;

          display: block;
          border-radius: var(--radius-sm);
          box-sizing: border-box;
          vertical-align: middle;
        }

        button[disabled] {
          cursor: not-allowed;
          filter: grayscale(70%) brightness(110%);
        }
      `}</style>
    </button>
  )