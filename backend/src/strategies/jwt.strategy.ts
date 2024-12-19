import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Ou cookies si nécessaire
      ignoreExpiration: false,
      secretOrKey: 'yourSecretKey', // Clé secrète utilisée pour signer les tokens
    });
  }


  async validate(payload: any) {
    if (!payload || !payload.id) {
        throw new UnauthorizedException('Token invalide');
    }
    return { id: payload.id }; // Retourne les données nécessaires
  }
}
