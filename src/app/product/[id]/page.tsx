import { ProductDetail } from '@/features/product-detail/ProductDetail';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { backendFetchProductById } from '@/api/backendProducts';

const PRODUCT_DETAIL_REVALIDATE_SECONDS = 120;

function getRequiredEnv(name: string): string | null {
    const value = process.env[name];
    return value && value.trim() !== '' ? value : null;
}

async function fetchProductById(id: string) {
    const apiBaseUrl = getRequiredEnv('API_BASE_URL');
    const apiKey =
        getRequiredEnv('API_KEY') ?? '87909682e6cd74208f41a6ef39fe4191';

    if (!apiBaseUrl) return null;

    return backendFetchProductById({ baseUrl: apiBaseUrl, apiKey }, id, {
        next: { revalidate: PRODUCT_DETAIL_REVALIDATE_SECONDS },
    });
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;

    try {
        const product = await fetchProductById(id);
        if (!product) return { title: 'Producto no encontrado | Mobile Store' };

        const title = `${product.brand} ${product.name} | Mobile Store`;
        return {
            title,
            description: `Detalle del producto ${product.brand} ${product.name}.`,
        };
    } catch {
        return { title: 'Producto | Mobile Store' };
    }
}

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const apiBaseUrl = getRequiredEnv('API_BASE_URL');

    if (!apiBaseUrl) {
        return (
            <section style={{ padding: '12px 20px' }}>
                Falta API_BASE_URL (configura el backend en .env)
            </section>
        );
    }

    try {
        const product = await fetchProductById(id);
        if (!product) notFound();
        return <ProductDetail product={product} />;
    } catch {
        return (
            <section style={{ padding: '12px 20px' }}>
                No se pudo cargar el detalle del producto.
            </section>
        );
    }
}
