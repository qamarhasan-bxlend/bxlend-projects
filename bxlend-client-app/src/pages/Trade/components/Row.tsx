import React, { FC } from 'react';
import { v4 } from 'uuid';

const Row: FC<{
  cells: {
    date: {
      date: string;
      time: string;
    };
    pair: string;
    direction: string;
    price: string;
    amount: string;
    total: string;
  };
}> = ({ cells }) => {
  const data = Object.values(cells);

  return (
    <>
      {data.map((text) => (
        <span key={v4()}>
          {typeof text === 'string' ? (
            String(text).slice(0, 10)
          ) : (
            <>
              <span>{text.date}</span>
              <br />
              <span>{text.time}</span>
            </>
          )}
        </span>
      ))}
      <span></span>
    </>
  );
};

export default Row;
