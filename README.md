# lomi. — Magento 2 payments (hosted checkout)

Magento 2 extension for **lomi.** hosted checkout using the Lomi API **checkout sessions** (`POST /checkout-sessions`, `GET /checkout-sessions/{id}`).

**Package:** `lomi/magento2-payments`  
**Module:** `Lomi_Payments`  
**Payment method code:** `lomi`

## Requirements

- Magento 2.4.x (PHP 7.4+ / 8.x, as supported by your Magento version)
- A lomi. account and API keys from [dashboard.lomi.africa](https://dashboard.lomi.africa)

## Installation (Composer)

```bash
composer require lomi/magento2-payments
php bin/magento module:enable Lomi_Payments
php bin/magento setup:upgrade
php bin/magento setup:di:compile
php bin/magento cache:flush
```

## Manual installation

Copy this package under `app/code/Lomi/Payments/` (PSR-4 root = package root), then:

```bash
php bin/magento module:enable Lomi_Payments
php bin/magento setup:upgrade
php bin/magento setup:di:compile
php bin/magento cache:flush
```

## Configuration

**Stores → Configuration → Sales → Payment Methods → lomi.**

- Enable the method and set **Test mode** as needed.
- **Test/Live API secret keys** and **webhook signing secrets** from the lomi. dashboard.
- **Webhook URL** (shown in admin): `https://your-store.example/lomi/payment/webhook`

## Customer flow

1. Customer chooses **lomi.** at checkout and places the order.
2. Magento creates a checkout session and redirects to lomi. hosted checkout.
3. Return URL: `lomi/payment/callback` (with order verification).
4. Webhook: `PAYMENT_SUCCEEDED` with `X-Lomi-Signature` / `X-Lomi-Event` headers. If webhook payload metadata omits `magento_increment_id`, the extension resolves the order by stored `lomi_checkout_session_id` when `checkout_session_id` is present.

## Upgrade from legacy module identifiers

If you previously used another vendor prefix, run `setup:upgrade` so the data patch can migrate stored config and payment method codes where applicable.

## REST (optional)

`GET /rest/V1/lomi/verify/:checkoutSessionId` — verifies the checkout session for the **browser checkout session’s last real order** (path segment must match `lomi_checkout_session_id` on that order). Defined in [`etc/webapi.xml`](etc/webapi.xml).

## Development

See [`dev/`](dev/) for Docker-based local setup (`dev/README` or compose files).

## License

MIT — see [LICENSE](LICENSE).
