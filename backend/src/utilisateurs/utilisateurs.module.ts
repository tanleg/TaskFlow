import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilisateursService } from './utilisateurs.service';
import { UtilisateursController } from './utilisateurs.controller';
import { UtilisateurEntity } from '../entities/utilisateur.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [TypeOrmModule.forFeature([UtilisateurEntity]),
    JwtModule.register({
        secret: 'yourSecretKey', // Utilise une clé secrète pour signer les JWT
        signOptions: { expiresIn: '1h' }, // Expiration du token après 1 heure
    })],
    controllers: [UtilisateursController],
    providers: [UtilisateursService],
})
export class UtilisateursModule {}

