import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'The 11th Mile | Elite Training',
  description: 'Performance Laboratory // England',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* We removed the rogue header from here! */}
        {children}
      </body>
    </html>
  );
}