import {
    addToCart,
    buildCartItemKey,
    getCartCount,
    readCart,
    removeFromCart,
    writeCart,
} from './cart';

function sampleItem(overrides?: Partial<Parameters<typeof addToCart>[0]>) {
    return {
        productId: 'p1',
        brand: 'Brand',
        name: 'Phone',
        imageUrl: '/img.png',
        unitPrice: 999,
        color: { name: 'Black', hexCode: '#000000' },
        storage: { capacity: '128GB', price: 0 },
        ...overrides,
    };
}

describe('src/lib/cart', () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    describe('buildCartItemKey', () => {
        it('builds a stable key and trims parts', () => {
            expect(
                buildCartItemKey({
                    productId: 'abc',
                    colorName: '  Black ',
                    storageCapacity: ' 128GB ',
                }),
            ).toBe('abc|Black|128GB');
        });

        it('handles null/undefined values', () => {
            expect(
                buildCartItemKey({
                    productId: 'abc',
                    colorName: null,
                    storageCapacity: undefined,
                }),
            ).toBe('abc||');
        });
    });

    describe('readCart', () => {
        it('returns [] for missing storage key', () => {
            expect(readCart()).toEqual([]);
        });

        it('returns [] for invalid JSON', () => {
            window.localStorage.setItem('cart', '{not json');
            expect(readCart()).toEqual([]);
        });

        it('returns [] for non-array JSON', () => {
            window.localStorage.setItem('cart', JSON.stringify({ a: 1 }));
            expect(readCart()).toEqual([]);
        });
    });

    describe('writeCart', () => {
        it('persists items and emits cartchange', () => {
            const onChange = jest.fn();
            window.addEventListener('cartchange', onChange);

            const items = [
                { ...sampleItem(), key: 'p1|Black|128GB', quantity: 2 },
            ];
            writeCart(items);

            expect(readCart()).toEqual(items);
            expect(onChange).toHaveBeenCalledTimes(1);
        });
    });

    describe('getCartCount', () => {
        it('counts quantities and treats invalid/non-positive quantity as 1', () => {
            const items = [
                { ...sampleItem(), key: 'k1', quantity: 2 },
                { ...sampleItem({ productId: 'p2' }), key: 'k2', quantity: 0 },
                {
                    ...sampleItem({ productId: 'p3' }),
                    key: 'k3',
                    quantity: -5,
                },
                {
                    ...sampleItem({ productId: 'p4' }),
                    key: 'k4',
                    quantity: Number.NaN,
                },
            ];
            expect(getCartCount(items)).toBe(2 + 1 + 1 + 1);
        });
    });

    describe('addToCart', () => {
        it('adds a new item with default quantity 1', () => {
            const next = addToCart(sampleItem({ quantity: undefined }));
            expect(next).toHaveLength(1);
            expect(next[0].quantity).toBe(1);
            expect(next[0].key).toBe('p1|Black|128GB');
        });

        it('merges with existing item when key matches (increments quantity)', () => {
            addToCart(sampleItem({ quantity: 2 }));
            const next = addToCart(sampleItem({ quantity: 3 }));

            expect(next).toHaveLength(1);
            expect(next[0].quantity).toBe(5);
        });

        it('treats non-finite or non-positive quantities as 1', () => {
            const next = addToCart(sampleItem({ quantity: 0 }));
            expect(next[0].quantity).toBe(1);
        });
    });

    describe('removeFromCart', () => {
        it('removes an item by key', () => {
            addToCart(sampleItem({ quantity: 1 }));
            const afterRemove = removeFromCart('p1|Black|128GB');
            expect(afterRemove).toEqual([]);
        });
    });
});
