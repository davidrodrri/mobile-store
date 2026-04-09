import React from 'react';

import styled, { css } from 'styled-components';

type Variant = 'primary' | 'secondary';

type Props = Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'className' | 'disabled'
> & {
    width?: number | string;
    padding?: number | string;
    disabled?: boolean;
    variant?: Variant;
};

const StyledButton = styled.button<{
    $variant: Variant;
    $disabled: boolean;
    $width?: number | string;
    $padding?: number | string;
}>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    font-size: 12px;
    font-weight: 300;
    letter-spacing: 0.02em;
    cursor: pointer;
    user-select: none;
    transition:
        background-color 120ms ease,
        color 120ms ease,
        opacity 120ms ease,
        border-color 120ms ease;

    ${(p) =>
        p.$width != null
            ? css`
                  width: ${typeof p.$width === 'number'
                      ? `${p.$width}px`
                      : p.$width};
              `
            : ''}

    ${(p) =>
        p.$padding != null
            ? css`
                  padding: ${typeof p.$padding === 'number'
                      ? `${p.$padding}px`
                      : p.$padding};
              `
            : ''}

    ${(p) => {
        if (p.$variant === 'secondary') {
            return p.$disabled
                ? css`
                      background: #fff;
                      color: #c2bfbc;
                      border: 1px solid #c2bfbc;
                      cursor: not-allowed;
                  `
                : css`
                      background: #fff;
                      color: #000;
                      border: 1px solid #000;
                  `;
        }

        return p.$disabled
            ? css`
                  background: #f4f3f1;
                  color: #c2bfbc;
                  cursor: not-allowed;
              `
            : css`
                  background: #000;
                  color: #fff;
              `;
    }}
`;

export function Button({
    width,
    padding,
    disabled,
    variant = 'primary',
    style,
    children,
    ...rest
}: Props) {
    return (
        <StyledButton
            {...rest}
            type={rest.type ?? 'button'}
            disabled={disabled}
            $variant={variant}
            $disabled={Boolean(disabled)}
            $width={width}
            $padding={padding}
            style={style}
        >
            {children}
        </StyledButton>
    );
}
