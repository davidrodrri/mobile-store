'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

import { Button } from '@/components/ui/Button';
import {
    getCartCount,
    readCart,
    removeFromCart,
    type CartItem,
} from '@/lib/cart';

const Page = styled.section`
    width: 100%;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
`;

const PageInner = styled.div`
    width: 100%;
    max-width: 1920px;
    display: grid;
    min-height: calc(100dvh - 80px);
    grid-template-rows: auto 1fr auto;
    padding-top: 48px;
    box-sizing: border-box;
`;

const Header = styled.header`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 12px 100px;
    gap: 12px;
    height: 53px;
    box-sizing: border-box;

    @media (max-width: 1080px) {
        padding: 12px 34px;
    }

    @media (max-width: 736px) {
        padding: 12px 24px;
    }
`;

const Title = styled.div`
    display: inline-flex;
    align-items: baseline;
    gap: 8px;
    letter-spacing: 0.06em;
`;

const TitleText = styled.span`
    font-size: 24px;
    font-weight: 300;

    @media (max-width: 736px) {
        font-size: 20px;
    }
`;

const TitleCount = styled.span`
    font-size: 24px;
    font-weight: 300;

    @media (max-width: 736px) {
        font-size: 20px;
    }
`;

const Content = styled.div`
    min-height: 240px;
    padding: 0 100px;
    box-sizing: border-box;

    @media (max-width: 1080px) {
        padding: 0 34px;
    }

    @media (max-width: 736px) {
        padding: 0 24px;
    }
`;

const List = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, 548px);
    gap: 40px 72px;
    justify-content: flex-start;

    @media (max-width: 1080px) {
        grid-template-columns: 1fr;
        justify-items: start;
        gap: 40px;
    }
`;

const ListItem = styled.li`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0;
    gap: 40px;
    background: transparent;
    border: 0;
    box-sizing: border-box;
    width: 548px;
    height: 324px;

    @media (max-width: 1080px) {
        max-width: 100%;
    }

    @media (max-width: 736px) {
        width: 100%;
        height: auto;
        gap: 16px;
        align-items: flex-start;
    }
`;

const Thumb = styled.img`
    width: 262px;
    height: 324px;
    flex: 0 0 auto;
    object-fit: contain;
    border-radius: 0;
    background: transparent;

    @media (max-width: 736px) {
        width: 140px;
        height: auto;
        aspect-ratio: 262 / 324;
    }
`;

const ItemInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    padding: 70px 0px;
    width: 246px;
    height: 324px;
    box-sizing: border-box;

    @media (max-width: 736px) {
        width: auto;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        min-width: 0;
        height: auto;
        padding: 45px 0px;
        gap: 16px;
    }
`;

const MobileInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    height: 69px;
    gap: 10px;

    @media (max-width: 736px) {
        height: auto;
        justify-content: flex-start;
        gap: 8px;
    }
`;

const ItemTitle = styled.div`
    font-size: 12px;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.04em;

    @media (max-width: 736px) {
        font-size: 10px;
    }
`;

const ItemMeta = styled.div`
    font-size: 12px;
    font-weight: 400;
    color: #444;
    text-transform: uppercase;
    letter-spacing: 0.04em;

    @media (max-width: 736px) {
        font-size: 10px;
    }
`;

const ItemPrice = styled.div`
    font-size: 12px;
    font-weight: 400;
    color: #111;
    text-transform: uppercase;
    letter-spacing: 0.04em;

    @media (max-width: 736px) {
        font-size: 10px;
    }
`;

const RemoveButton = styled.button`
    align-self: flex-start;
    border: 0;
    background: transparent;
    color: #d11;
    padding: 0;
    cursor: pointer;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.04em;

    &:hover {
        text-decoration: underline;
    }

    @media (max-width: 736px) {
        margin-top: 8px;
        font-size: 10px;
    }
`;

const Actions = styled.footer`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 0 100px 20px;
    box-sizing: border-box;

    @media (max-width: 1080px) {
        padding: 0 34px 20px;
    }

    @media (max-width: 736px) {
        padding: 0 24px 20px;
    }

    @media (max-width: 520px) {
        flex-direction: column;
        align-items: stretch;
    }

    @media (max-width: 736px) {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto;
        grid-template-areas:
            'total total'
            'continue pay';
        align-items: center;
        gap: 16px;
    }

    @media (max-width: 736px) {
        & > button {
            width: 100%;
            min-width: 0 !important;
        }
    }
`;

const PayGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 60px;

    @media (max-width: 1080px) {
        display: contents;
    }
`;

const Total = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;

    @media (max-width: 520px) {
        align-items: flex-start;
    }

    @media (max-width: 736px) {
        width: 100%;
        justify-content: space-between;
        gap: 0;
        grid-area: total;
    }
