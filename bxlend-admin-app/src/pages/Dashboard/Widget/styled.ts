import { styled, css } from 'styled-components';

import ArrowDown from 'src/assets/images/ArrowDown.svg';

export const StyledContainer = styled.div<{ isBg?: boolean; hasNegativeMargin?: boolean; alignItems?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: ${({ alignItems }) => (alignItems ? 'center' : 'auto')};

  border-radius: 1.25rem;
  padding: ${({ hasNegativeMargin }) => (hasNegativeMargin ? '1% 2% 0 0' : '4% 6% 0')};
  background: ${({ isBg }) => (isBg ? '#172A4F' : '#fff')};

  .widget_list {
    padding-left: 10%;
  }

  & > ul > li {
    font-family: Inter-Medium;
    padding-bottom: 5%;
  }

  ${(props) =>
    props.hasNegativeMargin &&
    css`
      margin-left: -2vw;
      width: -webkit-fill-available;
    `}
`;

export const StyledWidgetHeader = styled.div<{ hasTitle: boolean }>`
  display: flex;
  justify-content: ${({ hasTitle }) => (hasTitle ? 'space-between' : 'flex-end')};
  align-items: center;
`;

export const StyledWidgetDropdown = styled.button`
  background: transparent;
  background-image: url(${ArrowDown});
  background-size: 12%;
  background-position: right center;
  background-repeat: no-repeat;
  border: none;
  padding: 1vh 2vw;
  cursor: pointer;
`;
