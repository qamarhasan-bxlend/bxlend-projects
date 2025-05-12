import styled from 'styled-components';

export const WalletTransactionContainer = styled.div`
  background: linear-gradient(135deg, #172a4f, #66ff99);
  padding: 1.25rem;
  border-radius: 0.75rem;
  width: 31.25rem;
  margin: auto;
  color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

export const WalletTransactionSection = styled.div`
  margin-bottom: 1.25rem;
  position: relative;
`;

export const WalletTransactionInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: none;
  border-bottom: 2px solid #66ff99;
  background: linear-gradient(135deg, rgba(23, 42, 79, 0.9), rgba(50, 50, 50, 0.5));
  color: #fff;
  margin-bottom: 0.62rem;
  outline: none;
  font-size: 1rem;
  transition: border-bottom-color 0.3s ease;

  &:focus {
    border-bottom-color: #fff;
  }
`;

export const WalletTransactionSwitchButton = styled.button`
  background-color: #172a4f;
  color: #66ff99;
  border: 1px solid #66ff99;
  padding: 0.62rem;
  border-radius: 50%;
  width: 3.12rem;
  cursor: pointer;
  font-size: 1.12rem;
  margin-top: -0.62;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #66ff99;
    color: #172a4f;
  }
`;

export const WalletTransactionCurrency = styled.div`
  position: absolute;
  top: 2.87rem;
  right: 0.87rem;
  font-size: 0.75rem;
  color: #66ff99;
`;

export const WalletSwitchContainer = styled.div`
  text-align: center;
  margin-bottom: 1.25rem;
`;

export const WalletMaxBalanceContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const WalletMaxBalance = styled.div`
  font-size: 0.87rem;
  color: #66ff99;
`;

export const WalletTitle = styled.div`
  margin-bottom: 0.62rem;
  color: #fff;
  font-size: 1.12rem;
`;

export const EnterAmountButton = styled.button`
  background: linear-gradient(135deg, #66ff99, #172a4f);
  color: #fff;
  border: none;
  padding: 0.62rem 1.25rem;
  border-radius: 0.31rem;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1.25rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, color 0.3s ease;
  display: block;
  margin: 1.25rem auto 0; /* Center the button horizontally */

  &:hover {
    background-color: #172a4f;
    color: #66ff99;
  }
`;
