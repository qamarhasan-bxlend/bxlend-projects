import { Loader } from 'src/components/Loader';

const MarketBalance = ({ activeTab, balance, pairFromPath, loading }) => {
  const isBuy = activeTab === 'buy';

  return (
    <div className="avbl">
      {loading ? <Loader size={30} /> : `Avbl ${balance} ${pairFromPath[isBuy ? 1 : 0]}`}
    </div>
  );
};

export default MarketBalance;
