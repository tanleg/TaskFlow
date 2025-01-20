import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilisateursModule } from './utilisateurs/utilisateurs.module';
import { UtilisateurEntity } from './entities/utilisateur.entity';
import { EvenementsModule } from './evenements/evenements.module';
import { ProjetModule } from './projet/projet.module';
import { FichiersModule } from './fichiers/fichiers.module';

@Module({
  imports: [

    TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'alexis',
        password: 'Y3wyp9h/',
        database: 'taskflow',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: true
    }),
    
    TypeOrmModule.forFeature([UtilisateurEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'yourSecretKey', // Utilisez une clé sécurisée dans un fichier d'env
      signOptions: { expiresIn: '1h' },
    }),

    UtilisateursModule,
    EvenementsModule,
    ProjetModule,
    FichiersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}