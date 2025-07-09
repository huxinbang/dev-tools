import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 字符串转字节数组
export function stringToBytes(str: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

// 字节数组转字符串
export function bytesToString(bytes: Uint8Array): string {
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

// Hex 字符串转字节数组
export function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.replace(/[^0-9A-Fa-f]/g, "");
  if (cleanHex.length % 2 !== 0) {
    throw new Error("Invalid hex string: odd length");
  }
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(cleanHex.substr(i, 2), 16);
  }
  return bytes;
}

// 字节数组转 Hex 字符串
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

// Base64 字符串转字节数组
export function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// 字节数组转 Base64 字符串
export function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Base64 转 Hex
export function base64ToHex(base64: string): string {
  return bytesToHex(base64ToBytes(base64));
}

// Hex 转 Base64
export function hexToBase64(hex: string): string {
  return bytesToBase64(hexToBytes(hex));
}

// 统一错误 Toast 工具
// 用法：showErrorToast(toast, error, fallbackMsg)
export function showErrorToast(
  toast: (opts: { title: string; description: string; variant?: "default" | "destructive" | null }) => void,
  error: unknown,
  fallbackMsg = "操作失败，请重试"
) {
  toast({
    title: "Error",
    description:
      error instanceof Error
        ? error.message
        : typeof error === "string"
        ? error
        : fallbackMsg,
    variant: "destructive",
  });
}

// 复制到剪贴板工具
export async function copyToClipboard(
  text: string,
  toast?: (opts: { title: string; description: string; variant?: "default" | "destructive" | null }) => void,
  successMsg = "Copied!",
  errorMsg = "Failed to copy to clipboard"
) {
  try {
    await navigator.clipboard.writeText(text);
    if (toast) {
      toast({ title: successMsg, description: "内容已复制到剪贴板", variant: "default" });
    }
    return true;
  } catch (error) {
    if (toast) {
      showErrorToast(toast, error, errorMsg);
    }
    return false;
  }
}

// 格式化 hex 字符串（每2位加空格，全部大写）
export function formatHex(hex: string): string {
  const cleanHex = hex.replace(/[^0-9A-Fa-f]/g, "").toUpperCase();
  return cleanHex.replace(/(.{2})/g, "$1 ").trim();
}

// 格式化日期为 yyyy-MM-dd HH:mm:ss（本地时区）
export function formatDateTime(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
