# PicLinker V1

تصویر اپ لوڈ کریں اور اس کا مستقل (permanent) لنک حاصل کریں۔

## فائلیں
- `index.html` — صفحہ کا ڈھانچہ
- `styles.css` — ڈیزائن
- `app.js` — اپ لوڈ، لنک، کاپی اور ہسٹری کا کوڈ
- `README.md` — یہ فائل

## خصوصیات
1. Drag & Drop یا فائل منتخب کر کے اپ لوڈ
2. اپ لوڈ سے پہلے تصویر کا Preview
3. Cloudinary پر مفت Cloud Storage میں محفوظ
4. Direct URL بنانا
5. Copy URL اور Download بٹن
6. Upload History (براؤزر میں محفوظ)
7. موبائل دوست ڈیزائن

## سیٹ اپ (ایک بار)
1. https://cloudinary.com پر مفت اکاؤنٹ بنائیں۔
2. Dashboard سے **Cloud name** نوٹ کریں۔
3. Settings → Upload → Upload presets → **Add upload preset** کریں اور Signing Mode کو **Unsigned** رکھیں۔ preset کا نام نوٹ کریں۔
4. `app.js` کھولیں اور یہ دو لائنیں تبدیل کریں:
   ```js
   CLOUD_NAME: "آپ کا cloud name",
   UPLOAD_PRESET: "آپ کا preset نام",
   ```

## چلانے کا طریقہ
1. ZIP کھول کر فولڈر نکالیں۔
2. `index.html` کو براؤزر میں کھولیں۔
3. تصویر منتخب کریں، لنک کاپی کریں۔

## GitHub Pages پر لائیو کرنا
1. GitHub پر نیا public repository بنائیں (مثلاً `piclinker`)۔
2. ان چاروں فائلوں کو repository میں upload کریں۔
3. Settings → Pages → Source: `Deploy from a branch`، branch: `main`، folder: `/ (root)`۔
4. چند منٹ بعد سائٹ کا لنک `https://<username>.github.io/piclinker/` پر کھل جائے گا۔

## نوٹ
- زیادہ سے زیادہ فائل سائز: 3 MB
- سپورٹڈ فارمیٹ: JPEG, PNG, GIF, WEBP, BMP
- ہسٹری صرف اسی براؤزر میں محفوظ ہوتی ہے۔
