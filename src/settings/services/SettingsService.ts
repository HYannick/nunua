export class SettingsService {

  STORAGE_KEYS = {
    DEFAULT_CURRENCY: 'defaultCurrency',
    THEME: 'theme',
    LANGUAGE: 'language'
  } as const

  async getDefaultCurrency(): Promise<string> {
    try {
      return localStorage.getItem(this.STORAGE_KEYS.DEFAULT_CURRENCY) || 'USD';
    } catch (error) {
      console.error('Error getting default currency:', error)
      return 'USD'
    }
  }

  async setDefaultCurrency(currencyToSet: string): Promise<void> {
    try {
      localStorage.setItem(this.STORAGE_KEYS.DEFAULT_CURRENCY, currencyToSet)
    } catch (error) {
      throw new Error('Failed to save default currency')
    }
  }


  async getTheme(): Promise<string> {
    try {
      return localStorage.getItem(this.STORAGE_KEYS.THEME) || 'light';
    } catch (error) {
      console.error('Error getting theme:', error)
      return 'light'
    }
  }


  async setTheme(theme: string): Promise<void> {
    try {
      localStorage.setItem(this.STORAGE_KEYS.THEME, theme)
    } catch (error) {
      console.error('Error setting theme:', error)
      throw new Error('Failed to save theme preference')
    }
  }

  async getLanguage(): Promise<string> {
    try {
      return localStorage.getItem(this.STORAGE_KEYS.LANGUAGE) || 'en-GB';
    } catch (error) {
      console.error('Error getting language:', error)
      return 'en-GB'
    }
  }

  async setLanguage(language: string): Promise<void> {
    try {
      localStorage.setItem(this.STORAGE_KEYS.LANGUAGE, language)
    } catch (error) {
      console.error('Error setting language:', error)
      throw new Error('Failed to save language preference')
    }
  }
} 