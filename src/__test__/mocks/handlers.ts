import { rest } from 'msw';
import { ProductListItem } from '@/types/product';
import { Page } from '@/api/types';

import ProductsList from './list-products.json';

export const handlers = [
    rest.get<Page<ProductListItem>>('/api/products', (req, res, ctx) => {
        const search = req.url.searchParams.get('search') ?? '';
        const limit = parseInt(req.url.searchParams.get('limit') || '10', 10);
        const offset = parseInt(req.url.searchParams.get('offset') || '0', 10);

        const filteredProducts =
            search === ''
                ? ProductsList
                : ProductsList.filter(
                      (product) =>
                          product.name
                              .toLowerCase()
                              .includes(search.toLowerCase()) ||
                          product.brand
                              .toLowerCase()
                              .includes(search.toLowerCase()),
                  );

        const result = filteredProducts.slice(offset, offset + limit);

        // console.log('MSW -- Products List handler\n\tParams:', { search, limit, offset }, '\n\tResult: ', { result });

        return res(
            ctx.status(200),
            ctx.json({
                list: result,
                offset,
                limit,
            }),
        );
    }),
];
