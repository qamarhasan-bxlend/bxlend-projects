import React, { FC, useCallback, useEffect, useState } from 'react';
import Image from 'react-bootstrap/esm/Image';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Container } from 'src/components/Container';
import { Button } from 'src/components/Button';
import MarketHeader from './MarketHeader';
import Dropdown from 'src/components/Dropdown';
import NoResult from 'src/components/NoResult/NoResult';

import { useDispatch } from 'src/store/useDispatch';
import { RootState } from 'src/store/store';
import { fetchCurrencyPairs } from 'src/store/slice/currencyPairs';
import { fetchCurrencies } from 'src/store/slice/currencies';

import { ALL_FAV_BTNS, getChange24, getCryptoCurrencyLogo, getCurrencyPairs } from 'src/constants';
import { ITableData, ITicker } from 'src/interfaces';

import '../index.css';

export type TableDataProps = {
  tableData: ITicker[];
};

const TopMarketTable: FC<TableDataProps> = ({ tableData }) => {
  const [filteredTableData, setFilteredTableData] = useState<ITableData[]>([]);
  const [filter, setFilter] = useState('All');

  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.user);
  const { pairs } = useSelector(({ pairs }) => pairs);
  const { currencies } = useSelector((state: RootState) => state.currencies);
  const { isDark } = useSelector(({ isDark }) => isDark);

  const handleInitialFiltering = useCallback(() => {
    const resultTableData = pairs
      ?.map((filteredItem) => {
        const pair = `${filteredItem.currencies[0]}/${filteredItem.currencies[1]}`;
        return { ...tableData?.find((item) => item.pair === pair), id: filteredItem.id };
      })
      .filter(Boolean);

    if (resultTableData) {
      const temp: ITableData[] | undefined = [];
      resultTableData.forEach((result) => {
        if (result) {
          temp.push(result);
        }
      });
      setFilteredTableData(temp);
    }
  }, [pairs, tableData]);

  const filterAll = () => {
    setFilter('All');
    handleInitialFiltering();
  };

  const filterFavourites = () => {
    setFilter('Favourites');
    setFilteredTableData(
      filteredTableData?.filter((c) => user.favorite_currencyPairs.includes(c.id as string)),
    );
  };

  useEffect(() => {
    if (!currencies.length) {
      dispatch(fetchCurrencies());
    }

    if (!pairs.length) {
      dispatch(fetchCurrencyPairs());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleInitialFiltering();
  }, [handleInitialFiltering, pairs, tableData]);

  return (
    <div style={{ height: '100%' }} className="w-100">
      <Container fontSize="1.75rem">Today Top Market</Container>
      <div className="d-flex gap-4 dashboard-market-btn-group my-4">
        <Button text="All" type={filter === 'All' ? 'default' : 'outlined'} onClick={filterAll} />
        <Button
          text="Favourites"
          type={filter === 'Favourites' ? 'default' : 'outlined'}
          onClick={filterFavourites}
        />
      </div>
      <div className="d-none dashboard-market-filter-dropdown dropdown px-2">
        <button type="button" className="btn dropdown-toggle" data-bs-toggle="dropdown">
          Filter
        </button>
        <Dropdown>
          {ALL_FAV_BTNS.map((text, index) => (
            <li key={index}>
              <button className="dropdown-item">{text}</button>
            </li>
          ))}
        </Dropdown>
      </div>
      <table
        className={`table table-borderless dashboard-top-market-table w-100 ${
          isDark ? 'isDark' : ''
        }`}
      >
        <MarketHeader />
        <tbody className="top-market-table">
          {filteredTableData?.map(({ pair, last, percent_change_24 }: any, index: number) => {
            const change24 = getChange24(percent_change_24);
            const pairOne = getCurrencyPairs(pair ?? '')[0];
            const pairTwo = getCurrencyPairs(pair ?? '')[1];
            const dir = change24 >= 0 ? 'increase' : 'decrease';

            return (
              <tr className="table-content row mt-2" key={index}>
                <td className="col-sm-3 col-4 justify-content-start align-items-center d-flex table-name ps-3">
                  <Image
                    src={pair && getCryptoCurrencyLogo(currencies, pairOne.toLowerCase())}
                    width={24}
                    height={24}
                    style={{
                      opacity: getCryptoCurrencyLogo(currencies, pairOne.toLowerCase()) ? 1 : 0,
                    }}
                  />
                  <div className="ms-3">{pair && pairOne}</div>
                  <div className="d-xl-flex d-none second ms-2">{`${pair}`}</div>
                </td>
                <td className="col-sm-3 col-2 justify-content-center align-items-center d-flex">
                  ${last}
                </td>
                <td
                  className={`col-sm-4 col-3 justify-content-center align-items-center d-flex percent-${dir}`}
                >
                  {change24}%
                </td>
                <td className="col-sm-2 col-3 justify-content-end align-items-center d-flex pe-5">
                  {pair && (
                    <Link
                      className="market-action-button mx-1"
                      to={`/trade?pair=${pairOne.toLowerCase()}-${pairTwo.toLowerCase()}`}
                      state={[pairOne, pairTwo]}
                    >
                      Trade
                    </Link>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {!filteredTableData?.length && <NoResult />}
    </div>
  );
};

export default TopMarketTable;
