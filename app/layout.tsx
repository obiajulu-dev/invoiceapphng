import { League_Spartan } from 'next/font/google';
import { Providers } from '@/components/layout/Providers';
import { Header } from '@/components/layout/Header';
import './globals.css';
import { Metadata } from 'next';

const leagueSpartan = League_Spartan({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'Invoice App',
  description: 'Professional invoice management application',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={leagueSpartan.className}>
        <Providers>
          <div className="flex min-h-screen">
            <Header />
            <main className="flex-1 flex justify-center pt-[72px] lg:pt-0 lg:ml-[80px]">
              <div className="w-full max-w-[730px] px-6 py-8 md:px-12 md:py-14 lg:px-6 lg:py-16">
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}