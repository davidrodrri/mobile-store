'use client';

import React from 'react';
import styled from 'styled-components';

import type { ProductEntity } from '@/types/product';

import { BackButton } from '@/components/navigation/BackButton';
import { ProductDetailMain } from './ProductDetailMain';
import { ProductSpecs } from './components/ProductSpecs';
import { SimilarItemsCarousel } from './components/SimilarItemsCarousel';

const Page = styled.section`
    width: 100%;
    background: #ffffff;
`;

const BackBar = styled.div`
    width: 100%;
    height: 44px;
    display: flex;
    justify-content: center;
    background: #ffffff;
`;

const BackBarInner = styled.div`
    width: 100%;
    max-width: 1920px;
    height: 44px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 12px 100px;
    gap: 4px;
    box-sizing: border-box;

    @media (max-width: 1080px) {
        padding: 12px 34px;
    }

    @media (max-width: 736px) {
        padding: 12px 24px;
    }
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    gap: 150px;
    margin: 0 auto;
    width: min(1200px, 92%);
    box-sizing: border-box;

    @media (max-width: 1024px) {
        width: min(1200px, 92%);
    }

    @media (max-width: 520px) {
        width: 92%;
    }
`;

const ContentSection = styled.section`
    padding: 12px 20px;
`;

type Props = {
    product: ProductEntity;
};

export function ProductDetail({ product }: Props) {
    return (
        <Page aria-label="Detalle de producto">
            <BackBar>
                <BackBarInner>
                    <BackButton />
                </BackBarInner>
            </BackBar>

            <ContentSection>
                <Content>
                    <ProductDetailMain product={product} />
                    <ProductSpecs product={product} />
                    <SimilarItemsCarousel
                        products={product.similarProducts ?? []}
                    />
                </Content>
            </ContentSection>
        </Page>
    );
}
