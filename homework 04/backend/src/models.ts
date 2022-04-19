export interface RecipeItem {
    name: string;
    quantity: number;
}

export interface Recipe {
    id?: string;
    name: string;
    description: string;
    items: RecipeItem[];
    imageUrl: string;
    tags: string[];
}


