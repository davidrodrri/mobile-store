import { expect, test } from '@playwright/test';

test('search calls /api/products and updates list', async ({ page }) => {
    await page.addInitScript(() => {
        window.localStorage.clear();
    });

    await page.route(/\/api\/products\?search=.*/i, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                {
                    id: 'e2e-mock-1',
                    brand: 'E2E',
                    name: 'Mock Phone',
                    basePrice: 123,
                    imageUrl: '/mbst.svg',
                },
            ]),
        });
    });

    await page.goto('/');

    const search = page.getByRole('search', { name: 'Búsqueda' });
    await expect(search).toBeVisible();

    await search.getByRole('searchbox', { name: 'Buscar productos' }).fill('x');

    const mockedLink = page.getByRole('link', { name: /ver detalle de e2e/i });
    await expect(mockedLink).toBeVisible();

    await expect(page.getByText('1 RESULTS')).toBeVisible();
});

