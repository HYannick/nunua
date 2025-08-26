
import {currencyList} from '@/currency/currencyList.ts';
import {Currency} from '@/currency/Currency.ts';


export class CurrencyService {
  private readonly currencies: Currency[];
  private readonly codeMap: Map<string, Currency>;
  private readonly numberMap: Map<number, Currency>;
  private readonly nameMap: Map<string, Currency>;

  constructor() {
    this.currencies = currencyList.map(data => Currency.fromJson(data));

    this.codeMap = new Map(
      this.currencies.map(currency => [currency.code, currency])
    );

    this.numberMap = new Map(
      this.currencies.map(currency => [currency.number, currency])
    );

    this.nameMap = new Map(
      this.currencies.map(currency => [currency.name, currency])
    );
  }

  getAll(): readonly Currency[] {
    return this.currencies;
  }

  findByCode(code?: string | null): Currency | undefined {
    if (!code) return undefined;
    return this.codeMap.get(code.toUpperCase());
  }

  findByName(name?: string | null): Currency | undefined {
    if (!name) return undefined;
    return this.nameMap.get(name);
  }

  findByNumber(number?: number | null): Currency | undefined {
    if (number === null || number === undefined) return undefined;
    return this.numberMap.get(number);
  }

  findCurrenciesByCode(codes: string[]): Currency[] {
    return codes
      .map(code => this.findByCode(code))
      .filter((currency): currency is Currency => currency !== undefined);
  }

  searchByName(query: string): Currency[] {
    const lowerQuery = query.toLowerCase();
    return this.currencies.filter(currency =>
      currency.name.toLowerCase().includes(lowerQuery) ||
      currency.namePlural.toLowerCase().includes(lowerQuery)
    );
  }

  getPopularCurrencies(): Currency[] {
    const popularCodes = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD'];
    return this.findCurrenciesByCode(popularCodes);
  }
}