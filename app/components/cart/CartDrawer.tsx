'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/app/cart/CartProvider'
import { formatGBP } from '@/lib/products'
import { Button, PrimaryButton } from '../ui'

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, total, remove, setQty } = useCart()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <button aria-label="Close" className="absolute inset-0 bg-black/60" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md border-l border-white/10 bg-black/70 backdrop-blur-xl p-4 flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <Button onClick={onClose}>Close</Button>
        </div>

        <div className="flex-1 overflow-auto py-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-white/60">Your cart is empty.</p>
          ) : (
            items.map(({ product, qty }) => (
              <div key={product.id} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-white/10">
                  {product.image && (
                    <Image src={product.image} alt={product.title} fill className="object-cover" sizes="64px" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.title}</p>
                  <p className="text-xs text-white/60">{product.brand || product.source}</p>
                  <p className="text-sm mt-1">{formatGBP(product.price_gbp)}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Button onClick={() => setQty(product.id, qty - 1)}>-</Button>
                    <span className="w-8 text-center text-sm">{qty}</span>
                    <Button onClick={() => setQty(product.id, qty + 1)}>+</Button>
                    <button
                      onClick={() => remove(product.id)}
                      className="ml-auto text-xs text-white/60 hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Subtotal</span>
            <span className="font-semibold">{formatGBP(total)}</span>
          </div>
          <Link href="/checkout" onClick={onClose}>
            <PrimaryButton className="w-full mt-3">Proceed to Checkout</PrimaryButton>
          </Link>
          <p className="mt-2 text-xs text-white/50">Bank transfer only (demo). No login required.</p>
        </div>
      </aside>
    </div>
  )
}
