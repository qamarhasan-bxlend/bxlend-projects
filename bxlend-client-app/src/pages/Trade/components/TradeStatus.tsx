import React, { useEffect, useState } from 'react';

const initialAskAndBid = [
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
];

export type ITradeStatus = {
  offers: never[];
  bids: never[];
  lastPrice: string;
  updatedPrice: string;
};

const TradeStatus = ({ offers, bids, lastPrice, updatedPrice }: ITradeStatus) => {
  const [askData, setAskData] = useState(initialAskAndBid);
  const [bidData, setBidData] = useState(initialAskAndBid);
  const [currency1, setCurrency1] = useState('btc');
  const [currency2, setCurrency2] = useState('usdt');
  const [symbol, setSymbol] = useState<string>();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const symbolFromURL = urlParams.get('pair');
    if (symbolFromURL !== null) {
      setSymbol(symbolFromURL);
    }
  }, []);

  useEffect(() => {
    const currencies = symbol?.split('-');
    if (currencies) {
      setCurrency1(currencies[0]);
      setCurrency2(currencies[1]);
    }
  }, [symbol]);

  useEffect(() => {
    if (offers) {
      setAskData(offers.slice(0, 8));
      setBidData(bids.slice(0, 8));
    }
  }, [offers, bids]);

  return (
    <div className="d-flex flex-column trade-status mb-3">
      <div className="d-flex flex-lg-row flex-column my-2" style={{ alignItems: 'center' }}>
        <div
          className="h1 me-5 trade-status-title"
          style={{ marginBottom: 0 }}
        >{`${currency1.toUpperCase()}/${currency2.toUpperCase()}`}</div>
        <div className="d-flex flex-column trade-status-total-price">
          <div>{`$ ${updatedPrice === '' ? (lastPrice ? lastPrice : '0') : updatedPrice}`}</div>
        </div>
      </div>
      <table className="table table-borderless">
        <thead>
          <tr className="row mt-4">
            <th className="col-5 justify-content-start align-items-center d-flex">Price(USDT)</th>
            <th className="col-4 justify-content-start align-items-center d-flex">
              Amount({currency1.toUpperCase()})
            </th>
            <th className="col-3 justify-content-end align-items-center d-flex pe-3">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className="h3 trade-status-subtitle">Asks</div>
            </td>
          </tr>
        </tbody>
        <tbody>
          {askData?.map((ask, index) => {
            return (
              <tr className="row" key={index}>
                <td className="col-md-5 col-4 justify-content-start align-items-center d-flex ask-item-price">
                  {ask[0]}
                </td>
                <td className="col-4 justify-content-start align-items-center d-flex">{ask[1]}</td>
                <td className="col-md-3 col-4 justify-content-end align-items-center d-flex">
                  {ask[0] * ask[1]}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tbody>
          <tr>
            <td>
              <div className="h3 trade-status-subtitle">Bids</div>
            </td>
          </tr>
        </tbody>
        <tbody>
          {bidData?.map((bid, index) => {
            return (
              <tr className="row" key={index}>
                <td className="col-md-5 col-4 justify-content-start align-items-center d-flex bid-item-price">
                  {bid[0]}
                </td>
                <td className="col-4 justify-content-start align-items-center d-flex">{bid[1]}</td>
                <td className="col-md-3 col-4 justify-content-end align-items-center d-flex">
                  {bid[0] * bid[1]}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TradeStatus;
