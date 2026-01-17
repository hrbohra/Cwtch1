import { getAllProducts } from '@/lib/products'
import { Catalog } from '@/app/components/Catalog'

export default function Page() {
  const products = getAllProducts()

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 pt-14 pb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-white/60">Limited edition demo collection</p>
          <h1 className="mt-3 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
            Premium furniture,
            <span className="block text-white/70">curated for modern interiors.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-white/60">
            A no-login demo storefront: add to cart, checkout, receive bank transfer instructions, and we’ll confirm manually once payment clears.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-medium">Bank transfer checkout</p>
              <p className="mt-1 text-xs text-white/60">Unique reference generated per order.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-medium">Premium presentation</p>
              <p className="mt-1 text-xs text-white/60">Luxury UI, fast images via R2 CDN.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-medium">Email to shop only</p>
              <p className="mt-1 text-xs text-white/60">SendGrid webhook email on order placement.</p>
            </div>
          </div>

          <Catalog products={products} />
        </div>
      </section>
    </main>
  )
}
