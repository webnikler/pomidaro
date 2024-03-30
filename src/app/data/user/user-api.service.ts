import { Injectable, inject } from '@angular/core';
import { User } from './user.types';
import { ApiProvider } from '@data/common/api/api.provider';
import { AuthProvider } from '@data/common/auth/auth.provider';

@Injectable()
export class UserApiService {
  private readonly api = inject(ApiProvider);
  private readonly auth = inject(AuthProvider);

  private get authId() {
    return this.auth.authId;
  }

  async getUser(): Promise<User> {
    if (!this.authId) throw new Error('Вы не авторизованы!');
    const [user] = await this.api.getCollection<User>('users/', { authId: this.authId });
    if (!user) throw new Error('Пользователь не найден!');

    return user;
  }

  async updateUser() {

  }

  async deleteUser() {

  }

  async createUser() {

  }
}
