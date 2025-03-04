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
  imports: [TypeOrmModule.forFeature([PartenaireEntity, ProjetEntity, EntrepriseEntity]),
  PassportModule.register({ defaultStrategy: 'jwt' }),
      JwtModule.register({
          secret: 'yourSecretKey', // Utilise une clé secrète pour signer les JWT
          signOptions: { expiresIn: '1h' }, // Expiration du token après 1 heure
      })],
  controllers: [PartenaireController],
  providers: [PartenaireService, JwtStrategy],
  exports: [JwtModule, PassportModule],
  
})
export class PartenaireModule {}
