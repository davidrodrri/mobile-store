'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

const Button = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 0;
    margin: 0;
    border: none;
    background: #fff;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    color: inherit;
    font: inherit;
`;

const Icon = styled.img`
    display: block;
`;

type Props = {
    label?: string;
};

export function BackButton({ label = 'BACK' }: Props) {
    const router = useRouter();

    function handleClick() {
        if (typeof window !== 'undefined' && window.history.length > 1) {
            router.back();
        } else {
            router.push('/');
        }
    }

    return (
        <Button
            type="button"
            onClick={handleClick}
            aria-label="Volver a la página anterior"
        >
            <Icon
                src="/Icon%20Wrapper.svg"
                alt=""
                aria-hidden="true"
                width={20}
                height={20}
            />
            <span style={{ fontSize: 12 }}>{label}</span>
        </Button>
    );
}
