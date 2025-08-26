export class GroceryItem {
  constructor(
    public id: string,
    public text: string,
    public checked: boolean,
    public listId: string,
    public addedBy: string,
    public price?: number,
    public quantity?: number,
    public notes?: string,
  ) {
  }
}