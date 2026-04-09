'use client';

import React from 'react';
import styled, { css } from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    @media (max-width: 1024px) {
        align-items: flex-start;
    }
`;

const Label = styled.span`
    font-size: 14px;
    font-weight: 300;
    text-transform: uppercase;

    @media (max-width: 1024px) {
        font-size: 12px;
        text-align: left;
    }
`;

const Swatches = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;

    @media (max-width: 1024px) {
        justify-content: flex-start;
    }
`;

const SwatchButton = styled.button<{ $selected: boolean }>`
    width: 24px;
    height: 24px;
    border: 1px solid rgba(0, 0, 0, 0.18);
    cursor: pointer;
    padding: 0;
    outline: none;

    &:hover {
        border-color: rgba(0, 0, 0, 0.35);
    }

    &:focus-visible {
        box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.18);
    }

    ${(p) =>
        p.$selected
            ? css`
                  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.35);
              `
            : ''}
`;

type Props = {
    label: string;
    colors: readonly { name: string; hexCode: string }[];
    value: string | null;
    onChange: (value: string) => void;
};

export function ColorSwatches({ label, colors, value, onChange }: Props) {
    return (
        <Container>
            <Label>{label}</Label>
            <Swatches role="group" aria-label={label}>
                {colors.map((opt) => (
                    <SwatchButton
                        key={opt.name}
                        type="button"
                        $selected={value === opt.name}
                        style={{ backgroundColor: opt.hexCode }}
                        aria-label={opt.name}
                        aria-pressed={value === opt.name}
                        title={opt.name}
                        onClick={() => onChange(opt.name)}
                    />
                ))}
            </Swatches>
        </Container>
    );
}
