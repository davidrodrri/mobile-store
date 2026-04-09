'use client';

import React from 'react';
import styled from 'styled-components';

import type { ProductEntity } from '@/types/product';

import { Button } from '@/components/ui/Button';
import { addToCart } from '@/lib/cart';
import { ColorSwatches } from './components/ColorSwatches';
import { StorageOptions } from './components/StorageOptions';

const MobileDetails = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 64px;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;

    @media (max-width: 1024px) {
        align-items: center;
        justify-content: space-between;
        gap: 32px;
    }

    @media (max-width: 736px) {
        flex-direction: column;
        align-items: center;
        gap: 40px;
    }
`;

const ImageFrame = styled.div`
    width: min(510px, 100%);
    aspect-ratio: 510 / 630;
    flex: 0 1 auto;
    order: 0;
    flex-grow: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    @media (max-width: 1024px) {
        width: min(420px, 52%);
    }

    @media (max-width: 736px) {
        width: min(510px, 100%);
    }
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
`;

const Details = styled.div`
    width: 380px;
    height: 459px;
    flex: 0 1 auto;
    order: 1;
    flex-grow: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 64px;
    margin-top: 0;
    margin-bottom: 0;
    padding: 0;
    box-sizing: border-box;

    @media (max-width: 1024px) {
        width: min(380px, 44%);
        height: auto;
        gap: 40px;
        justify-content: flex-start;
    }

    @media (max-width: 736px) {
        width: min(380px, 100%);
        justify-content: center;
    }
`;

const DetailsTitle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 10px;
    box-sizing: border-box;
    text-align: left;
    width: 100%;
`;

const ProductName = styled.span`
    font-size: 24px;
    font-weight: 300;
    text-transform: uppercase;

    @media (max-width: 1024px) {
        font-size: 20px;
    }
`;

const ProductPrice = styled.span`
    font-size: 20px;
    font-weight: 300;
    text-transform: uppercase;

    @media (max-width: 1024px) {
        font-size: 14px;
    }
`;

const Options = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    box-sizing: border-box;
    width: 100%;
`;

const Actions = styled.div`
    display: flex;
    justify-content: flex-start;
    box-sizing: border-box;
    width: 100%;
`;

type Props = {
    product: ProductEntity;
};

export function ProductDetailMain({ product }: Props) {
    const [selectedColorName, setSelectedColorName] = React.useState<
        string | null
    >(null);
    const [selectedStorageCapacity, setSelectedStorageCapacity] =
        React.useState<string | null>(null);

    const selectedColorOption =
        product.colorOptions.find((c) => c.name === selectedColorName) ?? null;
    const selectedStorageOption =
        product.storageOptions.find(
            (s) => s.capacity === selectedStorageCapacity,
        ) ?? null;

    const canAddToCart =
        Boolean(selectedColorOption) && Boolean(selectedStorageOption);

    const mainImage =
        selectedColorOption?.imageUrl ??
        product.colorOptions?.[0]?.imageUrl ??
        '/mbst.svg';
    const displayedPrice = selectedStorageOption?.price ?? product.basePrice;

    function handleAddToCart() {
        if (!selectedColorOption || !selectedStorageOption) return;

        addToCart({
            productId: product.id,
            brand: product.brand,
            name: product.name,
            imageUrl: mainImage,
            color: {
                name: selectedColorOption.name,
                hexCode: selectedColorOption.hexCode,
            },
            storage: {
                capacity: selectedStorageOption.capacity,
                price: selectedStorageOption.price,
            },
            unitPrice: selectedStorageOption.price,
            quantity: 1,
        });
    }

    return (
        <MobileDetails>
            <ImageFrame>
                <Image
                    src={mainImage}
                    alt={`${product.brand} ${product.name}`}
                />
            </ImageFrame>

            <Details>
                <DetailsTitle>
                    <ProductName>{product.name}</ProductName>
                    <ProductPrice>From {displayedPrice} EUR</ProductPrice>
                </DetailsTitle>
                <Options>
                    <StorageOptions
                        label="Storage ¿how much space do you need?"
                        options={product.storageOptions}
                        value={selectedStorageCapacity}
                        onChange={setSelectedStorageCapacity}
                    />
                    <ColorSwatches
                        label="Color. Pick your favorite"
                        colors={product.colorOptions}
                        value={selectedColorName}
                        onChange={setSelectedColorName}
                    />
                </Options>
                <Actions>
                    <Button
                        width="100%"
                        padding="14px 18px"
                        disabled={!canAddToCart}
                        onClick={handleAddToCart}
                    >
                        AÑADIR
                    </Button>
                </Actions>
            </Details>
        </MobileDetails>
    );
}
