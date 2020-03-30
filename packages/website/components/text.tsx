import { PropsWithChildren } from 'react'
import { ElementName, FontSize, Color, MarginProps } from '../lib/types'
import { getSpaceStyles } from '../lib/stylegen'

type Props = PropsWithChildren<{
  $?: ElementName
  size?: FontSize | number
  color?: Color
  weight?: 400 | 500 | 700
  centered?: boolean
  noInteraction?: boolean
  uppercase?: boolean
} & MarginProps>

export default ({
  $ = 'p', children, size = 'md', color = 'text-normal', weight = 400,
  m, mx, my, ml, mr, mt, mb,
  centered, noInteraction, uppercase
}: Props) => (
    <$>
      {children}

      <style jsx>{`
        ${$} {
          ${getSpaceStyles({ m, mx, my, ml, mr, mt, mb })}
          font-size: ${typeof size === 'number' ? `${size}rem` : `var(--font-${size})`};
          color: var(--${color});
          font-weight: ${weight};
          text-align: ${centered ? 'center' : 'left'};
          ${noInteraction ? 'pointer-events: none; user-select: none;' : ''}
          text-transform: ${uppercase ? 'uppercase' : 'none'};
        }
      `}</style>
    </$>
  )