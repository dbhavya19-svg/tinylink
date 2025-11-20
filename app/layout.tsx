// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "TinyLink",
  description: "A simple URL shortener built for assessment"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">TinyLink</h1>
            <a href="/" className="text-sm text-sky-600">Dashboard</a>
          </div>
        </header>

        <main className="flex-1 max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="max-w-5xl mx-auto px-4 py-6 text-sm text-gray-500">
          Built for TinyLink assignment — Next.js + Neon Postgres
        </footer>
      </body>
    </html>
  );
}
