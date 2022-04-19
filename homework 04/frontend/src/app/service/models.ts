export interface RecipeItem {
  name: string;
  quantity: number;
}

export interface RecipesPost {
  id?: string;
  name: string;
  description: string;
  items: RecipeItem[];
  imageUrl: string;
  tags: string[];
  src: string;
}
