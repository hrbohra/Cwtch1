'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { CartItem, Product } from '@/lib/types'

type CartState = {
  items: CartItem[]
  add: (product: Product, qty?: number) => void
  remove: (id: string) => void
  setQty: (id: string, qty: number) => void
  clear: () => void
  total: number
  count: number
}

const CartContext = createContext<CartState | null>(null)
const KEY = 'pf_demo_cart_v1'

function calcTotal(items: CartItem[]): number {
  return items.reduce((sum, it) => sum + (it.product.price_gbp || 0) * it.qty, 0)
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {}
  }, [items])

  const value: CartState = useMemo(() => {
    return {
      items,
      add: (product, qty = 1) => {
        setItems((prev) => {
          const next = [...prev]
          const i = next.findIndex((x) => x.product.id === product.id)
          if (i >= 0) next[i] = { ...next[i], qty: next[i].qty + qty }
          else next.push({ product, qty })
          return next
        })
      },
      remove: (id) => setItems((prev) => prev.filter((x) => x.product.id !== id)),
      setQty: (id, qty) => setItems((prev) => prev.map((x) => (x.product.id === id ? { ...x, qty: Math.max(1, qty) } : x))),
      clear: () => setItems([]),
      total: calcTotal(items),
      count: items.reduce((n, it) => n + it.qty, 0),
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
