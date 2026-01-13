# Деплой на GitHub Pages

## Если GitHub Actions требует биллинг:

GitHub Actions иногда требует подтверждённый биллинг, даже для бесплатных функций.

### Решение 1: Подтвердить биллинг (рекомендуется)

1. Перейдите в Settings репозитория
2. Откройте Billing
3. Подтвердите бесплатный план (не требует карты, но требует подтверждения)

### Решение 2: Ручной деплой через gh-pages ветку

Если Actions всё равно не работают, используйте ручной деплой:

```bash
cd web-app
npm install
npm run build

# Установите gh-pages если ещё нет
npm install -g gh-pages

# Деплой
cd dist
git init
git add .
git commit -m "Deploy to GitHub Pages"
git branch -M gh-pages
git remote add origin https://github.com/lonestill/novashell.git
git push -f origin gh-pages
```

Затем в Settings > Pages выберите ветку `gh-pages` и папку `/ (root)`

### Решение 3: Использовать другой workflow

Текущий workflow использует `peaceiris/actions-gh-pages@v3` который не требует расширенных прав.
