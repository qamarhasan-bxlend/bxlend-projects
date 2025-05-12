import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search } from 'react-bootstrap-icons';
import Image from 'react-bootstrap/esm/Image';

import { RootState } from 'src/store/store';
import { useDispatch } from 'src/store/useDispatch';
import { fetchCurrencyPairs } from 'src/store/slice/currencyPairs';
import { fetchCurrencies } from 'src/store/slice/currencies';
import { fetchTickers } from 'src/store/slice/tickers';
import { fetchWalletAddresses } from 'src/store/slice/walletAddresses';

import { Loader } from 'src/components/Loader';
import { MobileSearch } from 'src/components/MobileSearch';
import NoResult from 'src/components/NoResult/NoResult';
import TableHead from './TableHead';
import SearchBox from 'src/components/SearchBox';
import Pagination from 'src/components/Pagination';

import { STREAM_URL } from 'src/configs';
import { KYC_STATUS } from 'src/constants';
import { ITicker } from 'src/interfaces';

interface IWallet {
  balance: string;
  currency: string;
  kind: string;
  owner: string;
  owner_type: string;
}

export type TableProps = {
  setFiatUsd: React.Dispatch<React.SetStateAction<number>>;
  setCryptoUsd: React.Dispatch<React.SetStateAction<number>>;
  setBtcUsd: React.Dispatch<React.SetStateAction<number>>;
  tickers: ITicker[];
  walletAddresses: any;
  walletsCount: number;
  isVisible: boolean;
  loading: boolean;
};

