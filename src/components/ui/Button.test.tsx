import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button } from './Button';

describe('Button', () => {
    it('renders children and defaults type to button', () => {
        render(<Button>Comprar</Button>);
        const btn = screen.getByRole('button', { name: 'Comprar' });
        expect(btn).toBeInTheDocument();
        expect(btn).toHaveAttribute('type', 'button');
    });

    it('respects provided type', () => {
        render(<Button type="submit">Enviar</Button>);
        expect(screen.getByRole('button', { name: 'Enviar' })).toHaveAttribute(
            'type',
            'submit',
        );
    });

    it('supports disabled', () => {
        render(<Button disabled>Comprar</Button>);
        expect(screen.getByRole('button', { name: 'Comprar' })).toBeDisabled();
    });

    it('fires onClick when enabled', async () => {
        const user = userEvent.setup();
        const onClick = jest.fn();
        render(<Button onClick={onClick}>Comprar</Button>);

        await user.click(screen.getByRole('button', { name: 'Comprar' }));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not fire onClick when disabled', async () => {
        const user = userEvent.setup();
        const onClick = jest.fn();
        render(
            <Button onClick={onClick} disabled>
                Comprar
            </Button>,
        );

        await user.click(screen.getByRole('button', { name: 'Comprar' }));
        expect(onClick).toHaveBeenCalledTimes(0);
    });
});
