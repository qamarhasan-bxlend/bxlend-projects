import React, { useEffect, useState } from 'react';

import { Button } from 'src/components/Button';
import { Container } from 'src/components/Container';
import NoResult from 'src/components/NoResult/NoResult';

import { getSign } from 'src/constants';
import { ITradeData } from 'src/interfaces';

interface ITradeStatus {
  myTradeData: ITradeData[];
}

const MyTrade: React.FC<ITradeStatus> = ({ myTradeData }) => {
  const [tradeData, setTradeData] = useState<ITradeData[]>(myTradeData);
  const [tradeDataType, setTradeDataType] = useState('market');
  const [averagePrice, setAverage] = useState(0);
  const accessToken = localStorage.getItem('access');
  const sign = getSign();

  const urlParams = new URLSearchParams(window.location.search);
  const symbolFromURL = urlParams.get('pair');
  const symbol = symbolFromURL ? symbolFromURL : 'btc-usdt';
  const currencies = symbol.split('-');
  const currency1 = currencies[0];
  const currency2 = currencies[1];

  const getAveragePrice = (data: ITradeData[]) => {
    let averageResult = 0;
    data.forEach((item) => {
      averageResult += parseFloat(item.price);
    });
    return averageResult / myTradeData.length;
  };

  useEffect(() => {
    if (tradeDataType === 'market') {
      setTradeData(myTradeData);
      setAverage(getAveragePrice(myTradeData));
    } else {
      setTradeData([]);
      setAverage(getAveragePrice([]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myTradeData, tradeDataType]);

  return (
    <div className="position-relative">
      <div className="d-flex flex-column my-trade">
        <Container display="flex" justifyContent="space-between">
          <Button
            text="Market Trades"
            type={tradeDataType === 'market' ? 'default' : 'outlined'}
            onClick={() => setTradeDataType('market')}
          />
          <Button
            text="My Trades"
            type={tradeDataType === 'my trade' ? 'default' : 'outlined'}
            onClick={() => setTradeDataType('my trade')}
          />
        </Container>
        <table
          className={`table table-borderless ${
            !accessToken && tradeDataType === 'my trade' ? 'blur-box' : ''
          }`}
        >
          <thead>
            <tr className="row mt-4 mb-3">
              <th className="col-4 justify-content-start align-items-center d-flex">{`Price(${currency2.toUpperCase()})`}</th>
              <th className="col-5 justify-content-center align-items-center d-flex">
                {`Amount(${currency1.toUpperCase()})`}
              </th>
              <th className="col-3 justify-content-end align-items-center d-flex pe-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {tradeData.length ? (
              tradeData.map((item, index) => {
                return (
                  <tr className="row" key={index}>
                    <td
                      className={`col-5 justify-content-start align-items-center d-flex ${
                        parseFloat(item.price) >= averagePrice
                          ? 'increased-item-price'
                          : 'decreased-item-price'
                      }`}
                    >
                      {item.price}
                    </td>
                    <td className="col-4 justify-content-start align-items-center d-flex">
                      {item.amount}
                    </td>
                    <td className="col-3 justify-content-end align-items-center d-flex">
                      {(parseFloat(item.price) * parseFloat(item.amount)).toFixed(4)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td>
                  <NoResult />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {!accessToken && tradeDataType === 'my trade' && (
        <div className="position-absolute blur-text">
          Please <a href={sign}>Login</a> to view order book
        </div>
      )}
    </div>
  );
};

export default MyTrade;
