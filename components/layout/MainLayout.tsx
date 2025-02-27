import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col">
      <Header />
      <main className="flex-1 static z-0">
        {children}
      </main>
      <Footer />
    </div>
  );
}