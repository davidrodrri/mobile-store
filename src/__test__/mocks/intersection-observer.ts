// Mocked IntersectionObserver
const observeMock = jest.fn();
const disconnectMock = jest.fn();
const unobserveMock = jest.fn();
let intersectionCallback: (entries: IntersectionObserverEntry[]) => void;

class MockIntersectionObserver {
    constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
        intersectionCallback = callback; // Guardamos el callback para usarlo en el test
    }
    observe = observeMock;
    disconnect = disconnectMock;
    unobserve = unobserveMock;
}

Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
});

beforeEach(() => {
    observeMock.mockClear();
    disconnectMock.mockClear();
    unobserveMock.mockClear();
});

global.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver;

export { observeMock, disconnectMock, unobserveMock, intersectionCallback };
