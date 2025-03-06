import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjetEntity } from '../entities/projet.entity';
import { UtilisateurProjetEntity } from 'src/entities/utilisateur_projet.entity';
import { AjoutSupprUtilisateurProjetDto } from './dto/ajout-suppr-utilisateur-projet.dto';
import { PartenaireEntity } from 'src/entities/partenaire.entity';

@Injectable()
export class ProjetService {
  constructor(
    // Injection des dépendances pour les entités Projet, UtilisateurProjet et Partenaire
    @InjectRepository(ProjetEntity)
    private readonly projetRepository: Repository<ProjetEntity>,

    @InjectRepository(UtilisateurProjetEntity)
    private readonly utilisateurProjetRepository: Repository<UtilisateurProjetEntity>,

    @InjectRepository(PartenaireEntity)
    private readonly partenaireRepository: Repository<PartenaireEntity>,
  ) {}

  // Création d'un nouveau projet
  async create(createProjectDto: CreateProjectDto, utilisateurId: number) {
    // Création d'un objet projet avec les données fournies dans le DTO
    const projet = this.projetRepository.create({
      nom: createProjectDto.nom,
      description: createProjectDto.description,
      date_creation: new Date(),
      public: createProjectDto.public || false, // Par défaut, un projet est privé
      statut: 'En cours', // Le statut est 'En cours' au moment de la création
    });

    // Sauvegarde du projet dans la base de données
    const savedProjet = await this.projetRepository.save(projet);

    // Ajout de l'utilisateur comme chef de projet
    await this.utilisateurProjetRepository.save({
      id: savedProjet.id,
      id_utilisateur: utilisateurId,
      chef: true, // L'utilisateur est chef de projet
      visiteur: false, // L'utilisateur n'est pas un visiteur
    });

    // Retourne le projet nouvellement créé
    return savedProjet;
  }

  // Liste des projets associés à un chercheur/utilisateur
  async liste_projets_chercheur(utilisateurId: number) {
    const utilisateurProjets = await this.utilisateurProjetRepository.find({
      where: { id_utilisateur: utilisateurId }, // Recherche par utilisateur
      relations: ['projet'], // On récupère aussi les projets associés
    });

    // Retourne uniquement la liste des projets associés à l'utilisateur
    return utilisateurProjets.map(up => up.projet);
  }

  // Liste des projets associés à un partenaire
  async liste_projets_partenaire(partenaireId: number) {
    const partenaireProjets = await this.partenaireRepository.find({
      where: { id: partenaireId },
      relations: ['projet'], // On récupère les projets associés à ce partenaire
    });

    // Retourne la liste des projets associés au partenaire
    return partenaireProjets.map(partenaire => partenaire.projet);
  }

  // Récupère tous les projets
  async findAll(): Promise<ProjetEntity[]> {
    return this.projetRepository.find(); // Retourne tous les projets
  }

  // Récupère uniquement les projets publics
  async getProjetsPublics(): Promise<ProjetEntity[]> {
    return this.projetRepository
      .createQueryBuilder('projet') // Utilisation de QueryBuilder pour filtrer les projets publics
      .where('projet.public = :isPublic', { isPublic: true })
      .getMany(); // Retourne tous les projets publics
  }

  // Ajoute un utilisateur à un projet
  async ajouterUtilisateurProjet(ajoutSupprUtilisateurProjetDto: AjoutSupprUtilisateurProjetDto): Promise<{ message: string }> {
    const { id, id_utilisateur } = ajoutSupprUtilisateurProjetDto;

    // Création d'une nouvelle entrée d'utilisateur dans le projet
    const ajt_utilisateur = this.utilisateurProjetRepository.create({
      utilisateur: { id: id_utilisateur },
      projet: { id: id },
      chef: false, // L'utilisateur est ajouté comme un simple utilisateur, pas comme chef
      visiteur: false, // Par défaut, l'utilisateur n'est pas un visiteur
    });

    // Sauvegarde dans la base de données
    await this.utilisateurProjetRepository.save(ajt_utilisateur);

    // Retourne un message de succès
    return { message: 'Utilisateur ajouté au projet' };
  }

