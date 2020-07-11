import { useMemo, memo } from 'react'
import underline from '../lib/plugins/underline'

import Markdown from 'markdown-it'
import mila from 'markdown-it-link-attributes'
import emoji from 'markdown-it-emoji'

export type InlineTypes = 'text' | 'newline' | 'escape' | 'backticks' | 'strikethrough' | 'emphasis' | 'link' | 'image' | 'autolink' | 'html_inline' | 'entity'
export type BlockTypes = 'table' | 'code' | 'fence' | 'blockquote' | 'hr' | 'list' | 'reference' | 'heading' | 'lheading' | 'html_block' | 'paragraph'

type Props = {
  inlineAllowed?: InlineTypes[]
  blockAllowed?: BlockTypes[]
  linkify?: boolean
  className?: string
  text: string
}

export default memo(({ inlineAllowed = [], blockAllowed = [], linkify, className, text }: Props) => {
  const md = useMemo(() => {
    const md = new Markdown('zero', { linkify })
      .use(underline)
      .use(emoji)
      .use(mila, {
        attrs: {
          target: '_blank',
          rel: 'noopener'
        }
      })
    
    md.enable(inlineAllowed).enable(blockAllowed)

    if (linkify) {
      md.enable('linkify')
      md.linkify.set({ fuzzyLink: false, fuzzyEmail: false })
    }

    return md
  }, [ inlineAllowed, blockAllowed, linkify ])
  
  const html = useMemo(() => md.render(text), [ text, md ])

  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
  )
})