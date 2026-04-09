'use client';

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import type { ProductListItem } from '@/types/product';

import { ProductCard } from '@/components/products/ProductCard';
import { nextApiFetchProductsList } from '@/api/nextProducts';

const Page = styled.section`
    width: 100%;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
`;

const PageInner = styled.div`
    width: 100%;
    max-width: 1920px;
    box-sizing: border-box;
    padding: 48px 100px 0px;

    @media (max-width: 1080px) {
        padding: 48px 34px 0px;
    }

    @media (max-width: 736px) {
        padding: 48px 24px 0px;
    }
`;

const Content = styled.section`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 48px;
`;

const SearchRow = styled.form`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    margin: 0;

    @media (max-width: 1080px) {
        max-width: calc(350px * 2);
        margin-left: auto;
        margin-right: auto;
    }

    @media (max-width: 736px) {
        max-width: 350px;
        margin-left: auto;
        margin-right: auto;
    }
`;

const SearchInput = styled.input`
    width: 100%;
    max-width: 100%;
    padding: 10px 0;
    border: none;
    border-bottom: 1px solid lightgray;
    border-radius: 0;
    outline: none;
    font-size: 14px;
    background: transparent;
    color: black;
    box-sizing: border-box;

    &:focus {
        border-bottom-color: black;
    }

    &::placeholder {
        font-size: 16px;
        font-weight: 300;
        opacity: 0.5;
    }
`;

const ResultsCount = styled.div`
    font-size: 12px;
    font-weight: 300;
    opacity: 0.5;
`;

const Grid = styled.section`
    display: grid;
    grid-template-columns: repeat(5, 344px);
    margin-top: 16px;
    gap: 0;
    justify-content: flex-start;

    @media (max-width: 1768px) {
        grid-template-columns: repeat(4, 344px);
    }

    @media (max-width: 1424px) {
        grid-template-columns: repeat(3, 344px);
    }

    @media (max-width: 1080px) {
        grid-template-columns: repeat(2, 350px);
        justify-content: center;
    }

    @media (max-width: 736px) {
        grid-template-columns: minmax(0, 350px);
        justify-content: center;
    }
`;

const Empty = styled.p`
    margin-top: 16px;
    opacity: 0.7;
`;

type Props = {
    initialProducts: ProductListItem[];
    initialError?: string | null;
    initialQuery?: string | null;
};

export function Landing({
    initialProducts,
    initialError = null,
    initialQuery = null,
}: Props) {
    const [query, setQuery] = useState(() => initialQuery?.trim() ?? '');
    const [products, setProducts] = useState<ProductListItem[]>(
        initialProducts ?? [],
    );
    const [error, setError] = useState<string | null>(initialError);
    const [loading, setLoading] = useState(false);

    const lastRequestIdRef = useRef(0);
    const skipFirstFetchRef = useRef(true);

    useEffect(() => {
        setProducts(initialProducts ?? []);
    }, [initialProducts]);

    useEffect(() => {
        const q = query.trim();

        if (skipFirstFetchRef.current) {
            skipFirstFetchRef.current = false;
            return;
        }

        if (q.length === 0) {
            setLoading(false);
            setError(initialError);
            setProducts(initialProducts ?? []);
            return;
        }

        const requestId = ++lastRequestIdRef.current;
        const handle = window.setTimeout(async () => {
            setLoading(true);

            try {
                const list = await nextApiFetchProductsList({ search: q });

                if (requestId !== lastRequestIdRef.current) return;
                setError(null);
                setProducts(list);
            } catch {
                if (requestId !== lastRequestIdRef.current) return;
                setError('No se pudieron cargar los productos.');
                setProducts([]);
            } finally {
                if (requestId !== lastRequestIdRef.current) return;
                setLoading(false);
            }
        }, 250);

        return () => window.clearTimeout(handle);
    }, [query, initialError, initialProducts]);

    return (
        <Page aria-label="Inicio">
            <PageInner>
                <Content aria-label="Contenido">
                    <SearchRow
                        role="search"
                        aria-label="Búsqueda"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <SearchInput
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscar un smartphone..."
                            aria-label="Buscar productos"
                        />
                        <ResultsCount aria-live="polite">
                            {loading ? '...' : `${products.length} RESULTS`}
                        </ResultsCount>
                    </SearchRow>

                    {error ? <p role="alert">{error}</p> : null}

                    <Grid aria-label="Listado de teléfonos">
                        {products.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </Grid>

                    {!error && !loading && products.length === 0 ? (
                        <Empty>No se encontraron resultados.</Empty>
                    ) : null}
                </Content>
            </PageInner>
        </Page>
    );
}
