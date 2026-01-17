'use client'

import type { Product } from '@/lib/types'
import { useCart } from '@/app/cart/CartProvider'
import { PrimaryButton } from '@/app/components/ui'

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart()
  return (
    <PrimaryButton onClick={() => add(product, 1)}>
      Add to cart
    </PrimaryButton>
  )
}
