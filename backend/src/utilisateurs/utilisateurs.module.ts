import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilisateursService } from './utilisateurs.service';
import { UtilisateursController } from './utilisateurs.controller';
import { UtilisateurEntity } from '../entities/utilisateur.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../strategies/jwt.strategy';

// Déclaration du module Utilisateurs
@Module({
    imports: [
        TypeOrmModule.forFeature([UtilisateurEntity]), // Accès à l'entité Utilisateur
        PassportModule.register({ defaultStrategy: 'jwt' }), // Authentification JWT
        JwtModule.register({
            secret: 'yourSecretKey', // Clé secrète pour signer les tokens
            signOptions: { expiresIn: '1h' }, // Expiration du token
        }),
    ],
    controllers: [UtilisateursController], // Gestion des routes Utilisateurs
    providers: [UtilisateursService, JwtStrategy], // Services et stratégie JWT
    exports: [JwtModule, PassportModule], // Export pour réutilisation
})
export class UtilisateursModule {}
