import type { ProductEntity, ProductListItem } from '@/types/product';

export type BackendClientConfig = {
    baseUrl: string;
    apiKey: string;
};

export type BackendProductsParams = {
    search?: string | null;
    limit?: string | number | null;
    offset?: string | number | null;
};

type NextFetchOptions = {
    next?: { revalidate?: number };
};

function dedupeById(list: ProductListItem[]): ProductListItem[] {
    return Array.from(new Map(list.map((p) => [p.id, p])).values());
}

function parseProductsList(data: unknown): ProductListItem[] {
    const list = Array.isArray(data)
        ? data
        : (data as { list?: unknown } | null)?.list;

    if (!Array.isArray(list)) {
        throw new Error('Unexpected products response shape');
    }

    return list as ProductListItem[];
}

export async function backendFetchProductsList(
    config: BackendClientConfig,
    params: BackendProductsParams,
    init?: (RequestInit & NextFetchOptions) | undefined,
): Promise<ProductListItem[]> {
    const upstreamUrl = new URL('products', config.baseUrl);

    const search = params.search?.trim() ?? '';
    if (search !== '') upstreamUrl.searchParams.set('search', search);

    if (params.limit != null) {
        upstreamUrl.searchParams.set('limit', String(params.limit));
    }
    if (params.offset != null) {
        upstreamUrl.searchParams.set('offset', String(params.offset));
    }

    const res = await fetch(upstreamUrl, {
        ...init,
        headers: {
            'x-api-key': config.apiKey,
            ...(init?.headers ?? {}),
        },
    });

    if (!res.ok) {
        const err = new Error(`Upstream error (${res.status})`);
        (err as { status?: number }).status = res.status;
        throw err;
    }

    const data: unknown = await res.json();
    return dedupeById(parseProductsList(data));
}

export async function backendFetchProductById(
    config: BackendClientConfig,
    id: string,
    init?: (RequestInit & NextFetchOptions) | undefined,
): Promise<ProductEntity | null> {
    const upstreamUrl = new URL(
        `products/${encodeURIComponent(id)}`,
        config.baseUrl,
    );

    const res = await fetch(upstreamUrl, {
        ...init,
        headers: {
            'x-api-key': config.apiKey,
            ...(init?.headers ?? {}),
        },
    });

    if (res.status === 404) return null;

    if (!res.ok) {
        const err = new Error(`Upstream error (${res.status})`);
        (err as { status?: number }).status = res.status;
        throw err;
    }

    return (await res.json()) as ProductEntity;
}
