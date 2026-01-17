# NOIR Furniture Atelier (Demo Store)

Premium, no-login demo furniture store:
- Shows **only products with images** (filtered from your combined spreadsheet)
- Add to cart
- Checkout (bank transfer only)
- Generates a **unique reference** at checkout
- Shows bank transfer details on the success page
- Sends **one email to the shop** (SendGrid) with order + customer details

## 1) What you need (free tiers)
- **GitHub** (repo)
- **Cloudflare R2** (image hosting)
- **Vercel** (frontend hosting)
- **SendGrid** (shop notification emails)

---

## 2) Local setup
```bash
npm i
npm run dev
```
Open http://localhost:3000

---

## 3) Products + images (important)
Your spreadsheet is already normalized into these columns:
`id, source, brand, category, sku, title, description, price_gbp, images, ...`

This repo contains:
- `combined_products_ANN_BEE_GIL_DEEP.csv.xlsx`
- `_image_map.json` (maps your local file paths -> **R2 object keys**)
- `data/products.json` (generated output used by the store)

### Regenerate products.json (after you update data)
```bash
npm run gen:products
```
This will rewrite `data/products.json` and keep **only** products that have at least one image mapped.

---

## 4) Uploading your 2.5GB image folder to Cloudflare R2
### Option A (recommended): R2 + Custom Domain
1. Create an R2 bucket, e.g. `noir-assets`
2. Upload your images preserving folder structure (keys like `/product_images/...`)
3. Create a public endpoint:
   - In Cloudflare: R2 -> Bucket -> Settings -> Domain Access -> **Connect Domain**
   - Example: `https://media.yourdomain.com`

### Option B (quick demo): R2 public development URL
Enable the bucket **Public Development URL** and use that base URL.

### Set the image base URL in the website
Set `NEXT_PUBLIC_R2_BASE_URL` (Vercel env or `.env.local`).
Example:
```
NEXT_PUBLIC_R2_BASE_URL=https://media.yourdomain.com
```
The app will automatically build final image URLs like:
`{NEXT_PUBLIC_R2_BASE_URL}{image_path_from_map}`

---

## 5) Bank transfer details (shown to customers after checkout)
Set these environment variables:
```
NEXT_PUBLIC_BANK_NAME=Your Bank Name
NEXT_PUBLIC_ACCOUNT_NAME=Your Company Name
NEXT_PUBLIC_SORT_CODE=00-00-00
NEXT_PUBLIC_ACCOUNT_NUMBER=12345678
NEXT_PUBLIC_IBAN=...
NEXT_PUBLIC_BIC=...
```
If a field is missing it just won't display.

---

## 6) SendGrid (email to shop only)
This site sends **one email to you** when the customer places an order.

### 6.1 Create SendGrid API key
- In SendGrid -> Settings -> API Keys -> Create API Key
- Give it "Mail Send" permission

### 6.2 Verify a sender
SendGrid requires a verified sender/domain. Create a sender like:
`[email protected]` and verify it in SendGrid.

### 6.3 Set Vercel env vars (or `.env.local`)
```
SENDGRID_API_KEY=SG.xxxxx
SHOP_EMAIL_TO=you@yourdomain.com
SHOP_EMAIL_FROM=orders@yourdomain.com
```
The API route is: `app/api/order/route.ts`.

---

## 7) Deploy to Vercel + connect your domain (free)
1. Push this repo to GitHub
2. In Vercel: "Add New" -> "Project" -> Import the repo
3. Add environment variables from sections (4/5/6)
4. Deploy

### Custom domain
Vercel Hobby plan supports custom domains:
- Project -> Settings -> Domains -> Add domain
- Update DNS (nameservers or records) as Vercel instructs.

---

## 8) How checkout works
1. Customer adds items to cart
2. Checkout collects customer details
3. On "Place order":
   - Generates reference like `NOIR-AB12CD34`
   - Calls `/api/order` to email the shop
   - Shows bank details + reference on `/success`
4. Shop manually verifies the transfer and emails the customer personally.

---

## 9) Notes / customization
- Brand, category filters + search are included on the home page
- Product detail pages are at `/product/[id]`
- Cart persists in localStorage (no login)

If you want me to add:
- shipping cost rules
- VAT / tax
- a hidden admin export to CSV
- customer confirmation email (optional)

just say the word.
