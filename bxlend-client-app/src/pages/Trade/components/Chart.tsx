import React, { useEffect, useState } from 'react';
import TradingViewWidget, { Themes, IntervalTypes } from 'react-tradingview-widget';

import { useSelector } from 'react-redux';

export type ChartProps = {
  symbol: string;
};

const Chart = React.memo(({ symbol }: ChartProps) => {
  const overrides = {
    'mainSeriesProperties.candleStyle.upColor': '#20BF55',
    'mainSeriesProperties.candleStyle.downColor': '#EB5757',
  };
  const [chartSymbol, setChartSymbol] = useState('BTCUSDT');

  const { isDark } = useSelector(({ isDark }) => isDark);

  useEffect(() => {
    if (symbol) {
      const currencies = symbol.split('-');
      setChartSymbol(`${currencies[0].toUpperCase()}${currencies[1].toUpperCase()}`);
    }
  }, [symbol]);

  return (
    <div className="h-100 trade-chart ms-lg-3 ms-0 mb-3">
      <TradingViewWidget
        symbol={`BITSTAMP:${chartSymbol}`}
        theme={isDark ? Themes.DARK : Themes.LIGHT}
        locale="en"
        autosize
        interval={IntervalTypes.D}
        timezone="Etc/UTC"
        hidevolume={true}
        color="#EB5757,#20BF55,#EB5757"
        overrides={overrides}
      />
    </div>
  );
});

export default Chart;
