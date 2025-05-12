import { Loader } from 'src/components/Loader';

export type Props = {
  label: string;
  btcValue: string;
  usdValue: string;
  isVisible: boolean;
  loading: boolean;
};

const Balance = ({ label, btcValue, usdValue, isVisible, loading }: Props) => {
  return (
    <div className="d-flex flex-column me-0 me-md-5">
      <div className="mb-2 wallet-balance-title">{`${label} balance`}</div>
      {loading ? (
        <Loader size={24} />
      ) : (
        <div className="d-flex wallet-balance-value">
          <div className="h5 wallet-btc-balance">
            {isVisible ? `${btcValue} BTC ` : '**************'}
          </div>
          <div className="h5 wallet-usd-balance">{`~ ${
            isVisible ? `$ ${usdValue}` : '**************'
          }`}</div>
        </div>
      )}
    </div>
  );
};

export default Balance;
