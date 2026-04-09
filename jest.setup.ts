import '@testing-library/jest-dom';
import 'jest-styled-components';
import { server } from './src/__test__/mocks/server';

// MSW: Mock API en tests
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
