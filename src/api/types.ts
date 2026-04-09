export type Page<T> = {
    list: T[];
    offset: number;
    limit: number;
    total?: number;
};

export type ErrorEntity = {
    error: string;
    message: string;
    code?: string;
    details?: unknown;
};
