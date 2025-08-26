import {GroceryList} from '@/grocery-list/domain/GroceryList.ts';
import type {GroceryListToCreateDto} from '@/grocery-list/dtos/GroceryListToCreate.dto.ts';
import type {RestGroceryList} from '@/grocery-list/infrastructure/entities/RestGroceryList.ts';
import type {RestGroceryItem} from '@/grocery-list/infrastructure/entities/RestGroceryItem.ts';
import {generateRandomWord} from '@/utils/string.utils.ts';
import type {GroceryListEntity} from '@/grocery-list/infrastructure/entities/GroceryListEntity.ts';
import {GroceryItemMapper} from '@/grocery-list/infrastructure/entities/GroceryItemMapper.ts';

export class GroceryMapper {
  static toDomain(list: RestGroceryList | GroceryListEntity, items: RestGroceryItem[]): GroceryList {
    return new GroceryList(
      list.id,
      list.name,
      items.map(item => GroceryItemMapper.toDomain(item)),
      list.shareCode,
      list.createdBy,
      list.background,
      list.status,
      list.budget,
      list.description,
    );
  }

  static toRest(groceryListToCreateDto: GroceryListToCreateDto): RestGroceryList {
    const shareCode = generateRandomWord(6)
    return {
      id: crypto.randomUUID(),
      name: groceryListToCreateDto.name,
      description: groceryListToCreateDto.description,
      background: groceryListToCreateDto.background,
      createdBy: groceryListToCreateDto.createdBy,
      status: groceryListToCreateDto.status,
      budget: groceryListToCreateDto.budget,
      shareCode,
    };
  }

  static groceryListEntityToRest(groceryList: GroceryListEntity): RestGroceryList {
    return {
      id: groceryList.id,
      name: groceryList.name,
      description: groceryList.description,
      background: groceryList.background,
      createdBy: groceryList.createdBy,
      status: groceryList.status,
      shareCode: groceryList.shareCode,
      budget: groceryList.budget,
    };
  }

  static toPersistance(groceryListToCreateDto: GroceryListToCreateDto): GroceryListEntity {
    return {
      id: crypto.randomUUID(),
      name: groceryListToCreateDto.name,
      description: groceryListToCreateDto.description,
      background: groceryListToCreateDto.background,
      createdBy: groceryListToCreateDto.createdBy,
      status: groceryListToCreateDto.status,
      shareCode: generateRandomWord(6),
      budget: groceryListToCreateDto.budget,
    };
  }
}