'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/app/cart/CartProvider'
import { formatGBP } from '@/lib/products'
import { Input, Textarea, PrimaryButton, Button } from '@/app/components/ui'
import type { Customer } from '@/lib/types'

function genRef(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return `NOIR-${out}`
}

const ORDER_KEY = 'pf_demo_last_order_v1'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clear } = useCart()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const [form, setForm] = useState<Customer>({
    fullName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    postcode: '',
    country: 'United Kingdom',
    notes: '',
  })

  const canSubmit = useMemo(() => {
    return (
      items.length > 0 &&
      form.fullName.trim() &&
      form.email.trim() &&
      form.phone.trim() &&
      form.address1.trim() &&
      form.city.trim() &&
      form.postcode.trim() &&
      form.country.trim()
    )
  }, [items.length, form])

  async function placeOrder() {
    setError('')
    if (!canSubmit) return
    setLoading(true)

    const reference = genRef()
    const order = {
      reference,
      createdAt: new Date().toISOString(),
      currency: 'GBP',
      total,
      customer: form,
      items: items.map((it) => ({
        id: it.product.id,
        title: it.product.title,
        sku: it.product.sku,
        price_gbp: it.product.price_gbp,
        qty: it.qty,
      })),
    }

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(t || 'Failed to place order')
      }

      localStorage.setItem(ORDER_KEY, JSON.stringify(order))
      clear()
      router.push('/success')
    } catch (e: any) {
      setError(e?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Checkout</h1>
      <p className="mt-2 text-white/60 text-sm">Bank transfer only. No login. We will confirm manually after payment clears.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-3 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Customer details</h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs text-white/50 mb-2">Full name</label>
              <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-2">Email</label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-2">Phone</label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-white/50 mb-2">Address line 1</label>
              <Input value={form.address1} onChange={(e) => setForm({ ...form, address1: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-white/50 mb-2">Address line 2 (optional)</label>
              <Input value={form.address2 || ''} onChange={(e) => setForm({ ...form, address2: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-2">City</label>
              <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-2">Postcode</label>
              <Input value={form.postcode} onChange={(e) => setForm({ ...form, postcode: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-white/50 mb-2">Country</label>
              <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-white/50 mb-2">Notes (optional)</label>
              <Textarea value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-red-300">{error}</p>}

          <div className="mt-6 flex items-center gap-3">
            <PrimaryButton disabled={!canSubmit || loading} onClick={placeOrder}>
              {loading ? 'Placing order…' : 'Place order'}
            </PrimaryButton>
            <Link href="/">
              <Button type="button">Continue shopping</Button>
            </Link>
          </div>

          <p className="mt-4 text-xs text-white/50">
            After placing your order you will see bank transfer details and a unique reference that must be used in the bank transfer.
          </p>
        </section>

        <aside className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <div className="mt-5 space-y-3">
            {items.length === 0 ? (
              <p className="text-sm text-white/60">Your cart is empty.</p>
            ) : (
              items.map((it) => (
                <div key={it.product.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{it.product.title}</p>
                    <p className="text-xs text-white/60">Qty {it.qty}</p>
                  </div>
                  <p className="text-sm text-white/80">{formatGBP((it.product.price_gbp || 0) * it.qty)}</p>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between">
            <span className="text-sm text-white/60">Total</span>
            <span className="text-lg font-semibold">{formatGBP(total)}</span>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-sm font-medium">Payment method</p>
            <p className="mt-1 text-xs text-white/60">Direct bank transfer (manual confirmation)</p>
          </div>
        </aside>
      </div>
    </main>
  )
}
