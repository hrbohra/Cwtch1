'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { formatGBP } from '@/lib/products'
import { Button, Chip, PrimaryButton } from '@/app/components/ui'

const ORDER_KEY = 'pf_demo_last_order_v1'

type Order = {
  reference: string
  createdAt: string
  currency: 'GBP'
  total: number
  customer: any
  items: any[]
}

function row(label: string, value: string | undefined) {
  if (!value) return null
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-white/50">{label}</span>
      <span className="text-sm font-medium text-white/85">{value}</span>
    </div>
  )
}

export default function SuccessPage() {
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ORDER_KEY)
      if (raw) setOrder(JSON.parse(raw))
    } catch {}
  }, [])

  const bank = useMemo(() => {
    return {
      bankName: process.env.NEXT_PUBLIC_BANK_NAME,
      accountName: process.env.NEXT_PUBLIC_ACCOUNT_NAME,
      sortCode: process.env.NEXT_PUBLIC_SORT_CODE,
      accountNumber: process.env.NEXT_PUBLIC_ACCOUNT_NUMBER,
      iban: process.env.NEXT_PUBLIC_IBAN,
      bic: process.env.NEXT_PUBLIC_BIC,
    }
  }, [])

  if (!order) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Order received</h1>
        <p className="mt-3 text-white/60">If you just placed an order, please keep this tab open and return from checkout.</p>
        <Link href="/" className="mt-6 inline-block">
          <PrimaryButton>Back to shop</PrimaryButton>
        </Link>
      </main>
    )
  }

  const amount = formatGBP(order.total)

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Thank you — order placed</h1>
      <p className="mt-2 text-white/60 text-sm">
        Your order is now pending payment. Please complete a bank transfer using the reference below.
      </p>

      <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs text-white/50">Payment reference (must be included)</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{order.reference}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/50">Amount</p>
            <p className="mt-2 text-2xl font-semibold">{amount}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-black/30 p-5">
          <div className="flex items-center gap-2">
            <Chip>Bank transfer details</Chip>
            <span className="text-xs text-white/50">(set via env vars)</span>
          </div>
          {row('Bank', bank.bankName)}
          {row('Account name', bank.accountName)}
          {row('Sort code', bank.sortCode)}
          {row('Account number', bank.accountNumber)}
          {row('IBAN', bank.iban)}
          {row('BIC/SWIFT', bank.bic)}
          <p className="mt-2 text-xs text-white/50">
            Use <span className="text-white/80 font-medium">{order.reference}</span> as the transfer reference. Your order will be processed once funds clear.
          </p>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium">What happens next?</p>
          <ul className="mt-2 space-y-1 text-sm text-white/60">
            <li>1) You complete the bank transfer with the reference above.</li>
            <li>2) We manually verify the payment.</li>
            <li>3) We personally email you to confirm and arrange delivery.</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Link href="/">
          <PrimaryButton>Continue shopping</PrimaryButton>
        </Link>
        <Button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(order.reference)
          }}
        >
          Copy reference
        </Button>
      </div>
    </main>
  )
}
