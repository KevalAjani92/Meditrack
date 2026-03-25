"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

interface UseSocketOptions {
  doctorId?: number;
  hospitalId?: number;
}

interface UseSocketReturn {
  isConnected: boolean;
  onQueueUpdate: (callback: (data: any) => void) => void;
  onConsultationCompleted: (callback: (data: any) => void) => void;
}

export function useSocket(options: UseSocketOptions = {}): UseSocketReturn {
  const { doctorId, hospitalId } = options;
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const queueCallbackRef = useRef<((data: any) => void) | null>(null);
  const consultCallbackRef = useRef<((data: any) => void) | null>(null);

  useEffect(() => {
    const query: Record<string, string> = {};
    if (doctorId) query.doctorId = String(doctorId);
    if (hospitalId) query.hospitalId = String(hospitalId);

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      query,
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("queue:updated", (data: any) => {
      queueCallbackRef.current?.(data);
    });

    socket.on("consultation:completed", (data: any) => {
      consultCallbackRef.current?.(data);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [doctorId, hospitalId]);

  const onQueueUpdate = useCallback((callback: (data: any) => void) => {
    queueCallbackRef.current = callback;
  }, []);

  const onConsultationCompleted = useCallback(
    (callback: (data: any) => void) => {
      consultCallbackRef.current = callback;
    },
    []
  );

  return { isConnected, onQueueUpdate, onConsultationCompleted };
}
