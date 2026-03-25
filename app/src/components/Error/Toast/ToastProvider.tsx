import React, { createContext, useContext, useRef, useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Toast from './Toasts';

type ToastType = 'success' | 'error' | 'warning' | 'info';
type ToastPayload = {
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number; 
  colors?: string[]; 
};

type ToastContextType = {
  showToast: (p: ToastPayload) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toastRef = useRef<{ show: (p: ToastPayload) => void } | null>(null);

  const showToast = useCallback((payload: ToastPayload) => {
    toastRef.current?.show(payload);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View pointerEvents="box-none" style={styles.toastWrapper}>
        <Toast ref={toastRef} />
      </View>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

const styles = StyleSheet.create({
  toastWrapper: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
    elevation: 9999,
  },
});
