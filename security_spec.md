# Security Specification — Yasmin Lights & Home Decor

## 1. Data Invariants
1. **Catalog Integrity**: Only verified store Admins may create, edit, or delete products in `/products/{productId}`. Verified signed-in shoppers may only decrement `stock` during order checkout (`affectedKeys().hasOnly(['stock', 'updatedAt'])` where `0 <= incoming.stock < existing.stock`).
2. **Shop Settings Isolation**: `/settings/shop` is publicly readable (`get` only) for storefront display, and writable exclusively by verified store Admins.
3. **Order PII Isolation**: `/orders/{orderId}` contains customer PII (`customerName`, `phone`, `address`, `city`, `pincode`). Only the creating owner (`customerId == request.auth.uid`) or a verified Admin may read (`get` or `list`) an order.
4. **Order Immutability & Terminal Locking**: On create, `customerId` must match `request.auth.uid`, `status` must be `'Pending'`, `paymentMethod` must be `'COD'`, and `createdAt == request.time`. Only verified Admins may update `status` (`customerId` and `createdAt` remain immutable), and non-admins cannot update or delete orders.
5. **Admin Privilege Protection**: Clients can never self-assign admin status in `/admins/{userId}`. Admin status is bootstrapped for the verified owner email (`saakib4571046@gmail.com`) or existing `/admins/{uid}` documents.

## 2. Adversarial "Dirty Dozen" Payloads (Expected: `PERMISSION_DENIED`)
1. Unauthenticated write to `/products/prod-1` with price `1`.
2. Verified non-admin user attempts to change `price` on `/products/prod-1`.
3. Verified non-admin user attempts to increase `stock` on `/products/prod-1`.
4. Shadow field injection: Admin creates product with extra key `isAdminOverride: true`.
5. Oversized string DoW payload: `customerName` of 5,000 characters in `/orders/YL-9999`.
6. Identity spoofing: User A creates `/orders/YL-9999` with `customerId: "user-B"`.
7. State shortcutting: Customer creates `/orders/YL-9999` with `status: "Delivered"`.
8. Timestamp forgery: Customer creates `/orders/YL-9999` with `createdAt: "2020-01-01T00:00:00Z"` instead of server time.
9. PII blanket read: User A attempts `get` or `list` on `/orders` belonging to User B.
10. Unverified email spoofing: Token has `email: "saakib4571046@gmail.com"` but `email_verified: false`.
11. Self-privilege escalation: User A attempts to write `/admins/{userA_uid}`.
12. Document ID poisoning: Creating `/products/bad$id/with/slashes` or >128 char ID.
