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

const Options = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;

    @media (max-width: 1024px) {
        justify-content: flex-start;
    }
`;

const OptionButton = styled.button<{ $selected: boolean }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 65px;
    width: 95px;
    padding: 0 12px;
    border: 1px solid lightgray;
    background: #fff;
    cursor: pointer;

    @media (max-width: 1024px) {
        width: 89px;
        height: 48px;
        padding: 0;
    }

    &:hover {
        border-color: rgba(0, 0, 0, 0.35);
    }

    &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.18);
    }

    ${(p) =>
        p.$selected
            ? css`
                  border-color: rgba(0, 0, 0, 0.55);
              `
            : ''}
`;

const OptionText = styled.span`
    font-size: 12px;
    text-transform: uppercase;
    padding: 10px 0;
`;

type Props = {
    label: string;
    options: readonly { capacity: string; price: number }[];
    value: string | null; // capacity
    onChange: (value: string) => void;
};

export function StorageOptions({ label, options, value, onChange }: Props) {
    return (
        <Container>
            <Label>{label}</Label>
            <Options role="group" aria-label={label}>
                {options.map((opt) => (
                    <OptionButton
                        key={opt.capacity}
                        type="button"
                        $selected={value === opt.capacity}
                        aria-pressed={value === opt.capacity}
                        onClick={() => onChange(opt.capacity)}
                    >
                        <OptionText>{opt.capacity}</OptionText>
                    </OptionButton>
                ))}
            </Options>
        </Container>
    );
}
