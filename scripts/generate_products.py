import json
import ast
import pandas as pd
from pathlib import Path

"""Generate data/products.json from the combined spreadsheet + image map.

Inputs expected in repo root:
- combined_products_ANN_BEE_GIL_DEEP.csv.xlsx
- _image_map.json

Output:
- data/products.json

Rules:
- ONLY products that have at least one image that maps via _image_map.json are included.
- The first mapped image becomes `image` (primary image).
- All mapped images become `images`.
"""

ROOT = Path(__file__).resolve().parents[1]
XLSX = ROOT / 'combined_products_ANN_BEE_GIL_DEEP.csv.xlsx'
IMG_MAP = ROOT / '_image_map.json'
OUT = ROOT / 'data' / 'products.json'
OUT.parent.mkdir(parents=True, exist_ok=True)

with IMG_MAP.open('r', encoding='utf-8') as f:
    imgmap = json.load(f)

df = pd.read_excel(XLSX, sheet_name='combined_products')


def parse_images(val):
    if pd.isna(val):
        return []
    if isinstance(val, list):
        return val
    s = str(val).strip()
    if not s:
        return []
    try:
        parsed = ast.literal_eval(s)
        if isinstance(parsed, list):
            return [str(x) for x in parsed]
    except Exception:
        pass

    # Fallback: try splitting by common separators
    parts = [p.strip().strip('"\'') for p in s.split('|') if p.strip()]
    if len(parts) <= 1:
        parts = [p.strip().strip('"\'') for p in s.split(',') if p.strip()]
    return parts


products = []
for _, row in df.iterrows():
    imgs = parse_images(row.get('images'))
    mapped = [imgmap.get(p) for p in imgs if p in imgmap]
    mapped = [m for m in mapped if m]
    if not mapped:
        continue

    sku = row.get('sku')
    if isinstance(sku, float) and sku.is_integer():
        sku = int(sku)

    price = row.get('price_gbp')
    try:
        price = float(price) if pd.notna(price) else None
    except Exception:
        price = None

    products.append(
        {
            'id': str(row.get('id')),
            'source': str(row.get('source')),
            'brand': None if pd.isna(row.get('brand')) else str(row.get('brand')),
            'category': None if pd.isna(row.get('category')) else str(row.get('category')),
            'sku': sku,
            'title': str(row.get('title')),
            'description': None if pd.isna(row.get('description')) else str(row.get('description')),
            'price_gbp': price,
            'image': mapped[0],
            'images': mapped,
        }
    )

payload = {'count': len(products), 'products': products}
OUT.write_text(json.dumps(payload, ensure_ascii=False), encoding='utf-8')
print(f'Saved {len(products)} products to {OUT}')
