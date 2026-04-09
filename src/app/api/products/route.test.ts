/** @jest-environment node */
import { GET } from './route';

type FetchMock = jest.MockedFunction<typeof fetch>;

function mockFetchJson(status: number, body: unknown) {
    const mock = global.fetch as unknown as FetchMock;
    mock.mockResolvedValue({
        ok: status >= 200 && status < 300,
        status,
        json: async () => body,
    } as unknown as Response);
}

describe('src/app/api/products/route GET', () => {
    const prevEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...prevEnv };
        global.fetch = jest.fn() as unknown as typeof fetch;
    });

    afterAll(() => {
        process.env = prevEnv;
    });

    it('returns 500 when API_BASE_URL is missing', async () => {
        delete process.env.API_BASE_URL;

        const res = await GET(new Request('http://localhost/api/products'));
        expect(res.status).toBe(500);
        await expect(res.json()).resolves.toEqual({
            error: 'Missing API_BASE_URL',
        });
    });

    it('forwards search/limit/offset and returns deduped list', async () => {
        process.env.API_BASE_URL = 'https://example.com/';
        process.env.API_KEY = 'test-key';

        mockFetchJson(200, [
            {
                id: 'p1',
                brand: 'B',
                name: 'N',
                basePrice: 100,
                imageUrl: '/1.png',
            },
            {
                id: 'p1',
                brand: 'B2',
                name: 'N2',
                basePrice: 200,
                imageUrl: '/2.png',
            },
            {
                id: 'p2',
                brand: 'C',
                name: 'M',
                basePrice: 300,
                imageUrl: '/3.png',
            },
        ]);

        const req = new Request(
            'http://localhost/api/products?search=iphone&limit=10&offset=20',
        );
        const res = await GET(req);

        const fetchMock = global.fetch as unknown as FetchMock;
        expect(fetchMock).toHaveBeenCalledTimes(1);
        const [urlArg, initArg] = fetchMock.mock.calls[0];
        expect(String(urlArg)).toBe(
            'https://example.com/products?search=iphone&limit=10&offset=20',
        );
        expect(initArg).toMatchObject({
            headers: { 'x-api-key': 'test-key' },
            cache: 'no-store',
        });

        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json).toEqual([
            {
                id: 'p1',
                brand: 'B2',
                name: 'N2',
                basePrice: 200,
                imageUrl: '/2.png',
            },
            {
                id: 'p2',
                brand: 'C',
                name: 'M',
                basePrice: 300,
                imageUrl: '/3.png',
            },
        ]);
    });

    it('does not forward an empty/blank search param', async () => {
        process.env.API_BASE_URL = 'https://example.com/';

        mockFetchJson(200, []);

        const req = new Request(
            'http://localhost/api/products?search=%20%20%20',
        );
        await GET(req);

        const fetchMock = global.fetch as unknown as FetchMock;
        const [urlArg] = fetchMock.mock.calls[0];
        expect(String(urlArg)).toBe('https://example.com/products');
    });
});
