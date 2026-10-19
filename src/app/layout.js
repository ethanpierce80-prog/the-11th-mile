import './globals.css';
import { Inter } from 'next/font/google';
import { siteUrl } from './site-url';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Running Workouts & 5K Pace Calculator | The 11th Mile',
  description: 'Explore running sessions and use the 5K pace calculator to find training paces for your next workout.',
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