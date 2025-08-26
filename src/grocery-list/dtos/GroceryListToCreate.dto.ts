export interface GroceryListToCreateDto {
  name: string;
  description?: string;
  createdBy: string;
  background: string;
  status: 'local' | 'active' | 'archived' | 'deleted';
  budget: number;
}