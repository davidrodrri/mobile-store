import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import type { ProductListItem } from '@/types/product';

const CardLink = styled(Link)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px;
    gap: 24px;
    isolation: isolate;

    width: 344px;
    height: 344px;
    aspect-ratio: 1 / 1;

    border: 0.5px solid lightgray;
    background: #fff;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    transition: color 1s ease;
    color: inherit;
    text-decoration: none;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: black;
        transform: scaleY(0);
        transform-origin: bottom;
        transition: transform 1s ease;
        z-index: 0;
    }

    & > * {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
    }

    &:hover {
        color: white;
        cursor: pointer;
    }

    &:hover::before {
        transform: scaleY(1);
    }

    @media (max-width: 1080px) {
        width: 350px;
        height: 350px;
    }

    @media (max-width: 736px) {
        width: min(350px, 100%);
        height: auto;
    }
`;

const ImageFrame = styled.div`
    margin: 0 auto;
    width: 100%;
    max-width: 312px;
    height: 257px;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: stretch;
    flex: none;

    @media (max-width: 1080px) {
        max-width: 318px;
    }

    @media (max-width: 736px) {
        max-width: min(318px, 100%);
        height: 240px;
    }
`;

const ProductImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    display: block;
`;

const CardArticle = styled.article`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    width: 100%;
    height: 100%;

    @media (max-width: 736px) {
        gap: 16px;
    }
`;

const InfoRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    padding: 0px;
    gap: 8px;
    width: 100%;
    max-width: 312px;
    height: 31px;
    align-self: stretch;
    flex: none;
    z-index: 2;

    @media (max-width: 1080px) {
        max-width: 318px;
    }

    @media (max-width: 736px) {
        max-width: min(318px, 100%);
    }
`;

const MetaColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
`;

const Brand = styled.div`
    font-size: 10px;
    opacity: 0.5;
    text-transform: uppercase;
`;

const Name = styled.div`
    font-size: 12px;
    text-transform: uppercase;
`;

const Price = styled.div`
    font-size: 12px;
    white-space: nowrap;
`;

type Props = {
    product: ProductListItem;
};

export function ProductCard({ product }: Props) {
    const imageSrc = product.imageUrl;

    return (
        <CardLink
            href={`/product/${encodeURIComponent(product.id)}`}
            aria-label={`Ver detalle de ${product.brand} ${product.name}`}
        >
            <CardArticle aria-label={`${product.brand} ${product.name}`}>
                <ImageFrame>
                    <ProductImage
                        src={imageSrc}
                        alt={`${product.brand} ${product.name}`}
                        loading="lazy"
                        decoding="async"
                    />
                </ImageFrame>

                <InfoRow>
                    <MetaColumn>
                        <Brand>{product.brand}</Brand>
                        <Name>{product.name}</Name>
                    </MetaColumn>
                    <Price>
                        {new Intl.NumberFormat('es-ES', {
                            style: 'currency',
                            currency: 'EUR',
                            currencyDisplay: 'code',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        }).format(product.basePrice)}
                    </Price>
                </InfoRow>
            </CardArticle>
        </CardLink>
    );
}
