import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    
    origin: ['http://localhost:5173', 'http://192.168.1.10:5173', 'http://192.168.41.238:5173'], // Origine autorisée
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Méthodes autorisées
    credentials: true, // Autorise les cookies ou l'authentification avec session
  });
  //L'application écoute sur le port 3000
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
