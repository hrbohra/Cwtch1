import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

export const runtime = 'nodejs'

type Incoming = {
  reference: string
  createdAt: string
  currency: 'GBP'
  total: number
  customer: {
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
  items: Array<{ id: string; title: string; sku?: any; price_gbp?: number; qty: number }>
}

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export async function POST(req: Request) {
  const key = process.env.SENDGRID_API_KEY
  const to = process.env.SHOP_EMAIL_TO
  const from = process.env.SHOP_EMAIL_FROM

  if (!key || !to || !from) {
    return NextResponse.json(
      { error: 'Missing env vars: SENDGRID_API_KEY, SHOP_EMAIL_TO, SHOP_EMAIL_FROM' },
      { status: 500 }
    )
  }

  const body = (await req.json()) as Incoming
  if (!body?.reference || !body?.customer?.email || !Array.isArray(body?.items) || body.items.length === 0) {
    return NextResponse.json({ error: 'Invalid order payload' }, { status: 400 })
  }

  sgMail.setApiKey(key)

  const lines = body.items
    .map(
      (it) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">${esc(it.title)}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">${it.qty}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">£${Math.round((it.price_gbp || 0))}</td>
        </tr>`
    )
    .join('')

  const c = body.customer
  const addr = [c.address1, c.address2, c.city, c.postcode, c.country].filter(Boolean).join(', ')

  const html = `
  <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;line-height:1.4;">
    <h2 style="margin:0 0 8px;">New order: ${esc(body.reference)}</h2>
    <p style="margin:0 0 16px;color:#444;">Placed at ${esc(body.createdAt)} — Total <strong>£${Math.round(body.total)}</strong></p>

    <h3 style="margin:16px 0 8px;">Customer</h3>
    <p style="margin:0 0 4px;"><strong>${esc(c.fullName)}</strong></p>
    <p style="margin:0 0 4px;">Email: ${esc(c.email)}</p>
    <p style="margin:0 0 4px;">Phone: ${esc(c.phone)}</p>
    <p style="margin:0 0 4px;">Address: ${esc(addr)}</p>
    ${c.notes ? `<p style="margin:8px 0 0;color:#444;">Notes: ${esc(c.notes)}</p>` : ''}

    <h3 style="margin:16px 0 8px;">Items</h3>
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr>
          <th style="text-align:left;border-bottom:2px solid #111;padding:8px 0;">Product</th>
          <th style="text-align:center;border-bottom:2px solid #111;padding:8px 0;">Qty</th>
          <th style="text-align:right;border-bottom:2px solid #111;padding:8px 0;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${lines}
      </tbody>
    </table>

    <p style="margin:16px 0 0;color:#444;">Payment method: <strong>Bank transfer</strong></p>
    <p style="margin:4px 0 0;color:#444;">Customer must use reference: <strong>${esc(body.reference)}</strong></p>
  </div>
  `

  try {
    await sgMail.send({
      to,
      from,
      subject: `New order ${body.reference} — £${Math.round(body.total)}`,
      html,
    })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'SendGrid error' }, { status: 500 })
  }
}
