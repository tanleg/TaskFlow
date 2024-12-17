export type Fichier = {
    id: number;
    nom: string;
    url: string;
    date_upload: Date;
    version: number;
    id_projet: number;
    id_utilisateur: number;
    id_partenaire: number;
};