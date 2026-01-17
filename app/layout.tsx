import './globals.css'
import type { Metadata } from 'next'
import { CartProvider } from '@/app/cart/CartProvider'
import { Header } from '@/app/components/Header'

export const metadata: Metadata = {
  title: 'NOIR Furniture Atelier',
  description: 'Premium furniture demo store (bank transfer only).',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          {children}
          <footer className="mt-20 border-t border-white/10">
            <div className="mx-auto max-w-6xl px-4 py-10 text-xs text-white/50 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <p>© {new Date().getFullYear()} NOIR Furniture Atelier — Demo storefront.</p>
              <p>Orders are paid by bank transfer and manually processed.</p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  )
}
