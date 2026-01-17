import productsRaw from '@/data/products.json'
import type { Product } from './types'

const base = process.env.NEXT_PUBLIC_R2_BASE_URL || ''

function withBase(url?: string) {
  if (!url) return undefined
  return url.startsWith('http') ? url : `${base}${url}`
}

export function getAllProducts(): Product[] {
  const list = (productsRaw as any).products as any[]

  return list
    .filter((p) => !!p.primary_image_path) // ONLY show products with an image
    .map((p) => ({
      id: String(p.id),
      source: p.source,
      brand: p.brand,
      category: p.category,
      sku: p.sku ? String(p.sku) : undefined,
      title: p.title,
      description: p.description,
      price_gbp: typeof p.price_gbp === 'number' ? p.price_gbp : undefined,
      image: withBase(p.primary_image_path),
      images: Array.isArray(p.image_paths) ? p.image_paths.map(withBase).filter(Boolean) as string[] : [],
    }))
}

export function getProductById(id: string): Product | undefined {
  return getAllProducts().find((p) => p.id === id)
}

export function formatGBP(amount?: number): string {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return '—'
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(amount)
}
