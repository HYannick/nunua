export class LoyaltyCard {
  constructor(
    public id: string,
    public name: string,
    public code: string,
    public styles: {
      bgColor: string;
      textColor: string;
      bgDecoration: string;
    },
  ) {}
}