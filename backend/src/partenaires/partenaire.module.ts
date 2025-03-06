import { Module } from '@nestjs/common';
import { PartenaireController } from './partenaire.controller';
import { PartenaireService } from './partenaire.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartenaireEntity } from '../entities/partenaire.entity';
import { ProjetEntity } from 'src/entities/projet.entity';
import { EntrepriseEntity } from 'src/entities/entreprise.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/strategies/jwt.strategy';

@Module({
  imports: [
    // Configuration des modules nécessaires pour les entités, authentification, et JWT
    TypeOrmModule.forFeature([PartenaireEntity, ProjetEntity, EntrepriseEntity]), 
    PassportModule.register({ defaultStrategy: 'jwt' }), // Authentification via JWT
    JwtModule.register({
        secret: 'yourSecretKey', // Clé secrète pour signer le JWT
        signOptions: { expiresIn: '1h' }, // Durée d'expiration du token (1 heure)
    }),
  ],
  controllers: [PartenaireController], // Déclaration du contrôleur pour gérer les routes
  providers: [PartenaireService, JwtStrategy], // Déclaration des services nécessaires, y compris la stratégie JWT
  exports: [JwtModule, PassportModule], // Exporte les modules JWT et Passport pour utilisation dans d'autres modules
})
export class PartenaireModule {}
