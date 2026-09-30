import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KBC mobile | Personal banking',
  description: 'Your KBC personal banking overview',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}