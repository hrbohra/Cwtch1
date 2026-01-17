'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/lib/types'
import { formatGBP } from '@/lib/products'
import { useCart } from '@/app/cart/CartProvider'
import { PrimaryButton, Chip } from './ui'

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()

  return (
    <div className="group rounded-3xl border border-white/10 bg-white/5 overflow-hidden shadow-soft">
      <Link href={`/product/${encodeURIComponent(product.id)}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover scale-[1.01] group-hover:scale-[1.06] transition duration-700"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {product.brand && <Chip>{product.brand}</Chip>}
            {product.category && <Chip>{product.category}</Chip>}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-medium leading-tight line-clamp-2">{product.title}</h3>
          <p className="mt-1 text-xs text-white/60">{product.source}</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="text-sm font-semibold">{formatGBP(product.price_gbp)}</div>
            <div className="text-xs text-white/50">View details</div>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <PrimaryButton className="w-full" onClick={() => add(product, 1)}>
          Add to Cart
        </PrimaryButton>
      </div>
    </div>
  )
}
