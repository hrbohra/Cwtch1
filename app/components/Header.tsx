'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/app/cart/CartProvider'
import { CartDrawer } from './cart/CartDrawer'

export function Header() {
  const { count } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="text-lg font-semibold tracking-wide">NOIR</span>
            <span className="text-xs text-white/50">Furniture Atelier</span>
          </Link>

          <nav className="flex items-center gap-2">
            <Link href="/" className="text-sm text-white/70 hover:text-white transition">Shop</Link>
            <Link href="/checkout" className="text-sm text-white/70 hover:text-white transition">Checkout</Link>
            <button
              onClick={() => setOpen(true)}
              className="relative rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-sm transition"
            >
              Cart
              {count > 0 && (
                <span className="ml-2 inline-flex items-center justify-center rounded-full bg-white text-black text-xs font-semibold w-5 h-5">
                  {count}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  )
}
