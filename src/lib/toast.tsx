"use client";

import { toast as sonnerToast } from "sonner";
import { CircleCheck, CircleX } from "lucide-react";
import React from "react";

export const toast = {
  success: (message: string, description?: string) =>
    sonnerToast(message, {
      description,
      icon: <CircleCheck size={18} strokeWidth={2.5} color="#29ab87" />,
      style: {
        background: "#111",
        color: "#fff",
        borderRadius: "10px",
        padding: "12px 16px",
      },
    }),

  error: (message: string, description?: string) =>
    sonnerToast(message, {
      description,
      icon: <CircleX size={18} strokeWidth={2.5} color="#ff5252" />,
      style: {
        background: "#111",
        color: "#fff",
        borderRadius: "10px",
        padding: "12px 16px",
      },
    }),
};
