import React, { FC, useEffect, useState } from 'react';
import Image from 'react-bootstrap/esm/Image';
import { useSelector } from 'react-redux';

import { RootState } from 'src/store/store';
import { useDispatch } from 'src/store/useDispatch';
import { fetchCurrencies } from 'src/store/slice/currencies';

import { Container } from 'src/components/Container';
import { Loader } from 'src/components/Loader';
import { FadeInSection } from 'src/components/FadeInSection';
import TableHeader from './TableHeader';

import { getChange24, getCryptoCurrencyLogo, getCurrencyPairs } from 'src/constants';
import { IPairObject, ITicker } from 'src/interfaces';

export type TableDataProps = {
  pairs: IPairObject[];
  tickers: ITicker[];
};

const Table: FC<TableDataProps> = ({ pairs, tickers }) => {
  const [filteredTableData, setFilteredTableData] = useState<ITicker[]>([]);
  const [innerWidth, setInnerWidth] = useState(0);

  const dispatch = useDispatch();
  const { currencies, loading } = useSelector((state: RootState) => state.currencies);

  useEffect(() => {
    if (pairs && tickers) {
      const resultTableData = pairs
        ?.map(({ currencies }) => {
          const pair = `${currencies[0]}/${currencies[1]}`;
          return tickers.find((item) => item.pair === pair);
        })
        .filter(Boolean);

      if (resultTableData) {
        const temp: ITicker[] | undefined = [];
        resultTableData.forEach((result) => {
          if (result) {
            temp.push(result);
          }
        });
        setFilteredTableData(temp);
      }
    }
  }, [pairs, tickers]);

  useEffect(() => {
    if (!currencies.length) {
      dispatch(fetchCurrencies());
    }

    const handleResize = () => setInnerWidth(window.innerWidth);
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {loading ? (
        <Loader size={100} />
      ) : (
        <>
          {filteredTableData.length ? (
            <>
              <FadeInSection>
                <Container fontSize="2.2rem">Popular Cryptocurrencies</Container>
              </FadeInSection>
              <table className="table table-borderless mt-5">
                <TableHeader />
                <tbody>
                  {filteredTableData?.length &&
                    filteredTableData
                      ?.slice(0, 5)
                      .map(({ pair, percent_change_24, last, volume }: any, index: number) => {
                        return (
                          <tr className="table-content row mt-2" key={index}>
                            <td className="col-sm-3 col-4 justify-content-start align-items-center d-flex table-name ps-3">
                              <Image
                                src={getCryptoCurrencyLogo(
                                  currencies,
                                  getCurrencyPairs(pair)[0].toLowerCase(),
                                )}
                                width={24}
                                height={24}
                              />
                              {innerWidth < 768 ? (
                                <div>
                                  <Container marginLeft={innerWidth < 500 ? '0.25rem' : '0.5rem'}>
                                    {getCurrencyPairs(pair)[0]}
                                  </Container>
                                  <div className="second ms-2">{`${pair}`}</div>
                                </div>
                              ) : (
                                <>
                                  <div className="ms-3">{getCurrencyPairs(pair)[0]}</div>
                                  <div className="second ms-2">{`${pair}`}</div>
                                </>
                              )}
                            </td>
                            <td className="col-sm-3 col-2 justify-content-center align-items-center d-flex">
                              ${last}
                            </td>
                            {getChange24(percent_change_24) >= 0 ? (
                              <td className="col-sm-4 col-3 justify-content-center align-items-center d-flex percent-increase">
                                {getChange24(percent_change_24)}%
                              </td>
                            ) : (
                              <td className="col-sm-4 col-3 justify-content-center align-items-center d-flex percent-decrease">
                                {getChange24(percent_change_24)}%
                              </td>
                            )}
                            <td className="col-sm-2 col-3 justify-content-end align-items-center d-flex pe-5">
                              {parseFloat(volume).toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>
            </>
          ) : null}
        </>
      )}
    </div>
  );
};

export default Table;
