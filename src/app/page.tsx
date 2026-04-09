import { Landing } from '@/features/landing/Landing';

import { backendFetchProductsList } from '@/api/backendProducts';

const HOME_PRODUCTS_REVALIDATE_SECONDS = 60;

function getRequiredEnv(name: string): string | null {
    const value = process.env[name];
    return value && value.trim() !== '' ? value : null;
}

type SearchParams = Record<string, string | string[] | undefined>;

function getFirstString(value: SearchParams[string]): string | null {
    if (typeof value === 'string') return value;
    if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
    return null;
}

function getSearchQuery(searchParams: SearchParams): string {
    return (
        getFirstString(searchParams.search) ??
        getFirstString(searchParams.q) ??
        getFirstString(searchParams.query) ??
        ''
    ).trim();
}

export default async function HomePage({
    searchParams,
}: {
    searchParams?: Promise<SearchParams> | SearchParams;
}) {
    const sp = (await Promise.resolve(searchParams)) ?? {};
    const initialQuery = getSearchQuery(sp);

    const apiBaseUrl = getRequiredEnv('API_BASE_URL');
    const apiKey =
        getRequiredEnv('API_KEY') ?? '87909682e6cd74208f41a6ef39fe4191';

    if (!apiBaseUrl) {
        return (
            <Landing
                initialProducts={[]}
                initialError="Falta API_BASE_URL (configura el backend en .env)"
                initialQuery={initialQuery}
            />
        );
    }

    try {
        // Pedimos más de 20 para compensar posibles duplicados
        const list = await backendFetchProductsList(
            { baseUrl: apiBaseUrl, apiKey },
            { search: initialQuery, limit: 30, offset: 0 },
            { next: { revalidate: HOME_PRODUCTS_REVALIDATE_SECONDS } },
        );

        return (
            <Landing
                initialProducts={list.slice(0, 20)}
                initialQuery={initialQuery}
            />
        );
    } catch {
        return (
            <Landing
                initialProducts={[]}
                initialError="No se pudieron cargar los productos."
                initialQuery={initialQuery}
            />
        );
    }
}
