import React, { useEffect, useState } from 'react';
import TradingViewWidget, { Themes, IntervalTypes } from 'react-tradingview-widget';

export type ChartProps = {
  symbol: string;
};

const MobileChart = React.memo(({ symbol }: ChartProps) => {
  const overrides = {
    'mainSeriesProperties.candleStyle.upColor': '#20BF55',
    'mainSeriesProperties.candleStyle.downColor': '#EB5757',
  };
  const [chartSymbol, setChartSymbol] = useState('BTCUSDT');

  useEffect(() => {
    if (symbol) {
      const currencies = symbol.split('-');
      setChartSymbol(`${currencies[0].toUpperCase()}${currencies[1].toUpperCase()}`);
    }
  }, [symbol]);

  return (
    <div className="tab-content h-100">
      <div id="chart" className="container tab-pane active h-100 px-0 pb-5">
        <TradingViewWidget
          symbol={`BITSTAMP:${chartSymbol}`}
          theme={Themes.LIGHT}
          locale="en"
          autosize
          interval={IntervalTypes.D}
          timezone="Etc/UTC"
          hidevolume={true}
          color="#EB5757,#20BF55,#EB5757"
          overrides={overrides}
        />
      </div>
    </div>
  );
});

export default MobileChart;
