import { UserRole } from '../interfaces/auth.interfaces';

export class User {
  constructor(
    public readonly id: string,
    public username: string,
    public firstName: string | null,
    public lastName: string | null,
    public email: string,
    public token: string,
    public tokenExpirationDate: Date,
    public refreshToken: string,
    public refreshTokenExpirationDate: Date,
    public role: UserRole
  ) {}
}
