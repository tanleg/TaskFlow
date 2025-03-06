import { Test, TestingModule } from '@nestjs/testing';
import { ProjetService } from './projet.service';

describe('ProjetService', () => {
  let service: ProjetService;

  // Avant chaque test, le module de test est compilé et le service est récupéré
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjetService], // Enregistrement du service à tester
    }).compile();

    service = module.get<ProjetService>(ProjetService); // Récupération du service
  });

  // Test basique pour vérifier si le service est bien défini
  it('should be defined', () => {
    expect(service).toBeDefined(); // Vérifie que le service est correctement instancié
  });
});
