'use client';

import React from 'react';
import styled from 'styled-components';

import type { ProductSimilarProduct } from '@/types/product';

import { ProductCard } from '@/components/products/ProductCard';

const ScrollbarTrack = styled.div`
    height: 12px;
    width: 100%;
    position: relative;
    box-sizing: border-box;
    cursor: grab;
    touch-action: none;

    &::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        height: 2px;
        transform: translateY(-50%);
        background: #d9d9d9;
    }
`;

const ScrollbarThumb = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: 12px;
    width: 40px;
    background: transparent;
    border-radius: 0;
    transform: translateX(0);
    will-change: transform, width;
    touch-action: none;
    cursor: grab;

    &::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        height: 2px;
        transform: translateY(-50%);
        background: #000;
    }
`;

const CarouselBody = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Section = styled.section`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 40px;
    box-sizing: border-box;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
`;

const Scroller = styled.div`
    display: flex;
    --gap: 0px;
    --card-size: 344px;
    gap: var(--gap);
    overflow-x: auto;
    padding: 4px 2px 12px;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: 2px;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
    align-items: stretch;
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
        width: 0;
        height: 0;
    }

    &::-webkit-scrollbar-button {
        width: 0;
        height: 0;
        display: none;
    }

    @media (max-width: 1080px) {
        --card-size: 350px;
    }

    @media (max-width: 736px) {
        --card-size: min(350px, 100%);
        width: var(--card-size);
        max-width: 100%;
        margin-left: auto;
        margin-right: auto;
        padding: 4px 0 12px;
        scroll-padding-inline: 0px;
    }
`;

const Item = styled.div`
    flex: 0 0 var(--card-size);
    width: var(--card-size);
    height: var(--card-size);
    scroll-snap-align: start;
    display: flex;

    & > * {
        width: var(--card-size);
        height: var(--card-size);
    }

    @media (max-width: 736px) {
        scroll-snap-align: start;
    }
