"use client";

import { useGasData } from "@/hooks/use-gas-data";
import { Header } from "@/components/header";
import { StatsOverview } from "@/components/stats-overview";
import { GasCard } from "@/components/gas-card";
import { GasChart } from "@/components/gas-chart";
import { motion } from "framer-motion";

export default function Home() {
  console.log('Home page rendering');
  
  const {
    gasData,
    isLoading,
    lastUpdated,
    autoRefresh,
    setAutoRefresh,
    refreshInterval,
    setRefreshInterval,
    manualRefresh,
    cheapest,
    mostExpensive,
  } = useGasData();

  console.log('Gas data state:', { 
    gasDataLength: gasData.length, 
    isLoading, 
    lastUpdated, 
    cheapest: cheapest?.chainName,
    mostExpensive: mostExpensive?.chainName 
  });

  return (
    <div className="min-h-screen bg-background">
      <Header
        isLoading={isLoading}
        lastUpdated={lastUpdated}
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
        refreshInterval={refreshInterval}
        setRefreshInterval={setRefreshInterval}
        onManualRefresh={manualRefresh}
      />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <StatsOverview
            gasData={gasData}
            cheapest={cheapest}
            mostExpensive={mostExpensive}
          />
        </motion.section>

        {/* Chart Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <GasChart gasData={gasData} />
        </motion.section>

        {/* Gas Cards Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6">Network Gas Prices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gasData.map((data) => (
              <GasCard
                key={data.chainId}
                gasData={data}
                isHighlighted={
                  data.chainId === cheapest?.chainId
                    ? 'cheapest'
                    : data.chainId === mostExpensive?.chainId
                    ? 'expensive'
                    : null
                }
              />
            ))}
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center text-sm text-muted-foreground py-8 border-t border-border"
        >
          <p>
            Built with ⚡ by{" "}
            <span className="text-primary font-medium">Web3 Developer</span> |{" "}
            Data refreshes every {refreshInterval / 1000}s
          </p>
          <p className="mt-2">
            Tracking gas fees across Ethereum, Arbitrum, Optimism, Base, and Polygon
          </p>
        </motion.footer>
      </main>
    </div>
  );
}
