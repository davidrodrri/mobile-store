export type ProductListItem = {
    id: string;
    brand: string;
    name: string;
    basePrice: number;
    imageUrl: string;
};

export type ProductColorOption = {
    name: string;
    hexCode: string;
    imageUrl: string;
};

export type ProductStorageOption = {
    capacity: string;
    price: number;
};

export type ProductSimilarProduct = {
    id: string;
    brand: string;
    name: string;
    basePrice: number;
    imageUrl: string;
};

export type ProductEntity = {
    id: string;
    brand: string;
    name: string;
    description: string;
    basePrice: number;
    rating: number;
    specs: Record<string, string>;
    colorOptions: ProductColorOption[];
    storageOptions: ProductStorageOption[];
    similarProducts: ProductSimilarProduct[];
};
