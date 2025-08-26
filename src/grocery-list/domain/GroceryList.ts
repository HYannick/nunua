import type {GroceryItem} from '@/grocery-list/domain/GroceryItem.ts';

export class GroceryList {
  constructor(
    public id: string,
    public name: string,
    public items: GroceryItem[],
    public shareCode: string,
    public createdBy: string,
    public background: string,
    public status: 'local' | 'active' | 'archived' | 'deleted',
    public budget: number,
    public description?: string,
  ) {
  }
}