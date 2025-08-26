import Dexie, {type EntityTable} from 'dexie';
import type {GroceryListEntity} from '@/grocery-list/infrastructure/entities/GroceryListEntity.ts';
import type {GroceryItemEntity} from '@/grocery-list/infrastructure/entities/GroceryItemEntity.ts';
import type {SavedListEntity} from '@/grocery-list/infrastructure/entities/SavedListEntity.ts';
import type {LoyaltyCardEntity} from '@/loyalty-card/infrastructure/entities/LoyaltyCardEntity.ts';

const db = new Dexie('NunuaDatabase') as Dexie & {
  groceryLists: EntityTable<GroceryListEntity, 'id'>
  groceryItems: EntityTable<GroceryItemEntity, 'id'>
  savedLists: EntityTable<SavedListEntity, 'id'>
  loyaltyCards: EntityTable<LoyaltyCardEntity, 'id'> // Adjust type as needed
}

db.version(1).stores({
  groceryLists: 'id, name, createdBy, shareCode, background, description, status, budget',
  groceryItems: 'id, text, checked, listId, addedBy, price, quantity, notes',
  savedLists: 'id, shareCode',
  loyaltyCards: 'id, name, code, styles'
})

// Simple Database Service
export class DatabaseService {
  private static instance: DatabaseService
  private initialized = false

  private constructor() {}

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      await db.open()
      this.initialized = true
      console.log('Dexie database initialized successfully')
    } catch (error) {
      console.error('Database initialization failed:', error)
      throw error
    }
  }

  get db() {
    return db
  }
}

export const databaseService = DatabaseService.getInstance()

export async function initializeDatabase(): Promise<DatabaseService> {
  await databaseService.initialize()
  return DatabaseService.getInstance()
}