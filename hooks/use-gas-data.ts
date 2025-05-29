"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { GasData } from '@/types/gas';
import { fetchAllGasData, findCheapestAndMostExpensive } from '@/lib/gas-service';

export function useGasData() {
  const [gasData, setGasData] = useState<GasData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number>(0);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(10000); // 10 seconds
  
  // Use ref to avoid circular dependency
  const gasDataRef = useRef<GasData[]>([]);
  gasDataRef.current = gasData;

  const fetchData = useCallback(async () => {
    console.log('Fetching gas data...');
    try {
      const previousData = gasDataRef.current.length > 0 ? gasDataRef.current : undefined;
      const data = await fetchAllGasData(previousData);
      setGasData(data);
      setLastUpdated(Date.now());
      console.log('Gas data updated:', data);
    } catch (error) {
      console.error('Error fetching gas data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies to avoid circular reference

  const manualRefresh = useCallback(async () => {
    console.log('Manual refresh triggered');
    setIsLoading(true);
    await fetchData();
  }, [fetchData]);

  // Initial data fetch
  useEffect(() => {
    console.log('Initial gas data fetch');
    fetchData();
  }, [fetchData]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) {
      console.log('Auto refresh disabled');
      return;
    }

    console.log(`Setting up auto refresh every ${refreshInterval}ms`);
    const interval = setInterval(() => {
      console.log('Auto refresh triggered');
      fetchData();
    }, refreshInterval);

    return () => {
      console.log('Clearing auto refresh interval');
      clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval, fetchData]);

  const { cheapest, mostExpensive } = findCheapestAndMostExpensive(gasData);

  return {
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
  };
}