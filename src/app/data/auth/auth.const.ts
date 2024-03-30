import { AuthUser } from '@data/common/auth/auth.types';

export const EMPTY_AUTH_USER: AuthUser = {
  displayName: null,
  email: null,
  phoneNumber: null,
  photoURL: null,
  providerId: '',
  uid: '',
  emailVerified: false,
  isAnonymous: true,
  metadata: {
    creationTime: '',
    lastSignInTime: '',
  },
  providerData: [],
  refreshToken: '',
  tenantId: null,

  async delete() { },
  async getIdToken() {
    return '';
  },
  async getIdTokenResult() {
    return {
      authTime: '',
      expirationTime: '',
      issuedAtTime: '',
      signInProvider: null,
      signInSecondFactor: null,
      token: '',
      claims: {},
    };
  },
  async reload() { },
  toJSON() {
    return this;
  }
};