  // Supprime un utilisateur d'un projet
  async supprUtilisateurProjet(ajoutSupprUtilisateurProjetDto: AjoutSupprUtilisateurProjetDto): Promise<{ message: string }> {
    const { id, id_utilisateur } = ajoutSupprUtilisateurProjetDto;

    // Recherche de l'association entre l'utilisateur et le projet
    const utilisateurProjet = await this.utilisateurProjetRepository.findOne({
      where: {
        utilisateur: { id: id_utilisateur },
        projet: { id: id },
      },
    });

    if (!utilisateurProjet) {
      throw new NotFoundException('Utilisateur non trouvé dans ce projet.'); // Lancer une exception si l'utilisateur n'est pas trouvé
    }

    // Suppression des associations de l'utilisateur avec des jalons, livrables et tâches
    await this.utilisateurProjetRepository.query(`
      DELETE FROM utilisateur_jalon
      USING jalon
      WHERE utilisateur_jalon.id_utilisateur = $1
      AND utilisateur_jalon.id = (
          SELECT id
          FROM jalon
          WHERE id_projet = $2
      );
    `, [id_utilisateur, id]);

    await this.utilisateurProjetRepository.query(`
      DELETE FROM utilisateur_livrable
      USING livrable
      WHERE utilisateur_livrable.id_utilisateur = $1
      AND utilisateur_livrable.id = (
          SELECT id
          FROM livrable
          WHERE id_projet = $2
      );
    `, [id_utilisateur, id]);

    await this.utilisateurProjetRepository.query(`
      UPDATE tache
      SET id_utilisateur = null
      WHERE id_utilisateur = $1
      AND id_projet = $2;
    `, [id_utilisateur, id]);

    // Supprime l'association de l'utilisateur au projet
    await this.utilisateurProjetRepository.remove(utilisateurProjet);

    // Retourne un message de succès
    return { message: 'Utilisateur supprimé du projet avec succès.' };
  }

  // Récupère tous les utilisateurs d'un projet spécifique
  async findUtilisateursDeProjet(id_projet: number): Promise<any[]> {
    const utilisateurProjets = await this.utilisateurProjetRepository.find({
      where: { projet: { id: id_projet } }, // Recherche par projet
      relations: ['utilisateur', 'projet'], // Inclut les relations nécessaires
    });

    // Retourne une liste des utilisateurs associés au projet, avec leurs rôles (chef, visiteur)
    return utilisateurProjets.map((utilisateurProjet) => ({
      utilisateur: utilisateurProjet.utilisateur,
      chef: utilisateurProjet.chef,
      visiteur: utilisateurProjet.visiteur,
    }));
  }

  // Déclare un utilisateur comme chef de projet
  async declarerChef(id_user: number, id_projet: number) {
    this.utilisateurProjetRepository.update(
      { id: id_projet, id_utilisateur: id_user }, // Recherche par projet et utilisateur
      { chef: true }, // Définit l'utilisateur comme chef
    );
  }

  // Enlève un utilisateur du rôle de chef dans un projet
  async enleverChef(id_user: number, id_projet: number) {
    this.utilisateurProjetRepository.update(
      { id: id_projet, id_utilisateur: id_user }, // Recherche par projet et utilisateur
      { chef: false }, // Supprime le rôle de chef
    );
  }

  // Vérifie si un utilisateur est chef dans un projet
  async isChef(id_projet: number, id_utilisateur: number): Promise<boolean> {
    const utilisateurProjet = await this.utilisateurProjetRepository.findOne({
      where: { id: id_projet, id_utilisateur },
    });

    return utilisateurProjet ? utilisateurProjet.chef : false; // Retourne true si l'utilisateur est chef, sinon false
  }
}
