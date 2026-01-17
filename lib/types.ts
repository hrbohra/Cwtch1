export type Product = {
  id: string
  source: string
  brand?: string
  category?: string
  sku?: string | number
  title: string
  description?: string
  price_gbp?: number
  image?: string
  images?: string[]
}

export type CartItem = {
  product: Product
  qty: number
}

export type Customer = {
  fullName: string
  email: string
  phone: string
  address1: string
  address2?: string
  city: string
  postcode: string
  country: string
  notes?: string
}