`;

type Props = {
    products: ProductSimilarProduct[];
    title?: string;
};

export function SimilarItemsCarousel({ products }: Props) {
    const scrollerRef = React.useRef<HTMLDivElement | null>(null);
    const trackRef = React.useRef<HTMLDivElement | null>(null);
    const thumbRef = React.useRef<HTMLDivElement | null>(null);
    const rafRef = React.useRef<number | null>(null);
    const dragRef = React.useRef<{
        active: boolean;
        startX: number;
        startLeft: number;
    }>({ active: false, startX: 0, startLeft: 0 });

    const updateThumb = React.useCallback(() => {
        const scroller = scrollerRef.current;
        const track = trackRef.current;
        const thumb = thumbRef.current;
        if (!scroller || !track || !thumb) return;

        const { scrollLeft, scrollWidth, clientWidth } = scroller;
        const trackWidth = track.clientWidth;
        const maxScrollLeft = Math.max(0, scrollWidth - clientWidth);

        if (maxScrollLeft <= 0 || trackWidth <= 0) {
            thumb.style.width = '0px';
            thumb.style.transform = 'translateX(0px)';
            return;
        }

        const rawThumbWidth = (clientWidth / scrollWidth) * trackWidth;
        const thumbWidth = Math.max(40, Math.floor(rawThumbWidth));
        const maxThumbLeft = Math.max(0, trackWidth - thumbWidth);
        const thumbLeft =
            maxScrollLeft === 0
                ? 0
                : (scrollLeft / maxScrollLeft) * maxThumbLeft;

        thumb.style.width = `${thumbWidth}px`;
        thumb.style.transform = `translateX(${Math.round(thumbLeft)}px)`;
    }, []);

    const scheduleUpdate = React.useCallback(() => {
        if (rafRef.current != null) return;
        rafRef.current = window.requestAnimationFrame(() => {
            rafRef.current = null;
            updateThumb();
        });
    }, [updateThumb]);

    const seen = new Set<string>();
    const uniqueProducts: ProductSimilarProduct[] = [];

    for (const p of products ?? []) {
        if (!p?.id) continue;
        if (seen.has(p.id)) continue;
        seen.add(p.id);
        uniqueProducts.push(p);
    }

    const hasProducts = uniqueProducts.length > 0;

    React.useEffect(() => {
        scheduleUpdate();

        const scroller = scrollerRef.current;
        if (!scroller) return;

        function onScroll() {
            scheduleUpdate();
        }

        scroller.addEventListener('scroll', onScroll, { passive: true });

        const ro = new ResizeObserver(() => scheduleUpdate());
        ro.observe(scroller);
        if (trackRef.current) ro.observe(trackRef.current);

        return () => {
            scroller.removeEventListener('scroll', onScroll);
            ro.disconnect();
            if (rafRef.current != null) {
                window.cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };
    }, [scheduleUpdate]);

    if (!hasProducts) return null;

    function handleThumbPointerDown(e: React.PointerEvent<HTMLDivElement>) {
        const track = trackRef.current;
        const thumb = thumbRef.current;
        if (!track || !thumb) return;

        e.preventDefault();
        dragRef.current.active = true;
        dragRef.current.startX = e.clientX;

        const transform = thumb.style.transform || 'translateX(0px)';
        const match = /translateX\(([-0-9.]+)px\)/.exec(transform);
        dragRef.current.startLeft = match ? Number(match[1]) : 0;

        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    }

    function handleThumbPointerMove(e: React.PointerEvent<HTMLDivElement>) {
        const scroller = scrollerRef.current;
        const track = trackRef.current;
        const thumb = thumbRef.current;
        if (!scroller || !track || !thumb) return;
        if (!dragRef.current.active) return;

        e.preventDefault();
        const { scrollWidth, clientWidth } = scroller;
        const maxScrollLeft = Math.max(0, scrollWidth - clientWidth);
        const trackWidth = track.clientWidth;
        const thumbWidth = thumb.getBoundingClientRect().width;
        const maxThumbLeft = Math.max(0, trackWidth - thumbWidth);
        if (maxThumbLeft <= 0 || maxScrollLeft <= 0) return;

        const delta = e.clientX - dragRef.current.startX;
        const nextThumbLeft = Math.min(
            maxThumbLeft,
            Math.max(0, dragRef.current.startLeft + delta),
        );
        const nextScrollLeft = (nextThumbLeft / maxThumbLeft) * maxScrollLeft;
        scroller.scrollLeft = nextScrollLeft;
    }

    function handleThumbPointerUp() {
        dragRef.current.active = false;
    }

    function handleTrackPointerDown(e: React.PointerEvent<HTMLDivElement>) {
        const scroller = scrollerRef.current;
        const track = trackRef.current;
        const thumb = thumbRef.current;
        if (!scroller || !track || !thumb) return;

        e.preventDefault();

        const { scrollWidth, clientWidth } = scroller;
        const maxScrollLeft = Math.max(0, scrollWidth - clientWidth);
        const trackRect = track.getBoundingClientRect();
        const trackWidth = track.clientWidth;
        const thumbWidth = thumb.getBoundingClientRect().width;
        const maxThumbLeft = Math.max(0, trackWidth - thumbWidth);
        if (maxThumbLeft <= 0 || maxScrollLeft <= 0) return;

        const clickX = e.clientX - trackRect.left;
        const nextThumbLeft = Math.min(
            maxThumbLeft,
            Math.max(0, clickX - thumbWidth / 2),
        );
        const nextScrollLeft = (nextThumbLeft / maxThumbLeft) * maxScrollLeft;
        scroller.scrollLeft = nextScrollLeft;

        dragRef.current.active = true;
        dragRef.current.startX = e.clientX;
        dragRef.current.startLeft = nextThumbLeft;

        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    }

    function handleTrackPointerMove(e: React.PointerEvent<HTMLDivElement>) {
        return handleThumbPointerMove(
            e as unknown as React.PointerEvent<HTMLDivElement>,
        );
    }

    function handleTrackPointerUp() {
        handleThumbPointerUp();
    }

    return (
        <Section aria-label="Productos similares">
            <Header>
                <span style={{ fontSize: 20, textTransform: 'uppercase' }}>
                    SIMILAR ITEMS
                </span>
            </Header>

            <CarouselBody>
                <Scroller
                    ref={scrollerRef}
                    role="list"
                    aria-label="Lista de productos similares"
                    tabIndex={0}
                >
                    {uniqueProducts.map((product) => (
                        <Item key={product.id} role="listitem">
                            <ProductCard product={product} />
                        </Item>
                    ))}
                </Scroller>

                <ScrollbarTrack
                    ref={trackRef}
                    aria-hidden="true"
                    onPointerDown={handleTrackPointerDown}
                    onPointerMove={handleTrackPointerMove}
                    onPointerUp={handleTrackPointerUp}
                    onPointerCancel={handleTrackPointerUp}
                >
                    <ScrollbarThumb
                        ref={thumbRef}
                        onPointerDown={handleThumbPointerDown}
                        onPointerMove={handleThumbPointerMove}
                        onPointerUp={handleThumbPointerUp}
                        onPointerCancel={handleThumbPointerUp}
                    />
                </ScrollbarTrack>
            </CarouselBody>
        </Section>
    );
}
