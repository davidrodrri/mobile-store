'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import styled from 'styled-components';
import { getCartCount, readCart } from '@/lib/cart';

const Header = styled.header`
    position: sticky;
    top: 0;
    z-index: 10;
    background: white;
    height: 80px;
    width: 100%;
    display: flex;
    justify-content: center;
`;

const HeaderInner = styled.div`
    width: 100%;
    max-width: 1920px;
    height: 80px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 24px 100px;
    gap: 20px;
    box-sizing: border-box;

    @media (max-width: 1080px) {
        padding: 24px 34px;
    }

    @media (max-width: 736px) {
        padding: 24px 24px;
    }
`;

const LogoLink = styled(Link)`
    display: inline-flex;
    align-items: center;
`;

const Logo = styled.img`
    width: 70px;
    height: auto;
    display: block;
`;

const CartButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border: none;
    background: transparent;
    color: black;
    cursor: pointer;
`;

const CartIcon = styled.img`
    width: 22px;
    height: 22px;
    display: block;
`;

const CartCount = styled.span`
    font-size: 12px;
    color: black;
`;

function readCartCount(): number {
    try {
        return getCartCount(readCart());
    } catch {
        return 0;
    }
}

export function AppHeader() {
    const router = useRouter();
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        function sync() {
            setCartCount(readCartCount());
        }

        sync();
        window.addEventListener('storage', sync);
        window.addEventListener('cartchange', sync as EventListener);
        return () => {
            window.removeEventListener('storage', sync);
            window.removeEventListener('cartchange', sync as EventListener);
        };
    }, []);

    return (
        <Header>
            <HeaderInner>
                <LogoLink href="/" aria-label="Ir a inicio">
                    <Logo src="/mbst.svg" alt="Logo" />
                </LogoLink>

                <CartButton
                    type="button"
                    aria-label="Carrito"
                    onClick={() => router.push('/cart')}
                >
                    <CartIcon src="/CartBag.svg" alt="" aria-hidden="true" />
                    <CartCount>{cartCount}</CartCount>
                </CartButton>
            </HeaderInner>
        </Header>
    );
}
