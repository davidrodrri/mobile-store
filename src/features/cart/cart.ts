export type CartItem = {
    key: string;
    productId: string;
    brand: string;
    name: string;
    imageUrl: string;
    color?: { name: string; hexCode?: string };
    storage?: { capacity: string; price?: number };
    unitPrice: number;
    quantity: number;
};

const STORAGE_KEY = 'cart';

function emitCartChange() {
    window.dispatchEvent(new Event('cartchange'));
}

function safeParseCart(raw: string | null): CartItem[] {
    if (!raw) return [];
    try {
        const parsed: unknown = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
    } catch {
        return [];
    }
}

export function buildCartItemKey(input: {
    productId: string;
    colorName?: string | null;
    storageCapacity?: string | null;
}): string {
    const c = (input.colorName ?? '').trim();
    const s = (input.storageCapacity ?? '').trim();
    return [input.productId, c, s].join('|');
}

export function readCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    return safeParseCart(window.localStorage.getItem(STORAGE_KEY));
}

export function writeCart(items: CartItem[]) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    emitCartChange();
}

export function getCartCount(items?: CartItem[]): number {
    const list = items ?? readCart();
    return list.reduce(
        (acc, it) =>
            acc +
            (typeof it.quantity === 'number' && it.quantity > 0
                ? it.quantity
                : 1),
        0,
    );
}

export function addToCart(
    input: Omit<CartItem, 'key' | 'quantity'> & {
        colorName?: string | null;
        storageCapacity?: string | null;
        quantity?: number;
    },
): CartItem[] {
    const nextQty =
        typeof input.quantity === 'number' &&
        Number.isFinite(input.quantity) &&
        input.quantity > 0
            ? input.quantity
            : 1;

    const key = buildCartItemKey({
        productId: input.productId,
        colorName: input.color?.name ?? input.colorName ?? null,
        storageCapacity:
            input.storage?.capacity ?? input.storageCapacity ?? null,
    });

    const current = readCart();
    const idx = current.findIndex((x) => x.key === key);

    if (idx >= 0) {
        const existing = current[idx];
        const merged: CartItem = {
            ...existing,
            ...input,
            key,
            quantity: (existing.quantity ?? 1) + nextQty,
        };
        const next = current.slice();
        next[idx] = merged;
        writeCart(next);
        return next;
    }

    const next: CartItem[] = [
        ...current,
        {
            ...input,
            key,
            quantity: nextQty,
        },
    ];
    writeCart(next);
    return next;
}

export function removeFromCart(key: string): CartItem[] {
    const current = readCart();
    const next = current.filter((x) => x.key !== key);
    writeCart(next);
    return next;
}
