"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, Settings, Zap, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  isLoading: boolean;
  lastUpdated: number;
  autoRefresh: boolean;
  setAutoRefresh: (value: boolean) => void;
  refreshInterval: number;
  setRefreshInterval: (value: number) => void;
  onManualRefresh: () => void;
}

export function Header({
  isLoading,
  lastUpdated,
  autoRefresh,
  setAutoRefresh,
  refreshInterval,
  setRefreshInterval,
  onManualRefresh,
}: HeaderProps) {
  const { theme, setTheme } = useTheme();

  console.log('Header render - isLoading:', isLoading, 'lastUpdated:', lastUpdated);

  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never';
    const now = Date.now();
    const diff = now - lastUpdated;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return new Date(lastUpdated).toLocaleTimeString();
  };

  const refreshIntervalOptions = [
    { value: 5000, label: '5s' },
    { value: 10000, label: '10s' },
    { value: 30000, label: '30s' },
    { value: 60000, label: '1m' },
  ];

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="relative">
                <Zap className="h-8 w-8 text-primary" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/20"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Web3 Gas Tracker
                </h1>
                <p className="text-sm text-muted-foreground">
                  Real-time blockchain fees across networks
                </p>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <Badge 
                variant={autoRefresh ? "default" : "secondary"}
                className="transition-all duration-200"
              >
                {autoRefresh ? "Auto" : "Manual"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Updated {formatLastUpdated()}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onManualRefresh}
              disabled={isLoading}
              className="relative overflow-hidden"
            >
              <RefreshCw 
                className={`h-4 w-4 mr-2 transition-transform duration-500 ${
                  isLoading ? 'animate-spin' : ''
                }`} 
              />
              Refresh
              {isLoading && (
                <motion.div
                  className="absolute inset-0 bg-primary/10"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <div className="px-2 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto Refresh</span>
                    <Switch
                      checked={autoRefresh}
                      onCheckedChange={setAutoRefresh}
                    />
                  </div>
                </div>

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Refresh Interval</DropdownMenuLabel>
                
                {refreshIntervalOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setRefreshInterval(option.value)}
                    className={refreshInterval === option.value ? "bg-accent" : ""}
                  >
                    {option.label}
                    {refreshInterval === option.value && (
                      <Badge variant="secondary" className="ml-auto">
                        Active
                      </Badge>
                    )}
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
                
                <DropdownMenuItem
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="h-4 w-4 mr-2" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4 mr-2" />
                      Dark Mode
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}