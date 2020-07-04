import { PropsWithChildren, Children } from 'react'
import { ElementName } from '../lib/types'
import { getSpaceStyles } from '../lib/stylegen'

import markdown from 'markdown-it'
import underline from 'markdown-it-underline'

type InlineTypes = 'text' | 'newline' | 'escape' | 'backticks' | 'strikethrough' | 'emphasis' | 'link' | 'image' | 'autolink' | 'html_inline' | 'entity'
type BlockTypes = 'table' | 'code' | 'fence' | 'blockquote' | 'hr' | 'list' | 'reference' | 'heading' | 'lheading' | 'html_block' | 'paragraph'

type Props = PropsWithChildren<{
  $?: ElementName;
  inlineAllowed?: InlineTypes[];
  blockAllowed?: BlockTypes[];
  [x: string]: any;
}>


export default ({ $="div", inlineAllowed=[], blockAllowed=[], children }: Props) => {
  const md =  new markdown('zero').use(underline)
  md.enable(inlineAllowed).enable(blockAllowed)

  const parsed = md.render(children?.toString() || '')
  return (
  <$ className="message-markdown" dangerouslySetInnerHTML={{
    __html: parsed
  }} />
  )
}