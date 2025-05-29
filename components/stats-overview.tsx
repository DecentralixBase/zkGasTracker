"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GasData } from "@/types/gas";
import { TrendingDown, TrendingUp, Crown, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface StatsOverviewProps {
  gasData: GasData[];
  cheapest: GasData | null;
  mostExpensive: GasData | null;
}

export function StatsOverview({ gasData, cheapest, mostExpensive }: StatsOverviewProps) {
  console.log('StatsOverview render:', { gasData: gasData.length, cheapest, mostExpensive });

  const validData = gasData.filter(d => d.status === 'success');
  const averageGasPrice = validData.length > 0 
    ? validData.reduce((sum, d) => sum + d.gasPrice, 0) / validData.length 
    : 0;
  
  const averageUsdCost = validData.length > 0
    ? validData.reduce((sum, d) => sum + d.gasInUsd, 0) / validData.length
    : 0;

  const highCongestionNetworks = validData.filter(d => d.congestion === 'high').length;

  const stats = [
    {
      title: "Average Gas Price",
      value: `${averageGasPrice.toFixed(1)} gwei`,
      subtitle: `~$${averageUsdCost.toFixed(3)} per tx`,
      icon: TrendingUp,
      color: "text-blue-500",
    },
    {
      title: "Cheapest Network",
      value: cheapest ? `${cheapest.gasPrice.toFixed(1)} gwei` : 'N/A',
      subtitle: cheapest ? `${cheapest.chainName} • $${cheapest.gasInUsd.toFixed(3)}` : 'Loading...',
      icon: TrendingDown,
      color: "text-gas-low",
    },
    {
      title: "Most Expensive",
      value: mostExpensive ? `${mostExpensive.gasPrice.toFixed(1)} gwei` : 'N/A',
      subtitle: mostExpensive ? `${mostExpensive.chainName} • $${mostExpensive.gasInUsd.toFixed(3)}` : 'Loading...',
      icon: Crown,
      color: "text-gas-high",
    },
    {
      title: "High Congestion",
      value: `${highCongestionNetworks}/${validData.length}`,
      subtitle: `${highCongestionNetworks > 0 ? 'Networks' : 'All clear'} congested`,
      icon: AlertTriangle,
      color: highCongestionNetworks > 0 ? "text-gas-medium" : "text-gas-low",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                {stat.title}
                <stat.icon className={`h-4 w-4 ${stat.color} transition-transform group-hover:scale-110`} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <motion.p 
                  className="text-2xl font-bold font-mono"
                  key={stat.value} // Re-trigger animation on value change
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-sm text-muted-foreground">
                  {stat.subtitle}
                </p>
              </div>
              
              {/* Decorative gradient bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}