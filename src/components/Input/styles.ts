import styled, { css } from 'styled-components';
import Tooltip from '../Tooltip';

interface ConteinerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
}

export const Container = styled.div<ConteinerProps>`
  display: flex;
  align-items: center;

  background: #232129;
  border-radius: 10px;

  border: 2px solid #232129;
  color: #666360;

  padding: 16px;
  width: 100%;
  & + div {
    margin-top: 8px;
  }
  ${props =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}
  ${props =>
    props.isFocused &&
    css`
      color: #ff9000;
      border-color: #ff9000;
    `}
  ${props =>
    props.isFilled &&
    css`
      color: #ff9000;
    `}

  input {
    flex: 1;
    border: 0;
    background: transparent;
    color: #f4ede8;

    &::placeholder {
      color: #666360;
    }
  }
  svg {
    margin-right: 16px;
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  svg {
    margin: 0;
    margin-left: 16px;
  }

  span {
    background: #c53030;
    color: #fff;
    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
