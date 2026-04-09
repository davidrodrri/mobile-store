import { NextResponse } from 'next/server';

import type { ProductListItem } from '@/types/product';
import { backendFetchProductsList } from '@/api/backendProducts';

function getRequiredEnv(name: string): string | null {
    const value = process.env[name];
    return value && value.trim() !== '' ? value : null;
}

export async function GET(req: Request) {
    const apiBaseUrl = getRequiredEnv('API_BASE_URL');
    const apiKey =
        getRequiredEnv('API_KEY') ?? '87909682e6cd74208f41a6ef39fe4191';

    if (!apiBaseUrl) {
        return NextResponse.json(
            { error: 'Missing API_BASE_URL' },
            { status: 500 },
        );
    }

    const url = new URL(req.url);
    const search =
        url.searchParams.get('search') ??
        url.searchParams.get('q') ??
        url.searchParams.get('query') ??
        '';

    const limit = url.searchParams.get('limit');
    const offset = url.searchParams.get('offset');

    try {
        const list = await backendFetchProductsList(
            { baseUrl: apiBaseUrl, apiKey },
            { search, limit, offset },
            { cache: 'no-store' },
        );

        return NextResponse.json(list satisfies ProductListItem[]);
    } catch (err) {
        const status =
            typeof (err as { status?: unknown } | null)?.status === 'number'
                ? ((err as { status?: number }).status ?? 500)
                : null;

        if (status) {
            return NextResponse.json({ error: 'Upstream error' }, { status });
        }

        if (
            err instanceof Error &&
            err.message.includes('Unexpected products response shape')
        ) {
            return NextResponse.json(
                { error: 'Unexpected upstream response shape' },
                { status: 502 },
            );
        }

        return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
    }
}
