export interface RestGroceryItem {
  id: string,
  text: string,
  checked: boolean,
  listId: string,
  addedBy: string,
  price?: number,
  quantity?: number,
  notes?: string
}