import {type Databases, Query} from 'appwrite';
import {appwriteDatabaseId, appwriteGroceryItemCollectionId, appwriteGroceryListCollectionId} from '@/appwrite.constants.ts';
import type {GroceryListToCreateDto} from '@/grocery-list/dtos/GroceryListToCreate.dto.ts';
import {GroceryMapper} from '@/grocery-list/infrastructure/entities/GroceryMapper.ts';
import type {GroceryList} from '@/grocery-list/domain/GroceryList.ts';
import type {GroceryItemToCreateDto} from '@/grocery-list/dtos/GroceryItemToCreate.dto.ts';
import {GroceryItemMapper} from '@/grocery-list/infrastructure/entities/GroceryItemMapper.ts';
import type {GroceryItem} from '@/grocery-list/domain/GroceryItem.ts';
import type {DatabaseService} from '@/databaseService.ts';
import {SavedListMapper} from '@/grocery-list/infrastructure/entities/SavedListMapper.ts';

export class GroceryListService {

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly appwriteDB: Databases) {
  }

  async saveGroceryList(groceryListToCreateDto: GroceryListToCreateDto): Promise<GroceryList> {
    if(groceryListToCreateDto.status === 'local') {
     const  data =  GroceryMapper.toPersistance(groceryListToCreateDto)
      this.databaseService.db.groceryLists.add(data);
      return GroceryMapper.toDomain(data, [])
    } else {
      const data = GroceryMapper.toRest(groceryListToCreateDto);
      await this.appwriteDB.createDocument(
        appwriteDatabaseId,
        appwriteGroceryListCollectionId,
        data.id,
        data
      );
      const listItem = GroceryMapper.toDomain(data, []);
      this.databaseService.db.savedLists.add(SavedListMapper.toPersistance(listItem));
      return GroceryMapper.toDomain(data, []);
    }
  }

  async getLocalGroceryListById(id: string): Promise<GroceryList | null> {
    const list = await this.databaseService.db.groceryLists.get(id);
    if (!list) return null;

    const items = await this.databaseService.db.groceryItems.where('listId').equals(id).toArray();
    return GroceryMapper.toDomain(list, items);
  }

  async getGroceryListByShareCode(shareCode: string): Promise<GroceryList | null> {
    const restGroceryLists = await this.appwriteDB.listDocuments(
      appwriteDatabaseId,
      appwriteGroceryListCollectionId,
      [Query.equal('shareCode', shareCode)]
    );

    const groceryList = restGroceryLists.documents[0];

    const restGroceryItems = await this.appwriteDB.listDocuments(
      appwriteDatabaseId,
      appwriteGroceryItemCollectionId,
      [Query.equal('listId', groceryList.$id)]);

    return GroceryMapper.toDomain(groceryList as any, restGroceryItems.documents as any);
  }

  async createGroceryItem(groceryItemToCreate: GroceryItemToCreateDto, isOnline: boolean): Promise<GroceryItem> {
    if(!isOnline) {
      const data = GroceryItemMapper.toPersistance(groceryItemToCreate);
      this.databaseService.db.groceryItems.add(data);
      return GroceryItemMapper.toDomain(data);
    } else {
      const data = GroceryItemMapper.toRest(
        groceryItemToCreate,
      );
      await this.appwriteDB.createDocument(
        appwriteDatabaseId,
        appwriteGroceryItemCollectionId,
        data.id,
        data
      );

      return GroceryItemMapper.toDomain(data)
    }
  }

  async checkGroceryItem(itemId: string, checked: boolean, isOnline: boolean): Promise<GroceryItem> {
   if (isOnline) {
     const item = await this.appwriteDB.updateDocument(
       appwriteDatabaseId,
       appwriteGroceryItemCollectionId,
       itemId,
       { checked }
     );

     return GroceryItemMapper.toDomain(item as any);
   } else {
      const item = await this.databaseService.db.groceryItems.get(itemId);
      if (!item) throw new Error('Item not found');

      item.checked = checked;
      await this.databaseService.db.groceryItems.put(item);

      return GroceryItemMapper.toDomain(item);
   }
  }

  async editGroceryItem(itemId: string, updatedFields: Partial<GroceryItemToCreateDto>, isOnline: boolean): Promise<GroceryItem> {
    if (isOnline) {
      console.log(updatedFields)
      const item = await this.appwriteDB.updateDocument(
        appwriteDatabaseId,
        appwriteGroceryItemCollectionId,
        itemId,
        {
          ...updatedFields,
          price: +(updatedFields.price ?? 0),
          quantity: +(updatedFields.quantity ?? 1),
        }
      );
      return GroceryItemMapper.toDomain(item as any);
    }
    else {
      const item = await this.databaseService.db.groceryItems.get(itemId);
      if (!item) throw new Error('Item not found');

      await this.databaseService.db.groceryItems.update(itemId, updatedFields);

      return GroceryItemMapper.toDomain(item);
    }
  }

  async deleteGroceryItem(itemId: string, isOnline:boolean): Promise<void> {
    if(isOnline) {
      await this.appwriteDB.deleteDocument(
        appwriteDatabaseId,
        appwriteGroceryItemCollectionId,
        itemId
      );
    } else {
      const item = await this.databaseService.db.groceryItems.get(itemId);
      if (!item) throw new Error('Item not found');

      await this.databaseService.db.groceryItems.delete(itemId);
    }
  }

  async deleteGroceryList(listId: string, listItemIds: string[], isOnline: boolean): Promise<void> {
    if (isOnline) {
      for (const itemId of listItemIds) {
        await this.appwriteDB.deleteDocument(
          appwriteDatabaseId,
          appwriteGroceryItemCollectionId,
          itemId
        );
      }
      await this.appwriteDB.updateDocument(
        appwriteDatabaseId,
        appwriteGroceryListCollectionId,
        listId,
        { status: 'deleted' }
      );
    } else {
      const items = await this.databaseService.db.groceryItems.where('listId').equals(listId).toArray();
      await this.databaseService.db.groceryItems.bulkDelete(items.map(item => item.id));
      await this.databaseService.db.groceryLists.delete(listId);
    }
    this.databaseService.db.savedLists.delete(listId);
  }

  async joinGroceryListByShareCode(shareCode: string) {
    const list = await this.getGroceryListByShareCode(shareCode);
    if (!list) return null;
    const existingList = await this.databaseService.db.groceryLists.get(list.id);
    if (existingList) {
      return list;
    } else {
      this.databaseService.db.savedLists.add(SavedListMapper.toPersistance(list));
    }
    return list;
  }

  async getLocalGroceryLists() {
    return this.databaseService.db.groceryLists.toArray().then(lists => {
      return Promise.all(lists.map(async list => {
        const items = await this.databaseService.db.groceryItems.where('listId').equals(list.id).toArray();
        return GroceryMapper.toDomain(list, items);
      }));
    });
  }

  async hasSavedList(id: string): Promise<boolean> {
    return !!(await this.databaseService.db.savedLists.get(id));
  }

  async getMyGroceryLists() {
    const myLists = await this.databaseService.db.savedLists.toArray();
    if (myLists.length === 0) return [];
    const myListIds = myLists.map(item => item.id);
    const response = await this.appwriteDB.listDocuments(
      appwriteDatabaseId,
      appwriteGroceryListCollectionId,
      [Query.contains('$id', myListIds)]
    );
    return response.documents.map(doc => GroceryMapper.toDomain(doc as any, []));
  }

  async pushListOnline(listId:string): Promise<void> {
    const list = await this.databaseService.db.groceryLists.get(listId);
    if (!list) throw new Error('List not found');

    const items = await this.databaseService.db.groceryItems.where('listId').equals(listId).toArray();
    const restList = GroceryMapper.groceryListEntityToRest(list);

    await this.appwriteDB.createDocument(
      appwriteDatabaseId,
      appwriteGroceryListCollectionId,
      restList.id,
      {
        ...restList,
        status: 'active',
      }
    );

    for (const item of items) {
      const restItem = GroceryItemMapper.toRest(item);
      await this.appwriteDB.createDocument(
        appwriteDatabaseId,
        appwriteGroceryItemCollectionId,
        restItem.id,
        restItem
      );
    }
    await this.deleteLocalGroceryList(listId);
    this.databaseService.db.savedLists.add(SavedListMapper.toPersistance(GroceryMapper.toDomain(restList, items)));
  }

  async deleteLocalGroceryList(listId: string): Promise<void> {
    const items = await this.databaseService.db.groceryItems.where('listId').equals(listId).toArray();
    await this.databaseService.db.groceryItems.bulkDelete(items.map(item => item.id));
    await this.databaseService.db.groceryLists.delete(listId);
    await this.databaseService.db.savedLists.delete(listId);
  }

  async saveBudget(listId: string, budget: number, isOnline: boolean) {
    if(!isOnline) {
      const list = await this.databaseService.db.groceryLists.get(listId);
      if (!list) throw new Error('List not found');

      list.budget = budget;
      await this.databaseService.db.groceryLists.put(list);
      return GroceryMapper.toDomain(list, []);
    }
    else {
      const updatedList = await this.appwriteDB.updateDocument(
        appwriteDatabaseId,
        appwriteGroceryListCollectionId,
        listId,
        { budget },
      );
      return GroceryMapper.toDomain(updatedList as any, []);
    }
  }

  async updateListDetails(id: string, form: {name: string, background: string}, isOnline: boolean) {
    if(!isOnline) {
      const list = await this.databaseService.db.groceryLists.get(id);
      if (!list) throw new Error('List not found');

      list.name = form.name;
      list.background = form.background;
      await this.databaseService.db.groceryLists.put(list);
      return GroceryMapper.toDomain(list, []);
    }
    else {
      const updatedList = await this.appwriteDB.updateDocument(
        appwriteDatabaseId,
        appwriteGroceryListCollectionId,
        id,
        form,
      );
      return GroceryMapper.toDomain(updatedList as any, []);
    }
  }
}