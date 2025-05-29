import { ethers } from 'ethers';
import { GasData, NetworkConfig, SUPPORTED_NETWORKS } from '@/types/gas';

// ETH to USD conversion rate cache
let ethPriceCache = { price: 2000, lastUpdate: 0 };
const CACHE_DURATION = 60000; // 1 minute

async function getEthPrice(): Promise<number> {
  console.log('Fetching ETH price...');
  
  if (Date.now() - ethPriceCache.lastUpdate < CACHE_DURATION) {
    console.log('Using cached ETH price:', ethPriceCache.price);
    return ethPriceCache.price;
  }

  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await response.json();
    const price = data.ethereum?.usd || 2000;
    
    ethPriceCache = { price, lastUpdate: Date.now() };
    console.log('Updated ETH price:', price);
    return price;
  } catch (error) {
    console.error('Failed to fetch ETH price:', error);
    return ethPriceCache.price; // Return cached price on error
  }
}

function calculateGasCongestion(gasPrice: number, baseFee: number): 'low' | 'medium' | 'high' {
  const ratio = gasPrice / baseFee;
  if (ratio < 1.2) return 'low';
  if (ratio < 2) return 'medium';
  return 'high';
}

function calculateTrend(currentPrice: number, previousPrice: number): 'up' | 'down' | 'stable' {
  const change = (currentPrice - previousPrice) / previousPrice;
  if (Math.abs(change) < 0.05) return 'stable'; // Less than 5% change
  return change > 0 ? 'up' : 'down';
}

export async function fetchGasData(network: NetworkConfig, previousGasPrice?: number): Promise<GasData> {
  console.log(`Fetching gas data for ${network.name}...`);
  
  try {
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    
    // Fetch fee data and latest block
    const [feeData, block, ethPrice] = await Promise.all([
      provider.getFeeData(),
      provider.getBlock('latest'),
      getEthPrice()
    ]);

    console.log(`${network.name} fee data:`, feeData);

    const baseFee = Number(ethers.formatUnits(feeData.gasPrice || 0, 'gwei'));
    const maxPriorityFee = Number(ethers.formatUnits(feeData.maxPriorityFeePerGas || 0, 'gwei'));
    const maxFee = Number(ethers.formatUnits(feeData.maxFeePerGas || 0, 'gwei'));
    const gasPrice = maxFee || baseFee;

    // Calculate gas cost in USD (for a standard 21,000 gas transaction)
    const standardGasLimit = 21000;
    const gasCostEth = (gasPrice * standardGasLimit) / 1e9; // Convert from gwei to ETH
    const gasInUsd = gasCostEth * ethPrice;

    const gasData: GasData = {
      chainId: network.chainId,
      chainName: network.name,
      symbol: network.symbol,
      logo: network.logo,
      color: network.color,
      baseFee: baseFee,
      maxPriorityFee: maxPriorityFee,
      maxFee: maxFee,
      gasPrice: gasPrice,
      gasInUsd: gasInUsd,
      lastUpdated: Date.now(),
      status: 'success',
      trend: previousGasPrice ? calculateTrend(gasPrice, previousGasPrice) : 'stable',
      congestion: calculateGasCongestion(gasPrice, baseFee || gasPrice)
    };

    console.log(`${network.name} gas data processed:`, gasData);
    return gasData;

  } catch (error) {
    console.error(`Error fetching gas data for ${network.name}:`, error);
    
    return {
      chainId: network.chainId,
      chainName: network.name,
      symbol: network.symbol,
      logo: network.logo,
      color: network.color,
      baseFee: 0,
      maxPriorityFee: 0,
      maxFee: 0,
      gasPrice: 0,
      gasInUsd: 0,
      lastUpdated: Date.now(),
      status: 'error',
      trend: 'stable',
      congestion: 'low'
    };
  }
}

export async function fetchAllGasData(previousData?: GasData[]): Promise<GasData[]> {
  console.log('Fetching gas data for all networks...');
  
  const promises = SUPPORTED_NETWORKS.map(network => {
    const previousGasPrice = previousData?.find(d => d.chainId === network.chainId)?.gasPrice;
    return fetchGasData(network, previousGasPrice);
  });

  const results = await Promise.allSettled(promises);
  
  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.error(`Failed to fetch data for ${SUPPORTED_NETWORKS[index].name}:`, result.reason);
      // Return error state for failed networks
      const network = SUPPORTED_NETWORKS[index];
      return {
        chainId: network.chainId,
        chainName: network.name,
        symbol: network.symbol,
        logo: network.logo,
        color: network.color,
        baseFee: 0,
        maxPriorityFee: 0,
        maxFee: 0,
        gasPrice: 0,
        gasInUsd: 0,
        lastUpdated: Date.now(),
        status: 'error' as const,
        trend: 'stable' as const,
        congestion: 'low' as const
      };
    }
  });
}

export function findCheapestAndMostExpensive(gasData: GasData[]) {
  const validData = gasData.filter(d => d.status === 'success' && d.gasPrice > 0);
  
  if (validData.length === 0) {
    return { cheapest: null, mostExpensive: null };
  }

  const cheapest = validData.reduce((min, current) => 
    current.gasPrice < min.gasPrice ? current : min
  );
  
  const mostExpensive = validData.reduce((max, current) => 
    current.gasPrice > max.gasPrice ? current : max
  );

  console.log('Cheapest network:', cheapest.chainName, 'at', cheapest.gasPrice, 'gwei');
  console.log('Most expensive network:', mostExpensive.chainName, 'at', mostExpensive.gasPrice, 'gwei');

  return { cheapest, mostExpensive };
}