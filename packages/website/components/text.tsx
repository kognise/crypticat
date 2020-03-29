import { PropsWithChildren } from 'react'
import { ElementName, FontSize, Color, MarginProps } from '../lib/types'
import { getSpaceStyles } from '../lib/stylegen'

type Props = PropsWithChildren<{
  $?: ElementName, size?: FontSize, color?: Color
  weight?: 400 | 500 | 600 | 700
  centered?: boolean
} & MarginProps>

export default ({
  $ = 'p', children, size = 'md', color = 'text-normal', weight = 400,
  m, mx, my, ml, mr, mt, mb,
  centered
}: Props) => (
    <$>
      {children}

      <style jsx>{`
        ${$} {
          ${getSpaceStyles({ m, mx, my, ml, mr, mt, mb })}
          font-size: var(--font-${size});
          color: var(--${color});
          font-weight: ${weight};
          text-align: ${centered ? 'center' : 'left'};
        }
      `}</style>
    </$>
  )