export interface GroceryItemToCreateDto {
  listId: string;
  text: string;
  checked: boolean;
  addedBy: string;
  price?: number;
  quantity?: number;
  notes?: string;
}