const Table = ({
  setFiatUsd,
  setCryptoUsd,
  setBtcUsd,
  isVisible,
  tickers,
  walletAddresses,
  walletsCount,
  loading,
}: TableProps) => {
  const [tickerData, setTickerData] = useState<ITicker[]>([]);
  const [hkdUsd, setHkdUsd] = useState<ITicker>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [keyword, setKeyword] = useState('');

  const dispatch = useDispatch();

  const { pairs } = useSelector(({ pairs }) => pairs);
  const { currencies } = useSelector((state: RootState) => state.currencies);
  const { isDark } = useSelector(({ isDark }) => isDark);
  const {
    user: { email_verified, twoFA_verified, kyc_status },
  } = useSelector((state: RootState) => state.user);

  const [filteredData, setFilteredData] = useState<IWallet[]>(walletAddresses);

  const perPage = 10;
  const nPages = Math.ceil(walletsCount / perPage);
  const data = tickerData.length ? tickerData : tickers;
  const filteredDataSorted = [...(filteredData || [])].sort((a, b) => +b.balance - +a.balance);

  const hiddenText = '***';
  const getCryptoCurrencyLogo = (currency: string) => {
    if (currency === 'usd' || currency === 'hkd') {
      return `./assets/${currency.toLowerCase()}.png`;
    } else {
      const currencyIcon = currencies.find((item) => item.code.toLowerCase() === currency)?.icon;
      return currencyIcon?.replace('https://static.bxlend.com/', '');
    }
  };

  const calUSD = (currency: string, balance: string) => {
    const lastValue = data.find((data) => data.pair === `${currency.toUpperCase()}/USD`)?.last;
    if (lastValue) {
      return parseFloat(balance) * parseFloat(String(lastValue));
    }
    return 0;
  };

  const calHKD = (balance: string) =>
    hkdUsd ? parseFloat(balance) * parseFloat(String(hkdUsd.last)) : 0;

  const tableBalance = (kind: string, currency: string, balance: string) => {
    if (kind === 'CRYPTO') {
      return calUSD(currency, balance).toFixed(3);
    }

    return currency === 'HKD' ? calHKD(balance).toFixed(3) : balance;
  };

  const getAllBalance = () => {
    let fiat = 0.0;
    let crypto = 0.0;
    walletAddresses.forEach((wallet) => {
      if (wallet.kind === 'CRYPTO') {
        crypto += calUSD(wallet.currency, wallet.balance);
      } else if (wallet.kind === 'FIAT') {
        if (wallet.currency.toUpperCase() === 'HKD') {
          fiat += calHKD(wallet.balance);
        } else {
          fiat += parseFloat(wallet.balance);
        }
      }
    });
    setCryptoUsd(crypto);
    setFiatUsd(fiat);
  };

  const getBtcUsd = () => {
    const btcUsdTicker = data.find((ticker) => ticker.pair === 'BTC/USD');
    if (btcUsdTicker) {
      setBtcUsd(parseFloat(String(btcUsdTicker.last)));
    }
  };

  const handleVerificationBeforeNavigate = (path: string) =>
    email_verified && twoFA_verified && kyc_status === KYC_STATUS.VERIFIED
      ? path
      : '/account-created';

  useEffect(() => {
    if (!currencies.length) {
      dispatch(fetchCurrencies());
    }

    if (!pairs.length) {
      dispatch(fetchCurrencyPairs());
    }

    if (!walletAddresses.length) {
      dispatch(fetchWalletAddresses());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!tickers.length) {
      dispatch(fetchTickers());
    } else {
      const hkdUsdTicker = tickers.find((ticker) => ticker.pair === 'HKD/USD');
      setHkdUsd(hkdUsdTicker);
    }

    const newSocket = new WebSocket(`${STREAM_URL}/ticker`);
    const connectSocket = () => {
      newSocket.addEventListener('message', (event) => {
        const newData = JSON.parse(event.data);
        setTickerData(newData);
      });
    };

    connectSocket();

    return () => {
      newSocket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (keyword !== '') {
      const symbolArray = walletAddresses?.filter((item) =>
        item.currency.includes(keyword.toUpperCase()),
      );
      setFilteredData(symbolArray);
    } else {
      setFilteredData(walletAddresses);
    }
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, walletAddresses]);

  useEffect(() => {
    if (walletAddresses.length > 0 && data.length > 0) {
      getAllBalance();
      getBtcUsd();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddresses, data]);

  return !loading ? (
    <div className="market-table">
      <div className="d-flex justify-content-between align-items-center my-5">
        <div className={`d-flex align-items-center market-search-box ${isDark ? 'isDark' : ''}`}>
          <SearchBox placeHolder="Search coin..." keyword={keyword} setKeyword={setKeyword} />
        </div>
        <button
          id="button-addon4"
          type="button"
          className="mobile-search-icon d-none btn btn-link text-info"
          data-bs-toggle="modal"
          data-bs-target="#mobileSearchInput"
        >
          <Search />
        </button>
        <MobileSearch setKeyword={setKeyword} />
      </div>
      <table className="table table-borderless mt-5">
        <TableHead />
        <tbody>
          {filteredDataSorted
            ?.slice((currentPage - 1) * perPage, currentPage * perPage)
            .map(({ currency, balance, kind }: IWallet, index: number) => {
              let coin = '';
              try {
                coin = pairs.find((p) => currency === p.currencies[0]).currencies[1];
              } catch (e) {
                coin = 'USD';
              }
              return (
                <tr
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                  className="table-content row mt-1"
                  key={index}
                >
                  <td className="col-sm-4 col-4 col-lg-2 justify-content-start align-items-center d-flex table-name">
                    <Image
                      src={getCryptoCurrencyLogo(currency.toLowerCase())}
                      width={24}
                      height={24}
                    />
                    <div className="d-flex flex-column ms-3">
                      <div>{currency}</div>
                      <div className="second">{coin}</div>
                    </div>
                  </td>
                  <td className="col-sm-4 col-4 col-lg-2 justify-content-center align-items-center d-flex">
                    {isVisible ? balance : hiddenText}
                  </td>
                  <td className="col-sm-4 col-4 col-lg-2 justify-content-center align-items-center d-flex">
                    {isVisible ? balance : hiddenText}
                  </td>
                  <td className="col-sm-0 col-lg-2 justify-content-center align-items-center d-none d-lg-flex">
                    {isVisible ? tableBalance(kind, currency, balance) : hiddenText}
                  </td>
                  <td
                    className="col-sm-0 col-lg-2 justify-content-between align-items-center d-none d-lg-flex"
                    style={{ gap: '0.5vw' }}
                  >
                    <Link
                      className="wallet-action-button"
                      to={handleVerificationBeforeNavigate(
                        kind === 'FIAT' ? `/deposit-manual/${currency}` : `/deposit/${currency}`,
                      )}
                      state={{
                        code: currency,
                        message:
                          'Verify your email, kyc and 2FA to use deposit and withdrawal service.',
                      }}
                    >
                      Deposit
                    </Link>
                    <Link
                      to={handleVerificationBeforeNavigate(
                        kind === 'FIAT' ? `/withdraw-manual/${currency}` : `/withdraw/${currency}`,
                      )}
                      className="wallet-action-button"
                      state={{
                        code: currency,
                        message:
                          'Verify your email, kyc and 2FA to use deposit and withdrawal service.',
                      }}
                    >
                      Withdraw
                    </Link>
                    <Link
                      className="wallet-action-button"
                      to={`/trade?pair=${currency.toLowerCase()}-${coin.toLowerCase()}`}
                    >
                      Trade
                    </Link>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {filteredData.length && filteredData.length > 10 ? (
        <Pagination nPages={nPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      ) : null}
      {!filteredDataSorted.length && <NoResult />}
    </div>
  ) : (
    <Loader size={100} />
  );
};

export default Table;
