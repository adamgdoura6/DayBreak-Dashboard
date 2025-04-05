'use client';

import { useEffect } from 'react';
import '../pages/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const checkTime = () => {
      const now = new global.Date();
      const hours = now.getHours();
      document.documentElement.setAttribute('data-theme', hours >= 21 || hours < 6 ? 'dark' : 'light');
    };

    // Check time immediately
    checkTime();

    // Check time every minute
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 