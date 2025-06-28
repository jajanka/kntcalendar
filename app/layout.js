import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SupabaseProvider } from './components/SupabaseProvider';
import { Web3Provider } from './components/Web3Provider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "KuntCalendar - Track Your Raw Reality",
  description: "No sugar coating. No bullshit. Just honest daily reflections on your wins, losses, and everything in between.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900`}
      >
        <Web3Provider>
          <SupabaseProvider>
            {children}
          </SupabaseProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
