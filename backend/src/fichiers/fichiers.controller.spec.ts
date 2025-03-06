import { Test, TestingModule } from '@nestjs/testing';
import { FichiersController } from './fichiers.controller';

// Test du FichiersController
describe('FichiersController', () => {
  let controller: FichiersController;

  // Préparation du module de test et récupération du contrôleur
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FichiersController],
    }).compile();

    controller = module.get<FichiersController>(FichiersController);
  });

  // Vérifie que le contrôleur est bien défini
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
