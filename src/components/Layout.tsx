import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-kid-sky/20 via-white to-kid-mint/20">
      <header className="bg-white/90 backdrop-blur-sm border-b-4 border-kid-orange/30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-kid-orange to-kid-berry flex items-center gap-2">
            <span className="text-4xl" aria-hidden>🧮</span>
            Math Practice
          </h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
