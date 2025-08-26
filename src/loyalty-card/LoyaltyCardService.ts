import type {DatabaseService} from '@/databaseService.ts';
import type {CreateLoyaltyCardDto} from '@/loyalty-card/dtos/CreateLoyaltyCardDto.ts';
import {LoyaltyCardMapper} from '@/loyalty-card/infrastructure/entities/LoyaltyCardMapper.ts';
import type {LoyaltyCardEntity} from '@/loyalty-card/infrastructure/entities/LoyaltyCardEntity.ts';

export class LoyaltyCardService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  async saveLoyaltyCard(createLoyaltyCardDto: CreateLoyaltyCardDto) {
    const loyaltyCard: LoyaltyCardEntity = {
      id: crypto.randomUUID(),
      name: createLoyaltyCardDto.name,
      code: createLoyaltyCardDto.code,
      styles: JSON.stringify(createLoyaltyCardDto.styles),
    };

    return this.databaseService.db.loyaltyCards.add(loyaltyCard);
  }

  async getLoyaltyCardById(id: string) {
    return this.databaseService.db.loyaltyCards.get(id);
  }

  async updateLoyaltyCard(id: string, updateData: Partial<CreateLoyaltyCardDto>) {
    const updatedCard = {
      ...updateData,
      styles: updateData.styles ? JSON.stringify(updateData.styles) : undefined,
    }
    return this.databaseService.db.loyaltyCards.update(id, updatedCard);
  }

  async deleteLoyaltyCard(id: string) {
    return this.databaseService.db.loyaltyCards.delete(id);
  }

  async getAllLoyaltyCards() {
    const loyaltyCards = await this.databaseService.db.loyaltyCards.toArray();
    return loyaltyCards.map(loyaltyCard => LoyaltyCardMapper.toDomain(loyaltyCard))
  }
}