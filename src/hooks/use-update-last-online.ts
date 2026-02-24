"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { database } from "@/lib/firebase";
import { ref, set } from "firebase/database";

const UPDATE_INTERVAL = 2 * 60 * 1000; // 2 minutes in milliseconds

export const useUpdateLastOnline = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Guard clause: Exit if no userId
    if (!userId) {
      return;
    }

    // Function to update lastOnlineAt in Firebase
    const updateLastOnline = async () => {
      try {
        const userRef = ref(database, `users/${userId}/lastOnlineAt`);
        const timestamp = new Date().toISOString();
        await set(userRef, timestamp);
      } catch (error) {
        // Silent error - don't disrupt user experience
        // Just log to console for debugging
        console.error("Failed to update lastOnlineAt:", error);
      }
    };

    // Immediate update on mount
    void updateLastOnline();

    // Set up interval for periodic updates
    intervalRef.current = setInterval(() => {
      void updateLastOnline();
    }, UPDATE_INTERVAL);

    // Cleanup function
    return () => {
      // Clear interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Set final timestamp on unmount
      void updateLastOnline();
    };
  }, [userId]);

  // Hook doesn't return anything - it's just for side effects
  return null;
};
