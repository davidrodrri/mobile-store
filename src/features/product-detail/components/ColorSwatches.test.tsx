import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ColorSwatches } from './ColorSwatches';

describe('ColorSwatches', () => {
    const colors = [
        { name: 'Black', hexCode: '#000000' },
        { name: 'Silver', hexCode: '#C0C0C0' },
    ] as const;

    it('renders the label and a button per color', () => {
        render(
            <ColorSwatches
                label="Color"
                colors={colors}
                value={null}
                onChange={() => {}}
            />,
        );

        expect(screen.getByText('Color')).toBeInTheDocument();
        expect(
            screen.getByRole('group', { name: 'Color' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Black' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Silver' }),
        ).toBeInTheDocument();
    });

    it('sets aria-pressed according to the selected value', () => {
        render(
            <ColorSwatches
                label="Color"
                colors={colors}
                value="Black"
                onChange={() => {}}
            />,
        );

        expect(screen.getByRole('button', { name: 'Black' })).toHaveAttribute(
            'aria-pressed',
            'true',
        );
        expect(screen.getByRole('button', { name: 'Silver' })).toHaveAttribute(
            'aria-pressed',
            'false',
        );
    });

    it('calls onChange with the clicked option', async () => {
        const user = userEvent.setup();
        const onChange = jest.fn();

        render(
            <ColorSwatches
                label="Color"
                colors={colors}
                value={null}
                onChange={onChange}
            />,
        );

        await user.click(screen.getByRole('button', { name: 'Silver' }));
        expect(onChange).toHaveBeenCalledWith('Silver');
    });
});
