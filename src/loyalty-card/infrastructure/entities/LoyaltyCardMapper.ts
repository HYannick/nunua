import {LoyaltyCard} from '@/loyalty-card/domain/LoyaltyCard.ts';
import type {LoyaltyCardEntity} from '@/loyalty-card/infrastructure/entities/LoyaltyCardEntity.ts';

export class LoyaltyCardMapper {
  static toPersistance(loyaltyCard: LoyaltyCard): LoyaltyCardEntity {
    return {
      id: loyaltyCard.id,
      name: loyaltyCard.name,
      code: loyaltyCard.code,
      styles: JSON.stringify(loyaltyCard.styles),
    };
  }

  static toDomain(entity: LoyaltyCardEntity): LoyaltyCard {
    return new LoyaltyCard(
      entity.id,
      entity.name,
      entity.code,
      JSON.parse(entity.styles)
    );
  }
}