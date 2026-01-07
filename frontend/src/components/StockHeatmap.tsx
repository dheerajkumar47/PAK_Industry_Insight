import React, { useEffect, useRef, memo } from 'react';

export const StockHeatmap = memo(() => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if script already exists to prevent duplicates
    if (container.current && !container.current.querySelector('script')) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "exchanges": [],
        "dataSource": "AllPK",
        "grouping": "sector",
        "blockSize": "market_cap_basic",
        "blockColor": "change",
        "locale": "en",
        "symbolUrl": "",
        "colorTheme": "light", // Ideally dynamic based on theme, but light/dark handling requires reload
        "hasTopBar": false,
        "isDataSetEnabled": false,
        "isZoomEnabled": true,
        "hasSymbolTooltip": true,
        "width": "100%",
        "height": "600",
        "isTransparent": false
        // Note: 'AllPK' is the key for Pakistan stocks in TradingView widgets
      });
      container.current.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
      <div className="tradingview-widget-container" ref={container}>
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
});

StockHeatmap.displayName = 'StockHeatmap';
