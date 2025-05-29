"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GasData } from "@/types/gas";
import { TrendingUp, TrendingDown, Minus, Activity, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface GasCardProps {
  gasData: GasData;
  isHighlighted?: 'cheapest' | 'expensive' | null;
}

export function GasCard({ gasData, isHighlighted }: GasCardProps) {
  console.log(`Rendering gas card for ${gasData.chainName}:`, gasData);

  const getTrendIcon = () => {
    switch (gasData.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCongestionColor = () => {
    switch (gasData.congestion) {
      case 'low':
        return 'text-gas-low';
      case 'medium':
        return 'text-gas-medium';
      case 'high':
        return 'text-gas-high';
      default:
        return 'text-muted-foreground';
    }
  };

  const getHighlightBorder = () => {
    if (isHighlighted === 'cheapest') return 'border-gas-low shadow-lg shadow-gas-low/20';
    if (isHighlighted === 'expensive') return 'border-gas-high shadow-lg shadow-gas-high/20';
    return 'border-border';
  };

  if (gasData.status === 'loading') {
    return (
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
              <div className="w-20 h-4 bg-muted rounded animate-pulse" />
            </div>
            <div className="w-16 h-6 bg-muted rounded animate-pulse" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="w-full h-8 bg-muted rounded animate-pulse" />
            <div className="w-3/4 h-4 bg-muted rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (gasData.status === 'error') {
    return (
      <Card className="border-destructive/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{gasData.logo}</span>
              <span className="font-medium text-destructive">{gasData.chainName}</span>
            </div>
            <Badge variant="destructive">Error</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Failed to fetch gas data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${getHighlightBorder()}`}>
        {isHighlighted && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-current to-transparent opacity-70" />
        )}
        
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{gasData.logo}</span>
              <div>
                <h3 className="font-semibold">{gasData.chainName}</h3>
                <p className="text-sm text-muted-foreground">{gasData.symbol}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getTrendIcon()}
              <Badge 
                variant="outline" 
                className={`${getCongestionColor()} border-current`}
              >
                <Activity className="h-3 w-3 mr-1" />
                {gasData.congestion}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Gas Price</p>
              <p className="text-2xl font-bold font-mono">
                {gasData.gasPrice.toFixed(1)}
                <span className="text-sm text-muted-foreground ml-1">gwei</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cost (21k gas)</p>
              <p className="text-lg font-semibold text-green-400 font-mono">
                ${gasData.gasInUsd.toFixed(3)}
              </p>
            </div>
          </div>

          {gasData.baseFee > 0 && (
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Base Fee</p>
                <p className="text-sm font-mono">{gasData.baseFee.toFixed(1)} gwei</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Priority Fee</p>
                <p className="text-sm font-mono">{gasData.maxPriorityFee.toFixed(1)} gwei</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground">
              Updated {new Date(gasData.lastUpdated).toLocaleTimeString()}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => window.open(`https://${gasData.chainName.toLowerCase()}.etherscan.io`, '_blank')}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>

          {/* Gas meter visualization */}
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                gasData.congestion === 'low' 
                  ? 'bg-gas-low' 
                  : gasData.congestion === 'medium' 
                  ? 'bg-gas-medium' 
                  : 'bg-gas-high'
              }`}
              initial={{ width: 0 }}
              animate={{ 
                width: gasData.congestion === 'low' 
                  ? '30%' 
                  : gasData.congestion === 'medium' 
                  ? '60%' 
                  : '90%' 
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}