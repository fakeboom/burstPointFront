import { auto } from '@popperjs/core'
import { position } from 'polished'
import React, { useCallback, useState } from 'react'
import { HelpCircle as Question } from 'react-feather'
import styled from 'styled-components'
import Tooltip from '../Tooltip'
import AddIcon from '../../assets/newUI/addIcon.png'

const QuestionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border: none;
  background: none;
  outline: none;
  cursor: default;
  border-radius: 36px;
  color: #666666;
  :hover,
  :focus {
    opacity: 0.7;
  }
`

const LightQuestionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border: none;
  background: none;
  outline: none;
  cursor: default;
  border-radius: 36px;
  width: 24px;
  height: 24px;
  background-color: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.white};

  :hover,
  :focus {
    opacity: 0.7;
  }
`

const AddQuestionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  background: none;
  outline: none;
  cursor: default;
  width: 18px;
  height: 18px;
  font-weight: 600;

  :hover,
  :focus {
    opacity: 0.7;
  }
`

const QuestionMark = styled.span`
  font-size: 1rem;
  margin-top: -2px;
`

export default function QuestionHelper({ text }: { text: string }) {
  const [show, setShow] = useState<boolean>(false)

  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])

  return (
    <span style={{ marginLeft: 4}}>
      <Tooltip text={text} show={show}>
        <QuestionWrapper onClick={open} onMouseEnter={open} onMouseLeave={close}>
          <Question size={12}/>
        </QuestionWrapper>
      </Tooltip>
    </span>
  )
}

export function LightQuestionHelper({ text }: { text: string }) {
  const [show, setShow] = useState<boolean>(false)

  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])

  return (
    <span style={{ marginLeft: 4 }}>
      <Tooltip text={text} show={show}>
        <LightQuestionWrapper onClick={open} onMouseEnter={open} onMouseLeave={close}>
          <QuestionMark>?</QuestionMark>
        </LightQuestionWrapper>
      </Tooltip>
    </span>
  )
}

export function AddQuestionHelper({ text , onClick}: { text: string , onClick: ()=>void}) {
  const [show, setShow] = useState<boolean>(false)

  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])

  return (
    <span style={{ marginLeft: '10px', marginBottom: auto, marginTop: auto, position: 'relative'}} onClick={onClick}>
      <Tooltip text={text} show={show}>
        <AddQuestionWrapper onClick={open} onMouseEnter={open} onMouseLeave={close}>
          <img src={AddIcon} height={'16px'}/>
        </AddQuestionWrapper>
      </Tooltip>
    </span>
  )
}

export function AddQuestionNoCHelper({ text , onClick}: { text: string , onClick: ()=>void}) {
  const [show, setShow] = useState<boolean>(false)

  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])

  return (
    <span style={{ marginLeft: '10px', marginBottom: auto, marginTop: auto, position: 'absolute'}} onClick={onClick}>
      <Tooltip text={text} show={show}>
        <AddQuestionWrapper onClick={open} onMouseEnter={open} onMouseLeave={close}>
          <img src={AddIcon} height={'16px'}/>
        </AddQuestionWrapper>
      </Tooltip>
    </span>
  )
}
