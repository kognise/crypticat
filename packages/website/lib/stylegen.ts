import { FlexProps, SpaceProps } from './types'

export const getFlexStyles = (props: FlexProps) => {
  const lines = []

  if (props.expand) {
    if (typeof props.expand === 'number' || typeof props.expand === 'string') {
      lines.push(`flex: ${props.expand};`)
    } else {
      lines.push('flex: 1;')
    }
  }

  if (props.flex) {
    lines.push('display: flex;')

    if (props.align) lines.push(`align-items: ${props.align};`)
    if (props.justify) lines.push(`justify-content: ${props.justify};`)
    if (props.direction) lines.push(`flex-direction: ${props.direction};`)
  }

  return lines.join('\n')
}

export const getSpaceStyles = (props: SpaceProps) => {
  const lines = []

  if (props.m) lines.push(`margin: ${props.m}px;`)
  if (props.mx) {
    lines.push(`margin-left: ${props.mx}px;`)
    lines.push(`margin-right: ${props.mx}px;`)
  }
  if (props.my) {
    lines.push(`margin-top: ${props.my}px;`)
    lines.push(`margin-bottom: ${props.my}px;`)
  }
  if (props.mt) lines.push(`margin-top: ${props.mt}px;`)
  if (props.mb) lines.push(`margin-bottom: ${props.mb}px;`)
  if (props.ml) lines.push(`margin-left: ${props.ml}px;`)
  if (props.mr) lines.push(`margin-right: ${props.mr}px;`)

  if (props.p) lines.push(`padding: ${props.p}px;`)
  if (props.px) {
    lines.push(`padding-left: ${props.px}px;`)
    lines.push(`padding-right: ${props.px}px;`)
  }
  if (props.py) {
    lines.push(`padding-top: ${props.py}px;`)
    lines.push(`padding-bottom: ${props.py}px;`)
  }
  if (props.pt) lines.push(`padding-top: ${props.pt}px;`)
  if (props.pb) lines.push(`padding-bottom: ${props.pb}px;`)
  if (props.pl) lines.push(`padding-left: ${props.pl}px;`)
  if (props.pr) lines.push(`padding-right: ${props.pr}px;`)

  return lines.join('\n')
}