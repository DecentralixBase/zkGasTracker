export interface GasData {
  chainId: number;
  chainName: string;
  symbol: string;
  logo: string;
  color: string;
  baseFee: number;
  maxPriorityFee: number;
  maxFee: number;
  gasPrice: number;
  gasInUsd: number;
  lastUpdated: number;
  status: 'loading' | 'success' | 'error';
  trend: 'up' | 'down' | 'stable';
  congestion: 'low' | 'medium' | 'high';
}

export interface GasAlert {
  id: string;
  chainId: number;
  threshold: number;
  type: 'above' | 'below';
  isActive: boolean;
  lastTriggered?: number;
}

export interface ChartDataPoint {
  timestamp: number;
  baseFee: number;
  maxFee: number;
  gasPrice: number;
}

export interface NetworkConfig {
  chainId: number;
  name: string;
  symbol: string;
  logo: string;
  color: string;
  rpcUrl: string;
  explorerUrl: string;
  gasApiUrl?: string;
}

export const SUPPORTED_NETWORKS: NetworkConfig[] = [
  {
    chainId: 1,
    name: "Ethereum",
    symbol: "ETH",
    logo: "⟠",
    color: "ethereum",
    rpcUrl: "https://eth.llamarpc.com",
    explorerUrl: "https://etherscan.io",
    gasApiUrl: "https://api.etherscan.io/api?module=gastracker&action=gasoracle"
  },
  {
    chainId: 42161,
    name: "Arbitrum",
    symbol: "ETH",
    logo: "🔷",
    color: "arbitrum",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    explorerUrl: "https://arbiscan.io"
  },
  {
    chainId: 10,
    name: "Optimism",
    symbol: "ETH",
    logo: "🔴",
    color: "optimism",
    rpcUrl: "https://mainnet.optimism.io",
    explorerUrl: "https://optimistic.etherscan.io"
  },
  {
    chainId: 8453,
    name: "Base",
    symbol: "ETH",
    logo: "🔵",
    color: "base",
    rpcUrl: "https://mainnet.base.org",
    explorerUrl: "https://basescan.org"
  },
  {
    chainId: 137,
    name: "Polygon",
    symbol: "MATIC",
    logo: "🟣",
    color: "polygon",
    rpcUrl: "https://polygon-rpc.com",
    explorerUrl: "https://polygonscan.com"
  }
];