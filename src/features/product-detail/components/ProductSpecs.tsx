import React from 'react';
import styled from 'styled-components';

import type { ProductEntity } from '@/types/product';

const Container = styled.section`
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 40px;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
`;

const Specs = styled.div`
    width: 100%;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;

    tr > * {
        border-top: 1px solid rgba(0, 0, 0, 0.18);
    }

    tr:last-child > * {
        border-bottom: 1px solid rgba(0, 0, 0, 0.18);
    }
`;

const KeyCell = styled.th`
    padding: 12px 0;
    border: none;
    text-align: left;
    font-size: 12px;
    font-weight: 300;
    width: 30%;
    padding-right: 24px;
`;

const ValueCell = styled.td`
    padding: 12px 0;
    border: none;
    text-align: left;
    font-size: 12px;
    font-weight: 300;
`;

type Props = {
    product: ProductEntity;
};

function pickSpec(specs: Record<string, string>, options: string[]) {
    for (const key of options) {
        const value = specs[key];
        if (typeof value === 'string' && value.trim() !== '') return value;
    }
    return undefined;
}

export function ProductSpecs({ product }: Props) {
    const specs = product.specs ?? {};
    const rows = [
        { key: 'brand', label: 'BRAND', value: product.brand ?? '—' },
        { key: 'name', label: 'NAME', value: product.name ?? '—' },
        {
            key: 'description',
            label: 'DESCRIPTION',
            value: product.description ?? '—',
        },
        {
            key: 'screen',
            label: 'SCREEN',
            value: pickSpec(specs, ['screen', 'display', 'displaySize']) ?? '—',
        },
        {
            key: 'resolution',
            label: 'RESOLUTION',
            value:
                pickSpec(specs, [
                    'resolution',
                    'displayResolution',
                    'screenResolution',
                ]) ?? '—',
        },
        {
            key: 'processor',
            label: 'PROCESSOR',
            value:
                pickSpec(specs, ['processor', 'chipset', 'cpu', 'soc']) ?? '—',
        },
        {
            key: 'mainCamera',
            label: 'MAIN CAMERA',
            value:
                pickSpec(specs, [
                    'mainCamera',
                    'main_camera',
                    'rearCamera',
                    'camera',
                ]) ?? '—',
        },
        {
            key: 'selfieCamera',
            label: 'SELFIE CAMERA',
            value:
                pickSpec(specs, [
                    'selfieCamera',
                    'selfie_camera',
                    'frontCamera',
                ]) ?? '—',
        },
        {
            key: 'battery',
            label: 'BATTERY',
            value: pickSpec(specs, ['battery', 'batteryCapacity']) ?? '—',
        },
        {
            key: 'os',
            label: 'OS',
            value: pickSpec(specs, ['os', 'operatingSystem']) ?? '—',
        },
        {
            key: 'screenRefreshRate',
            label: 'SCREEN REFRESH RATE',
            value:
                pickSpec(specs, [
                    'screenRefreshRate',
                    'refreshRate',
                    'displayRefreshRate',
                ]) ?? '—',
        },
    ];

    return (
        <Container>
            <Header>
                <span style={{ fontSize: 20, textTransform: 'uppercase' }}>
                    SPECIFICATIONS
                </span>
            </Header>

            <Specs aria-label="Especificaciones">
                <Table>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.key}>
                                <KeyCell scope="row">{row.label}</KeyCell>
                                <ValueCell>{row.value}</ValueCell>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Specs>
        </Container>
    );
}
