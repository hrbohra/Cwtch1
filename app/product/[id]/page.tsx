import Image from 'next/image'
import Link from 'next/link'
import { getProductById, formatGBP } from '@/lib/products'
import { AddToCart } from './ui'

export default function ProductPage({ params }: { params: { id: string } }) {
  const id = decodeURIComponent(params.id)
  const product = getProductById(id)

  if (!product) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <p className="mt-4 text-white/60">The product id: {id}</p>
        <Link href="/" className="mt-6 inline-block text-sm text-white underline">Back to shop</Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/" className="text-sm text-white/60 hover:text-white">← Back</Link>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="relative aspect-[4/3]">
            {product.image && (
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{product.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/60">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{product.source}</span>
            {product.brand && <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{product.brand}</span>}
            {product.category && <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{product.category}</span>}
            {product.sku && <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">SKU: {String(product.sku)}</span>}
          </div>

          <p className="mt-5 text-white/60 leading-relaxed">{product.description || '—'}</p>

          <div className="mt-8 flex items-center justify-between">
            <div>
              <p className="text-xs text-white/50">Price</p>
              <p className="text-2xl font-semibold">{formatGBP(product.price_gbp)}</p>
            </div>
            <AddToCart product={product} />
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-medium">Checkout & delivery</p>
            <p className="mt-1 text-xs text-white/60">
              Bank transfer only. A unique reference code is generated at checkout. Orders are confirmed manually after funds clear.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
