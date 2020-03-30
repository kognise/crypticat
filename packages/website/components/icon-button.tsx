import { PropsWithChildren, ComponentType, SVGProps } from 'react'
import { MarginProps } from '../lib/types'
import { getSpaceStyles } from '../lib/stylegen'

type Props = { onClick?: () => void, icon: ComponentType<SVGProps<SVGSVGElement>> } & MarginProps

export default ({
  onClick, icon: Icon,
  m, mx, my, ml, mr, mt, mb
}: Props) => (
    <button onClick={onClick}>
      <Icon className='icon' />

      <style jsx>{`
        button {
          ${getSpaceStyles({ m, mx, my, ml, mr, mt, mb })}
          font-size: 2rem;

          color: var(--interactive-normal);
          background: none;
          border: 0;
          border-radius: 100%;

          display: block;
          box-sizing: border-box;
          transition: 120ms color ease-in;
        }

        button:hover {
          color: var(--interactive-hover);
        }

        .icon {
          display: block;
        }
      `}</style>
    </button>
  )