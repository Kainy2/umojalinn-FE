"use client";
import { useCallback, useEffect, useState } from "react";

const useStorage = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const getItem = useCallback((key: string): Record<string, any> | null => {
    const val = localStorage?.getItem(key);
    return val !== null ? JSON.parse(val) : null;
  }, []);

  const setItem = useCallback(
    (key: string, value: Record<string, unknown>) =>
      localStorage?.setItem(key, JSON.stringify(value)),
    []
  );
  const deleteItem = useCallback(
    (key: string) => localStorage?.removeItem(key),
    []
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLoaded(true);
    }
  }, []);

  return {
    getItem,
    setItem,
    deleteItem,
    loaded,
  };
};

export default useStorage;
