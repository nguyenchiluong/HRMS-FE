import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#363636',
        },
        success: {
          duration: 3000,
          style: {
            background: '#10b981', // green-500
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#10b981',
          },
        },
        error: {
          duration: 5000,
          style: {
            background: '#ef4444', // red-500
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#ef4444',
          },
        },
        loading: {
          style: {
            background: '#3b82f6', // blue-500
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#3b82f6',
          },
        },
      }}
    />
  );
}