`;

const TotalLabel = styled.span`
    font-size: 14px;
    font-weight: 400;

    @media (max-width: 736px) {
        font-size: 12px;
    }
`;

const TotalValue = styled.span`
    font-size: 14px;
    font-weight: 400;

    @media (max-width: 736px) {
        font-size: 12px;
    }
`;

const ContinueShoppingButton = styled(Button)`
    @media (max-width: 736px) {
        grid-area: continue;
        font-size: 10px;
    }
`;

const PayButton = styled(Button)`
    @media (max-width: 736px) {
        grid-area: pay;
        font-size: 10px;
    }
`;

function getItemQuantity(item: CartItem): number {
    return typeof item.quantity === 'number' &&
        Number.isFinite(item.quantity) &&
        item.quantity > 0
        ? item.quantity
        : 1;
}

function getItemPrice(item: CartItem): number {
    return typeof item.unitPrice === 'number' && Number.isFinite(item.unitPrice)
        ? item.unitPrice
        : 0;
}

function getItemTitle(item: CartItem): string {
    const title = `${item.brand ?? ''} ${item.name ?? ''}`.trim();
    return title.length > 0 ? title : 'Producto';
}

function formatEURPlain(value: number): string {
    const rounded =
        typeof value === 'number' && Number.isFinite(value)
            ? Math.round(value)
            : 0;
    return `${rounded} EUR`;
}

export function Cart() {
    const router = useRouter();
    const [items, setItems] = React.useState<CartItem[]>([]);

    React.useEffect(() => {
        function sync() {
            setItems(readCart());
        }

        sync();
        window.addEventListener('storage', sync);
        window.addEventListener('cartchange', sync as EventListener);
        return () => {
            window.removeEventListener('storage', sync);
            window.removeEventListener('cartchange', sync as EventListener);
        };
    }, []);

    const cartCount = getCartCount(items);
    const isEmpty = cartCount === 0;

    const total = items.reduce((acc, item) => {
        const price = getItemPrice(item);
        const qty = getItemQuantity(item);
        return acc + price * qty;
    }, 0);

    return (
        <Page aria-label="Carrito">
            <PageInner>
                <Header>
                    <Title>
                        <TitleText>CART</TitleText>
                        <TitleCount>({cartCount})</TitleCount>
                    </Title>
                </Header>

                <Content>
                    {isEmpty ? null : (
                        <List aria-label="Artículos del carrito">
                            {items.map((item, idx) => {
                                const title = getItemTitle(item);
                                const price = getItemPrice(item);
                                const color = item.color?.name;
                                const storage = item.storage?.capacity;
                                const specs = [storage, color]
                                    .filter(Boolean)
                                    .join(' | ')
                                    .toUpperCase();
                                return (
                                    <ListItem key={`${title}-${idx}`}>
                                        <Thumb
                                            src={item.imageUrl}
                                            alt={title}
                                        />
                                        <ItemInfo>
                                            <MobileInfo>
                                                <section>
                                                    <ItemTitle>
                                                        {title}
                                                    </ItemTitle>
                                                    {specs ? (
                                                        <ItemMeta>
                                                            {specs}
                                                        </ItemMeta>
                                                    ) : null}
                                                </section>
                                                <section>
                                                    <ItemPrice>
                                                        {formatEURPlain(price)}
                                                    </ItemPrice>
                                                </section>
                                            </MobileInfo>
                                            <RemoveButton
                                                type="button"
                                                onClick={() =>
                                                    setItems(
                                                        removeFromCart(
                                                            item.key,
                                                        ),
                                                    )
                                                }
                                                aria-label={`Eliminar ${title} del carrito`}
                                            >
                                                Eliminar
                                            </RemoveButton>
                                        </ItemInfo>
                                    </ListItem>
                                );
                            })}
                        </List>
                    )}
                </Content>

                <Actions aria-label="Acciones del carrito">
                    <ContinueShoppingButton
                        variant="secondary"
                        padding="14px 18px"
                        onClick={() => router.push('/')}
                        style={{ minWidth: 200 }}
                    >
                        CONTINUE SHOPPING
                    </ContinueShoppingButton>

                    {!isEmpty && (
                        <PayGroup>
                            <Total>
                                <TotalLabel>TOTAL</TotalLabel>
                                <TotalValue>{formatEURPlain(total)}</TotalValue>
                            </Total>
                            <PayButton
                                padding="14px 18px"
                                style={{ minWidth: 140 }}
                            >
                                PAY
                            </PayButton>
                        </PayGroup>
                    )}
                </Actions>
            </PageInner>
        </Page>
    );
}
