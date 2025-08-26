export interface CurrencyData {
  code: string;
  name: string;
  symbol: string;
  flag?: string;
  number: number;
  decimal_digits: number;
  name_plural: string;
  decimal_separator: string;
  thousands_separator: string;
  symbol_on_left: boolean;
  space_between_amount_and_symbol: boolean;
}

export class Currency {
  readonly code: string;
  readonly name: string;
  readonly symbol: string;
  readonly flag?: string;
  readonly number: number;
  readonly decimalDigits: number;
  readonly namePlural: string;
  readonly decimalSeparator: string;
  readonly thousandsSeparator: string;
  readonly symbolOnLeft: boolean;
  readonly spaceBetweenAmountAndSymbol: boolean;

  constructor(data: CurrencyData) {
    this.code = data.code;
    this.name = data.name;
    this.symbol = data.symbol;
    this.flag = data.flag;
    this.number = data.number;
    this.decimalDigits = data.decimal_digits;
    this.namePlural = data.name_plural;
    this.decimalSeparator = data.decimal_separator;
    this.thousandsSeparator = data.thousands_separator;
    this.symbolOnLeft = data.symbol_on_left;
    this.spaceBetweenAmountAndSymbol = data.space_between_amount_and_symbol;
  }

  get isFlagImage(): boolean {
    return this.flag?.endsWith('.png') ?? false;
  }

  static fromJson(json: CurrencyData): Currency {
    return new Currency(json);
  }

  toJson(): CurrencyData {
    return {
      code: this.code,
      name: this.name,
      symbol: this.symbol,
      flag: this.flag,
      number: this.number,
      decimal_digits: this.decimalDigits,
      name_plural: this.namePlural,
      decimal_separator: this.decimalSeparator,
      thousands_separator: this.thousandsSeparator,
      symbol_on_left: this.symbolOnLeft,
      space_between_amount_and_symbol: this.spaceBetweenAmountAndSymbol,
    };
  }
}