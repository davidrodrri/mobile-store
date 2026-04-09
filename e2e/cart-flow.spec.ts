import { expect, test } from '@playwright/test';

test('home → product detail → select options → add to cart → remove', async ({
    page,
}) => {
    await page.addInitScript(() => {
        window.localStorage.clear();
    });

    await page.goto('/');

    const firstProductLink = page
        .getByRole('link', { name: /ver detalle de/i })
        .first();
    await expect(firstProductLink).toBeVisible();
    await firstProductLink.click();

    await expect(page.getByLabel('Detalle de producto')).toBeVisible();

    const storageGroup = page.getByRole('group', { name: /^storage/i });
    const colorGroup = page.getByRole('group', { name: /^color/i });

    await storageGroup.getByRole('button').first().click();
    await colorGroup.getByRole('button').first().click();

    await page.getByRole('button', { name: 'AÑADIR' }).click();

    await page.getByRole('button', { name: 'Carrito' }).click();
    await expect(page.getByLabel('Carrito')).toBeVisible();

    const removeButton = page
        .getByRole('button', { name: /^eliminar .* del carrito$/i })
        .first();
    await expect(removeButton).toBeVisible();
    await removeButton.click();

    await expect(
        page.getByRole('button', { name: 'Carrito' }),
    ).toBeVisible();
});

