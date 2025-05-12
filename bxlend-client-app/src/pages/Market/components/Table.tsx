import React, { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { useDispatch } from 'src/store/useDispatch';
import { fetchUser } from 'src/store/slice/user';
import { fetchCurrencyPairs } from 'src/store/slice/currencyPairs';
import { fetchCurrencies } from 'src/store/slice/currencies';
import { setAppAlert } from 'src/store/slice/appAlert';
import { RootState } from 'src/store/store';

import { Select } from 'src/components/Select';
import FilterButtons from './FilterButtons';
import TableHeader from './TableHeader';
import MarketHeader from './MarketHeader';
import TableRow from './TableRow';
import NoResult from 'src/components/NoResult/NoResult';
import Pagination from 'src/components/Pagination';

import request from 'src/request';
import { PUBLIC_URL } from 'src/configs';
import { IPairObject, ITableData, ITicker } from 'src/interfaces';
import { getChange24, getCryptoCurrencyLogo, getCurrencyPairs, getSign } from 'src/constants';

export type TableDataProps = {
  tickers: ITicker[];
};

const filterButtons: string[] = ['All', 'Top Gainers', 'Top Losers', 'Favourites'];

const Table: FC<TableDataProps> = ({ tickers }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [filteredData, setFilteredData] = useState<IPairObject[]>([]);
  const [filteredTableData, setFilteredTableData] = useState<ITableData[]>([]);
  const [initialFilteredTableData, setInitialFilteredTableData] = useState<ITableData[]>([]);
  const [filter, setFilter] = useState('All');
  const [sortBy, setSort] = useState('');
  const [loadingId, setLoadingId] = useState<null | string>(null);

  const { user, loading: userLoading } = useSelector((state: RootState) => state.user);
  const { pairs } = useSelector(({ pairs }) => pairs);
  const { currencies } = useSelector((state: RootState) => state.currencies);

  const perPage = 10;
  const nPages = Math.ceil(filteredTableData ? filteredTableData.length / perPage : 1);
  const isData =
    filteredTableData && filteredTableData.length
      ? filteredTableData?.slice((currentPage - 1) * perPage, currentPage * perPage)
      : [];

  const dispatch = useDispatch();

  const sign = getSign();

  const handleSortButton = (sort: string) => {
    let sortedData: ITableData[] | undefined;
    if (filteredTableData) {
      switch (sort) {
        case 'Name':
          sortedData = [...filteredTableData].sort((a, b) => a.pair.localeCompare(b.pair));
          break;
        case 'Price':
          sortedData = [...filteredTableData].sort(
            (a, b) => parseFloat(b.last) - parseFloat(a.last),
          );
          break;
        case ' 24 Change':
          sortedData = [...filteredTableData].sort(
            (a, b) => parseFloat(b.percent_change_24) - parseFloat(a.percent_change_24),
          );
          break;
        default:
          sortedData = filteredTableData;
      }
      setFilteredTableData(sortedData);
    }
  };

  const handleFilterButton = (filter: string) => {
    if (pairs && filteredTableData) {
      let topGainers;
      let topLosers;
      let favourites;

      switch (filter) {
        case 'All':
          setFilteredTableData(initialFilteredTableData);
          break;
        case 'Top Gainers':
          topGainers = [...initialFilteredTableData].sort(
            (a, b) => parseFloat(b.percent_change_24) - parseFloat(a.percent_change_24),
          );
          setFilteredTableData(topGainers);
          break;
        case 'Top Losers':
          topLosers = [...initialFilteredTableData].sort(
            (a, b) => parseFloat(a.percent_change_24) - parseFloat(b.percent_change_24),
          );
          setFilteredTableData(topLosers);
          break;
        case 'Favourites':
          if (!user?.favorite_currencyPairs) {
            window.open(`${sign}&action=signup`, '_self');
          } else {
            favourites = initialFilteredTableData.filter(({ id }) =>
              user.favorite_currencyPairs.includes(String(id)),
            );
          }
          setFilteredTableData(favourites);
          break;
        default:
          return;
      }

      if (currentPage !== 1) {
        setCurrentPage(1);
      }
    }
  };

  const handleFavourite = (e, id: string) => {
    e.preventDefault();

    setLoadingId(id);
    request
      .put(`${PUBLIC_URL}/v1/users/add-to-fav/${id}`, {})
      .then(() => {
        if (user.favorite_currencyPairs.includes(id)) {
          setFilteredTableData((prevState) => prevState.filter((icon) => icon.id !== id));
        }
        dispatch(fetchUser());
      })
      .catch(({ response }) => {
        dispatch(
          setAppAlert({
            message: response?.data?.error || 'Something went wrong',
            isSuccess: false,
          }),
        );
        setLoadingId(null);
      });
  };

  useEffect(() => {
    if (!userLoading) {
      setLoadingId(null);
    }
  }, [userLoading]);

  useEffect(() => {
    const isUserFetched = Object.keys(user).length;
    const token = localStorage.getItem('access');

    if (!isUserFetched && token) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    setCurrentPage(1);
    const arr = pairs?.filter(({ symbol }) => symbol.includes(keyword.toUpperCase())) ?? [];
    setFilteredData(arr);
  }, [keyword, pairs]);

  useEffect(() => {
    setSort('');
    handleFilterButton(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    setFilter('All');
    handleSortButton(sortBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  useEffect(() => {
    const resultTableData = filteredData
      ?.map((filteredItem) => {
        const pair = `${filteredItem.currencies[0]}/${filteredItem.currencies[1]}`;
        return {
          ...tickers?.find((item) => item.pair === pair),
          id: filteredItem.id,
        };
      })
      .filter(Boolean);
    if (resultTableData) {
      // @ts-expect-error expected
      const temp = resultTableData.filter((result) => result) as ITableData[];
      setFilteredTableData(temp);
      setInitialFilteredTableData(temp);
    }
  }, [filteredData, tickers]);

  useEffect(() => {
    if (!pairs.length) {
      dispatch(fetchCurrencyPairs());
    }

    if (!currencies.length) {
      dispatch(fetchCurrencies());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="market-table">
      <MarketHeader keyword={keyword} setKeyword={setKeyword} />
      <div className="d-flex justify-content-between align-items-center my-5">
        <FilterButtons filter={filter} filterButtons={filterButtons} setFilter={setFilter} />
        <div className="d-lg-none">
          <Select
            label="Filter"
            value={filter}
            options={[
              { value: 'All', label: 'All' },
              { value: 'Top Gainers', label: 'Top Gainers' },
              { value: 'Top Losers', label: 'Top Losers' },
              { value: 'Favourites', label: 'Favourites' },
            ]}
            onChange={(e) => setFilter(e.currentTarget.value)}
          />
        </div>
        <Select
          label="Sort by"
          value={sortBy}
          options={[
            { value: 'Name', label: 'Name' },
            { value: 'Price', label: 'Price' },
            { value: '24h Change', label: '24h Change' },
          ]}
          onChange={(e) => setSort(e.currentTarget.value)}
        />
      </div>
      <div className="table table-borderless mt-5">
        <TableHeader />
        <div>
          {isData.map(({ pair, id, volume, last, percent_change_24 }: any) => {
            const change24 = getChange24(percent_change_24);
            const pairOne = getCurrencyPairs(pair)[0];
            const pairTwo = getCurrencyPairs(pair)[1];
            const logo = getCryptoCurrencyLogo(currencies, pairOne.toLowerCase());
            const hasLogo = pair && logo;

            return (
              <Link
                className="market-action-button mx-1"
                to={`/trade?pair=${pairOne.toLowerCase()}-${pairTwo.toLowerCase()}`}
                state={[pairOne, pairTwo]}
                key={id}
              >
                <TableRow
                  hasLogo={hasLogo}
                  volume={volume}
                  pair={pair}
                  pairOne={pairOne}
                  last={last}
                  change24={change24}
                  pairTwo={pairTwo}
                  handleFavourite={handleFavourite}
                  id={id}
                  loadingId={loadingId}
                  user={user}
                  isFullRowClickable
                />
              </Link>
            );
          })}
        </div>
      </div>
      {filteredTableData.length && filteredTableData.length > 10 ? (
        <Pagination nPages={nPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      ) : null}
      {!isData.length && <NoResult />}
    </div>
  );
};

export default Table;
