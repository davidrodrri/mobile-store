import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { StorageOptions } from './StorageOptions';

describe('StorageOptions', () => {
    const options = [
        { capacity: '128GB', price: 0 },
        { capacity: '256GB', price: 100 },
    ] as const;

    it('renders the label and one button per option', () => {
        render(
            <StorageOptions
                label="Storage"
                options={options}
                value={null}
                onChange={() => {}}
            />,
        );

        expect(screen.getByText('Storage')).toBeInTheDocument();
        expect(
            screen.getByRole('group', { name: 'Storage' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: '128GB' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: '256GB' }),
        ).toBeInTheDocument();
    });

    it('sets aria-pressed according to the selected value', () => {
        render(
            <StorageOptions
                label="Storage"
                options={options}
                value="256GB"
                onChange={() => {}}
            />,
        );

        expect(screen.getByRole('button', { name: '256GB' })).toHaveAttribute(
            'aria-pressed',
            'true',
        );
        expect(screen.getByRole('button', { name: '128GB' })).toHaveAttribute(
            'aria-pressed',
            'false',
        );
    });

    it('calls onChange with the clicked option', async () => {
        const user = userEvent.setup();
        const onChange = jest.fn();

        render(
            <StorageOptions
                label="Storage"
                options={options}
                value={null}
                onChange={onChange}
            />,
        );

        await user.click(screen.getByRole('button', { name: '128GB' }));
        expect(onChange).toHaveBeenCalledWith('128GB');
    });
});
