import { Buffer } from "buffer";
export interface RecipeItem {
  name: string;
  quantity: number;
}

export interface RecipesPost {
  id?: string;
  name: string;
  description: string;
  items: RecipeItem[];
  imageBuffer: Buffer;
  tags: string[];
  src: string;
}