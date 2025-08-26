import type {SavedListEntity} from '@/grocery-list/infrastructure/entities/SavedListEntity.ts';
import type {GroceryList} from '@/grocery-list/domain/GroceryList.ts';

export class SavedListMapper {
  static toPersistance(groceryList: GroceryList): SavedListEntity {
    return {
      id: groceryList.id,
      shareCode: groceryList.shareCode,
    };
  }
}