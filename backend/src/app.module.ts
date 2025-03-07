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
import { PartenaireModule } from './partenaires/partenaire.module';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    //Connexion à la base de données
    TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'root',
        database: 'taskflow',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: true
    }),

    ConfigModule.forRoot({
        isGlobal: true, // Rend les variables accessibles dans toute l'application
    }),
    
    TypeOrmModule.forFeature([UtilisateurEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'yourSecretKey', // Utiliser une clé sécurisée dans un fichier d'env
      signOptions: { expiresIn: '1h' },
    }),

    UtilisateursModule,
    EvenementsModule,
    ProjetModule,
    FichiersModule,
    PartenaireModule,
    ChatModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}