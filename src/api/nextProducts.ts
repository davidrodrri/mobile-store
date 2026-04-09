import type { ProductListItem } from '@/types/product';

export type NextProductsParams = {
    search?: string | null;
    limit?: number | null;
    offset?: number | null;
};

function parseProductsList(data: unknown): ProductListItem[] {
    const list = Array.isArray(data)
        ? data
        : (data as { list?: unknown } | null)?.list;

    if (!Array.isArray(list)) {
        throw new Error('Unexpected products response shape');
    }

    return list as ProductListItem[];
}

export async function nextApiFetchProductsList(
    params: NextProductsParams,
    init?: RequestInit,
): Promise<ProductListItem[]> {
    const qs = new URLSearchParams();
    const search = params.search?.trim() ?? '';
    if (search !== '') qs.set('search', search);
    if (params.limit != null) qs.set('limit', String(params.limit));
    if (params.offset != null) qs.set('offset', String(params.offset));

    const res = await fetch(`/api/products?${qs.toString()}`, {
        cache: 'no-store',
        ...init,
    });

    if (!res.ok) throw new Error('Failed to fetch products');

    const data: unknown = await res.json();
    return parseProductsList(data);
}
