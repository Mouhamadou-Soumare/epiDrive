export enum Role {
    USER,
    ADMIN,
    MAGASINIER, // Nouveau rôle ajouté
}

export enum CommandeStatus {
    EN_ATTENTE,
    EN_PREPARATION,
    EXPEDIEE,
    LIVREE,
    ANNULEE, // Enum pour les statuts de commande
}

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    role: Role;
    imageId?: number;
    commandes: Commande[];
    recettes: Recette[];
    livraisons: Livraison[]; // Relation avec les adresses de livraison
    logs: Log[]; // Relation avec les logs
}

export interface Recette {
    id: number;
    title: string;
    description: string;
    instructions: string;
    imageId?: number;
    userId: number;
    produits: Produit[];
}

export interface Commande {
    id: number;
    status: CommandeStatus; // Utilisation de l'enum pour le statut
    paymentId?: string;
    createdAt: Date;
    userId: number;
    quantites: QuantiteCommande[];
    livraison?: Livraison; // Relation avec une adresse de livraison
}

export interface Produit {
    id: number;
    name: string;
    prix: number;
    slug: string;
    description: string;
    imageId?: number;
    categorieId: number;
    quantitePaniers?: QuantitePanier[]; // Produits dans des paniers
    quantiteCommandes?: QuantiteCommande[]; // Produits dans des commandes
}

export interface QuantitePanier {
    id: number;
    quantite: number;
    prix: number;
    produitId: number;
    panierId: number;
}

export interface QuantiteCommande {
    id: number;
    quantite: number;
    prix: number;
    produitId: number;
    commandeId: number;
}

export interface Image {
    id: number;
    path: string;
}

export interface Categorie {
    id: number;
    name: string;
    slug: string;
    description: string;
    imageId?: number;
    parentId?: number;
    subcategories?: Categorie[];
    produits?: Produit[]; // Produits associés à la catégorie
}

export interface Livraison {
    id: number;
    adresse: string;
    ville: string;
    codePostal: string;
    pays: string;
    userId?: number; // Relation avec un utilisateur
    commandeId?: number; // Relation avec une commande
}

export interface Log {
    id: number;
    action: string;
    metadata?: Record<string, any>; // Métadonnées pour des informations contextuelles
    createdAt: Date;
    userId: number; // Relation avec un utilisateur
}
