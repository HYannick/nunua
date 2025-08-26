export interface CreateLoyaltyCardDto {
  name: string;
  code: string;
  styles: {
    bgColor: string;
    textColor: string;
    bgDecoration: string;
  }
}