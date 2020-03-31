import { PropsWithChildren } from 'react'
import { ElementName, Background, FlexProps, SpaceProps } from '../lib/types'
import { getFlexStyles, getSpaceStyles } from '../lib/stylegen'

type Props = PropsWithChildren<{
  $?: ElementName
  background?: Background
  fullHeight?: boolean
  fullWidth?: boolean
  scrollfix?: boolean
  [x: string]: any
} & FlexProps & SpaceProps>

export default ({
  $ = 'div', children, background,
  direction, align, expand, justify, flex,
  fullHeight, fullWidth, scrollfix,
  m, mx, my, ml, mr, mt, mb,
  p, px, py, pl, pr, pt, pb,
  ...props
}: Props) => (
    <$ {...props}>
      {children}

      <style jsx>{/* CSS */ `
        ${$} {
          ${getFlexStyles({ direction, align, expand, justify, flex })}
          ${getSpaceStyles({ m, mx, my, ml, mr, mt, mb, p, px, py, pl, pr, pt, pb })}
          background-color: ${background ? `var(--background-${background})` : 'transparent'};
          ${fullHeight ? 'height: 100%;' : ''}
          ${fullWidth ? 'width: 100%;' : ''}
          ${scrollfix ? 'overflow: scroll;' : ''}
        }
      `}</style>
    </$>
  )