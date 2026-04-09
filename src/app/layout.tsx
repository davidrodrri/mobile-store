import type { Metadata } from 'next';

import { AppHeader } from '@/components/layout/AppHeader';
import StyledComponentsRegistry from '@/lib/styled-components-registry';

import './globals.css';

export const metadata: Metadata = {
    title: 'Mobile Store',
    description: 'Mobile catalog and cart',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body>
                <StyledComponentsRegistry>
                    <AppHeader />
                    <main>{children}</main>
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}
