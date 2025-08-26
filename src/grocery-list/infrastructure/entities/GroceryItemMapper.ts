import type {RestGroceryItem} from '@/grocery-list/infrastructure/entities/RestGroceryItem.ts';
import {GroceryItem} from '@/grocery-list/domain/GroceryItem.ts';
import type {GroceryItemToCreateDto} from '@/grocery-list/dtos/GroceryItemToCreate.dto.ts';
import type {GroceryItemEntity} from '@/grocery-list/infrastructure/entities/GroceryItemEntity.ts';

export class GroceryItemMapper {
  static toDomain(restGroceryItem: RestGroceryItem): GroceryItem {
    return new GroceryItem(
      restGroceryItem.id,
      restGroceryItem.text,
      restGroceryItem.checked,
      restGroceryItem.listId,
      restGroceryItem.addedBy,
      restGroceryItem.price,
      restGroceryItem.quantity,
      restGroceryItem.notes,
    );
  }

  static toRest(groceryItemToCreateDto: GroceryItemToCreateDto): RestGroceryItem {
    return {
      id: crypto.randomUUID(),
      text: groceryItemToCreateDto.text,
      listId: groceryItemToCreateDto.listId,
      checked: groceryItemToCreateDto.checked,
      addedBy: groceryItemToCreateDto.addedBy,
      price: +(groceryItemToCreateDto.price ?? 0),
      quantity: +(groceryItemToCreateDto.quantity ?? 1),
      notes: groceryItemToCreateDto.notes,
    };
  }

  static toPersistance(groceryItemToCreateDto: GroceryItemToCreateDto): GroceryItemEntity {
    return {
      id: crypto.randomUUID(),
      text: groceryItemToCreateDto.text,
      listId: groceryItemToCreateDto.listId,
      checked: false,
      addedBy: groceryItemToCreateDto.addedBy,
      price: +(groceryItemToCreateDto.price ?? 0),
      quantity: +(groceryItemToCreateDto.quantity ?? 1),
      notes: groceryItemToCreateDto.notes,
    };
  }
}