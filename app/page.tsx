"use client"
import React, { useState, useEffect } from 'react';
import { Search, TrendingDown, TrendingUp, ShieldAlert, Moon, Star, BarChart3, Activity } from 'lucide-react';

export default function Home() {
  // 1. Setup states to hold the live data from our Python server
  const [activeTicker, setActiveTicker] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("AAPL");

  // 2. Fetch data from our FastAPI backend server
  const fetchTickerData = async (tickerSymbol: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/predict/${tickerSymbol}`);
      
      if (!response.ok) {
        throw new Error("Failed to communicate with backend engine.");
      }
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setActiveTicker(data);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Run the fetch command automatically when the application opens
  useEffect(() => {
    fetchTickerData(searchQuery);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchTickerData(searchQuery.trim().toUpperCase());
    }
  };

  const mockWatchlist = [
    { ticker: "AAPL", name: "Apple Inc.", close: "$311.56", trend: "Bearish" },
    { ticker: "RELIANCE.NS", name: "Reliance Industries", close: "₹1,388.40", trend: "Bearish" },
    { ticker: "TSLA", name: "Tesla Motors", close: "$242.10", trend: "Bullish" },
    { ticker: "BTC-USD", name: "Bitcoin USD", close: "$61,450.00", trend: "Bullish" }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans flex">
      
      {/* SIDEBAR: WATCHLIST TRACKER */}
      <aside className="w-80 border-r border-neutral-800 bg-neutral-900/50 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-neutral-800 flex items-center gap-3">
          <Moon className="w-6 h-6 text-indigo-400" />
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            PredictorFi
          </span>
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 px-2 mb-3">
            <Star className="w-3.5 h-3.5 text-indigo-400" />
            Your Strategy Watchlist
          </div>
          <nav className="space-y-1">
            {mockWatchlist.map((item) => (
              <button 
                key={item.ticker}
                onClick={() => {
                  setSearchQuery(item.ticker);
                  fetchTickerData(item.ticker);
                }}
                className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-all ${
                  activeTicker && item.ticker === activeTicker.ticker 
                    ? 'bg-indigo-600/10 border border-indigo-500/30 text-white' 
                    : 'hover:bg-neutral-800/60 border border-transparent text-neutral-300'
                }`}
              >
                <div>
                  <div className="font-bold text-sm">{item.ticker}</div>
                  <div className="text-xs text-neutral-400 truncate max-w-[140px]">{item.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono font-medium">{item.close}</div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide ${
                    item.trend === 'Bullish' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {item.trend}
                  </span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* MAIN COMMAND CENTER */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* TOP SEARCH HEADER */}
        <header className="h-16 border-b border-neutral-800 px-8 flex items-center justify-between bg-neutral-950/80 backdrop-blur-md sticky top-0 z-10">
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stock ticker (e.g., AAPL, RELIANCE.NS)..." 
              className="w-full bg-neutral-900 border border-neutral-800 rounded-full py-1.5 pl-10 pr-4 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </form>
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 border border-neutral-800 rounded-full px-3 py-1.5 bg-neutral-900">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Nightly Market System Ready
          </div>
        </header>

        {/* WORKSPACE CONTENT */}
        <div className="p-8 max-w-6xl w-full mx-auto space-y-8">
          
          {/* STRATEGY HERO BANNER */}
          <div className="relative overflow-hidden border border-neutral-800 bg-gradient-to-br from-neutral-900 to-neutral-950 p-6 rounded-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md">
              EOD Strategy Architecture
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-3 mb-2">
              Wall Street Data. AI Precision. Tomorrow's Stock Edge, Today.
            </h1>
            <p className="text-neutral-400 text-sm max-w-xl">
              Bypassing intraday noise. Reviewing quantitative statistical models computed instantly following session close.
            </p>
          </div>

          {/* SYSTEM STATES: LOADING AND ERRORS */}
          {loading && (
            <div className="p-12 border border-neutral-800 bg-neutral-900/10 rounded-2xl text-center space-y-3">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm text-neutral-400 font-medium">Computing historical variations and data boundaries...</p>
            </div>
          )}

          {error && (
            <div className="p-6 border border-rose-900/50 bg-rose-950/10 text-rose-400 rounded-2xl text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* ACTIVE PORTAL ANALYTICS COMPONENT */}
          {!loading && !error && activeTicker && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              
              {/* STATISTICAL BOUNDARIES MODULE */}
              <div className="lg:col-span-2 border border-neutral-800 bg-neutral-900/30 rounded-2xl p-6 flex flex-col justify-between space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-3xl font-black tracking-tight">{activeTicker.ticker}</h2>
                      <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded font-mono font-medium">Market Equity</span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">Last Session Close: <span className="font-mono text-neutral-200">${activeTicker.last_close?.toFixed(2)}</span></p>
                  </div>
                  
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                    activeTicker.direction_trend === 'Bullish' 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  }`}>
                    {activeTicker.direction_trend === 'Bullish' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    Tomorrow's Bias: {activeTicker.direction_trend}
                  </div>
                </div>

                {/* CORE DATA ENVELOPE GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-800/60">
                  <div className="bg-neutral-900/80 p-4 rounded-xl border border-neutral-800">
                    <div className="text-xs text-neutral-400 font-medium mb-1">Defensive Lower Bound</div>
                    <div className="text-2xl font-bold font-mono tracking-tight text-neutral-300">${activeTicker.risk_range_lower}</div>
                    <div className="text-[10px] text-neutral-500 mt-1">Calculated floor risk envelope</div>
                  </div>
                  <div className="bg-neutral-900/80 p-4 rounded-xl border border-neutral-800">
                    <div className="text-xs text-neutral-400 font-medium mb-1">Target Upper Envelope</div>
                    <div className="text-2xl font-bold font-mono tracking-tight text-neutral-300">${activeTicker.risk_range_upper}</div>
                    <div className="text-[10px] text-neutral-500 mt-1">Mathematical breakout roof</div>
                  </div>
                  
                  {/* ADVANCED ALGORITHMS CONTENT CARD SECTION */}
                  {activeTicker.fibonacci && (
                    <div className="bg-neutral-900/80 p-4 rounded-xl border border-neutral-800 sm:col-span-2">
                      <div className="text-xs text-neutral-400 font-medium mb-2">Fibonacci Retracement Floors (60D)</div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-neutral-950 p-2 rounded border border-neutral-800/50">
                          <div className="text-[10px] text-neutral-500 font-bold">38.2% Level</div>
                          <div className="text-sm font-mono font-bold text-indigo-400">${activeTicker.fibonacci.level_382}</div>
                        </div>
                        <div className="bg-neutral-950 p-2 rounded border border-neutral-800/50">
                          <div className="text-[10px] text-neutral-500 font-bold">50.0% Level</div>
                          <div className="text-sm font-mono font-bold text-indigo-400">${activeTicker.fibonacci.level_500}</div>
                        </div>
                        <div className="bg-neutral-950 p-2 rounded border border-neutral-800/50">
                          <div className="text-[10px] text-neutral-500 font-bold">61.8% Level</div>
                          <div className="text-sm font-mono font-bold text-indigo-400">${activeTicker.fibonacci.level_618}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-indigo-950/20 border border-indigo-900/40 rounded-xl p-4 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-indigo-300">Strategy Engine Insights</h4>
                    <p className="text-[11px] text-indigo-200/70 mt-0.5 leading-relaxed">
                      Our regression modules have set a high-probability tactical trading boundary for the upcoming session.
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: AI TARGET & RSI MOMENTUM */}
              <div className="border border-neutral-800 bg-gradient-to-b from-neutral-900/40 to-neutral-950 rounded-2xl p-6 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
                    AI Prediction Target
                  </h3>
                  <div className="space-y-1">
                    <div className="text-xs text-neutral-500 font-medium">Regression Midpoint Proj.</div>
                    <div className="text-5xl font-black tracking-tight font-mono text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-400">
                      ${activeTicker.predicted_target}
                    </div>
                  </div>
                </div>

                {/* RSI PROGRESS CARD */}
                {activeTicker.momentum_rsi !== undefined && (
                  <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-neutral-400 flex items-center gap-1"><Activity className="w-3 h-3 text-cyan-400" /> 14-Day RSI Momentum</span>
                      <span className="text-cyan-400 font-mono">{activeTicker.momentum_rsi}</span>
                    </div>
                    <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-blue-400 h-1.5 rounded-full" 
                        style={{ width: `${activeTicker.momentum_rsi}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-neutral-500 font-mono">
                      <span>Oversold (30)</span>
                      <span>Neutral</span>
                      <span>Overbought (70)</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-neutral-400">Model Confidence Score</span>
                    <span className="text-indigo-400 font-mono">{activeTicker.model_confidence_score}%</span>
                  </div>
                  <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-1.5 rounded-full" 
                      style={{ width: `${activeTicker.model_confidence_score}%` }}
                    ></div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}
