import productsRaw from '@/data/products.json'
import type { Product } from './types'

const base = process.env.NEXT_PUBLIC_R2_BASE_URL || ''

export function getAllProducts(): Product[] {
  const list = (productsRaw as any).products as Product[]
  // Ensure full URL for images
  return list
    .filter((p) => !!p.image)
    .map((p) => ({
      ...p,
      image: p.image?.startsWith('http') ? p.image : `${base}${p.image}`,
      images: (p.images || []).map((x) => (x.startsWith('http') ? x : `${base}${x}`)),
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
