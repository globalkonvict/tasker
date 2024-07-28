"use client";
import React, { createContext, useState, useEffect, useRef } from "react";
import type { ActionType } from "@ant-design/pro-components";
import pb from "@/lib/pocketbase/pocketbase";

type RealtimeContextType = {
  subscribe: (collection: string) => () => void;
  actionRef: React.MutableRefObject<ActionType | undefined>;
} | null;

export const RealtimeContext = createContext<RealtimeContextType>(null);

type RealtimeProviderProps = {
  children: React.ReactNode;
};

export const RealtimeProvider: React.FC<RealtimeProviderProps> = ({
  children,
}) => {
  const actionRef = useRef<ActionType>();
  const [collection, setCollection] = useState("");

  const subscribe = (collection: string) => {
    setCollection(collection);
    return () => {
      setCollection("");
    };
  };

  useEffect(() => {
    if (collection && actionRef.current) {
      pb.collection(collection).subscribe("*", (e) => {
        console.log("Realtime event", e);
        if (["create", "update", "delete"].includes(e.action)) {
          actionRef?.current?.reload();
        }
      });

      return () => {
        pb.collection(collection).unsubscribe("*");
      };
    }
  }, [collection, actionRef]);

  return (
    <RealtimeContext.Provider value={{ subscribe, actionRef }}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = (collection: string) => {
  const context = React.useContext(RealtimeContext);

  if (context === undefined) {
    throw new Error("useRealtime must be used within a RealtimeProvider");
  }

  useEffect(() => {
    const unsubscribe = context?.subscribe(collection) || console.log;
    return () => {
      unsubscribe("Could not unsubscribe...");
    };
  }, [collection, context]);

  return context?.actionRef;
};
