import type {LocalUser} from '@/user/domain/User.ts';

export class UserService {
  private static readonly USER_KEY = 'user'

  async fetchUser(): Promise<LocalUser | null> {
    const userData = localStorage.getItem(UserService.USER_KEY)
    if (!userData) return null

    try {
      return JSON.parse(userData) as LocalUser
    } catch {
      localStorage.removeItem(UserService.USER_KEY)
      return null
    }
  }

  async saveUser(username: string, avatar: string): Promise<LocalUser> {
    const userData: LocalUser = {
      id: crypto.randomUUID(),
      username,
      avatar
    }

    localStorage.setItem(UserService.USER_KEY, JSON.stringify(userData))
    return userData
  }

  async updateUser(updates: Partial<Omit<LocalUser, 'id'>>): Promise<LocalUser> {
    const existingUser = await this.fetchUser()
    if (!existingUser) {
      throw new Error('No user found to update')
    }

    const updatedUser = { ...existingUser, ...updates }
    localStorage.setItem(UserService.USER_KEY, JSON.stringify(updatedUser))

    return updatedUser
  }

  async clearUser(): Promise<void> {
    localStorage.removeItem(UserService.USER_KEY)
  }
}