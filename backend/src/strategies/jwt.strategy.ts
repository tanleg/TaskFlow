import { Injectable, UnauthorizedException } from '@nestjs/common'; 
import { PassportStrategy } from '@nestjs/passport'; 
import { ExtractJwt, Strategy } from 'passport-jwt'; 

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { 
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extraction du token depuis l'en-tête Authorization
      ignoreExpiration: false, // Le token expiré n'est pas ignoré
      secretOrKey: 'yourSecretKey', // Clé secrète pour vérifier le token
    });
  }

  async validate(payload: any) {
    if (!payload || !payload.id || !payload.prenom || !payload.nom || !('admin' in payload)) {
        throw new UnauthorizedException('Token invalide'); // Vérifie la validité des données dans le token
    }
    return { id: payload.id, prenom: payload.prenom, nom: payload.nom, admin: payload.admin }; // Retourne les données utilisateur
  }
}
