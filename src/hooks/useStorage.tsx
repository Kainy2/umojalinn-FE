"use client";
import { useCallback, useEffect, useState } from "react";

const useStorage = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const getItem = useCallback((key: string) => {
    const val = localStorage.getItem(key);
    return val !== null ? JSON.parse(val) : null;
  }, []);

  const setItem = useCallback(
    (key: string, value: Record<string, unknown>) =>
      localStorage.setItem(key, JSON.stringify(value)),
    []
  );
  const deleteItem = useCallback(
    (key: string) => localStorage.removeItem(key),
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
