export type ElementName = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div' | 'span' | 'header' | 'footer' | 'input' | 'aside' | 'article' | 'main' | 'section'
export type FontSize = 'lg' | 'md' | 'sm'
export type Color = 'heading-primary' | 'heading-secondary' | 'text-normal' | 'text-muted' | 'yellow' | 'blue'
export type Background = 'main' | 'chat' | 'input' | 'header'

export interface FlexProps {
  direction?: 'column' | 'row' | 'column-reverse' | 'row-reverse'
  align?: 'center' | 'flex-start' | 'flex-end'
  justify?: 'center' | 'flex-start' | 'flex-end'
  flex?: boolean
  expand?: number | boolean | string
}

export interface MarginProps {
  m?: number
  mx?: number
  my?: number
  mb?: number
  mt?: number
  mr?: number
  ml?: number
}

export interface PaddingProps {
  p?: number
  px?: number
  py?: number
  pb?: number
  pt?: number
  pr?: number
  pl?: number
}

export type SpaceProps = MarginProps & PaddingProps