'use client'

import { useMemo, useState } from 'react'
import type { Product } from '@/lib/types'
import { Input, Chip } from './ui'
import { ProductCard } from './ProductCard'

export function Catalog({ products }: { products: Product[] }) {
  const [q, setQ] = useState('')
  const [brand, setBrand] = useState<string>('')
  const [category, setCategory] = useState<string>('')

  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).sort(), [products])
  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category).filter(Boolean))).sort(), [products])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    return products.filter((p) => {
      if (brand && p.brand !== brand) return false
      if (category && p.category !== category) return false
      if (!s) return true
      return (
        p.title.toLowerCase().includes(s) ||
        (p.description || '').toLowerCase().includes(s) ||
        (p.source || '').toLowerCase().includes(s)
      )
    })
  }, [products, q, brand, category])

  return (
    <div className="mt-10">
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <label className="block text-xs text-white/50 mb-2">Search</label>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Sofas, dining tables, console…" />
        </div>

        <div className="grid grid-cols-2 gap-3 md:w-[420px]">
          <div>
            <label className="block text-xs text-white/50 mb-2">Brand</label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
            >
              <option value="">All</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm"
            >
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-white/50">
        <span>Showing</span>
        <Chip className="text-white/70">{filtered.length}</Chip>
        <span>products with images</span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}
