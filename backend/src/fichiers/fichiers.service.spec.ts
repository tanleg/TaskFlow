import { Test, TestingModule } from '@nestjs/testing';
import { FichiersService } from './fichiers.service';

describe('FichiersService', () => {
  let service: FichiersService;

  // Avant chaque test, on initialise le service à tester
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FichiersService], // On déclare le service à tester
    }).compile();

    service = module.get<FichiersService>(FichiersService); // On récupère le service
  });

  // Test basique pour vérifier que le service est bien défini
  it('should be defined', () => {
    expect(service).toBeDefined(); // Vérifie si le service est correctement créé
  });
});
