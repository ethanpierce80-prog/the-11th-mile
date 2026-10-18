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
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-D2Q8YP1ZNX"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-D2Q8YP1ZNX');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {/* We removed the rogue header from here! */}
        {children}
      </body>
    </html>
  );
}