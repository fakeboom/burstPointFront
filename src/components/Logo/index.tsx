import React, { useState } from 'react'
import { HelpCircle } from 'react-feather'
import { ImageProps } from 'rebass'
const reqimgs = (require as any)['context']('../../assets/tokenlogo', true, /\.png$/);

const BAD_SRCS: { [tokenAddress: string]: true } = {}

export interface LogoProps extends Pick<ImageProps, 'style' | 'alt' | 'className'> {
  srcs: string[]
}

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
export default function Logo({ srcs, alt, ...rest }: LogoProps) {
  
  const map = {}
  const [, refresh] = useState<number>(0)

  const src: string | undefined = srcs.find(src => !BAD_SRCS[src])
  const imgsrc = reqimgs.keys().indexOf(src??"") == -1 ? src : reqimgs(src??"")
  if (imgsrc) {
    return (
      <img
        {...rest}
        alt={alt}
        src={imgsrc}
        onError={() => {
          if (src) BAD_SRCS[src] = true
          refresh(i => i + 1)
        }}
      />
    )
  }

  return <HelpCircle {...rest} />
}
