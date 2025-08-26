export interface GroceryListEntity {
  id: string,
  name: string,
  createdBy: string,
  shareCode: string,
  background: string,
  budget: number,
  description?: string,
  status: 'local' | 'active' | 'archived' | 'deleted',
}