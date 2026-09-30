import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Travel Planner | Offline ML & NLP Chatbot',
  description: 'Personalized Offline Travel Planning Chatbot powered by local ML & NLP',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
