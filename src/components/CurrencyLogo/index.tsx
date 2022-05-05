import { Currency, ETHER, Token, ChainId } from '@liuxingfeiyu/zoo-sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import Logo from '../Logo'
import { useActiveWeb3React } from '../../hooks'
import YUZULogo from '../../assets/tokenlogo/0x1fb9F58AFe55b0c5AEF738c60594A54B38E31Dfc/logo.png'

const getTokenLogoURL = (address: string) =>
  `./${address}/logo.png`

const StyledNativeCurrencyLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  background-color: ${({ theme }) => theme.white};
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const { chainId } = useActiveWeb3React()

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []
    if (currency instanceof Token) {

      return [getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency])

  if(currency?.symbol === "YUZU"){
    return <StyledNativeCurrencyLogo size={size} src={YUZULogo} style={style}/>
  }
  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
