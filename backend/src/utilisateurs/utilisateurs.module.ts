import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilisateursService } from './utilisateurs.service';
import { UtilisateursController } from './utilisateurs.controller';
import { UtilisateurEntity } from '../entities/utilisateur.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Module({
    imports: [TypeOrmModule.forFeature([UtilisateurEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
        secret: 'yourSecretKey', // Utilise une clé secrète pour signer les JWT
        signOptions: { expiresIn: '1h' }, // Expiration du token après 1 heure
    })],
    controllers: [UtilisateursController],
    providers: [UtilisateursService, JwtStrategy],
    exports: [JwtModule, PassportModule],
})
export class UtilisateursModule {}

