import { Test, TestingModule } from '@nestjs/testing';
import { ProjetController } from './projet.controller';

describe('ProjetController', () => {
  let controller: ProjetController;

  // Avant chaque test, compile le module avec le controller et l'assigne à la variable `controller`
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjetController], // Déclare le contrôleur à tester
    }).compile();

    // Récupère l'instance du controller
    controller = module.get<ProjetController>(ProjetController);
  });

  // Vérifie si le controller a bien été défini
  it('should be defined', () => {
    expect(controller).toBeDefined(); // Le test passe si `controller` est défini
  });
});
