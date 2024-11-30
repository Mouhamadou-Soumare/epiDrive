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
    createdAt: Date;
    updatedAt: Date;
    role: Role;
    imageId?: number;
    image?: Image; // Relation avec une image
    commandes: Commande[];
    recettes: Recette[];
    panier?: Panier; // Un utilisateur peut avoir un panier
    livraisons: Livraison[]; // Relation avec les adresses de livraison
    logs: Log[]; // Relation avec les logs
}

export interface Recette {
    id: number;
    title: string;
    description: string;
    instructions: string;
    image?: string; // Image optionnelle
    user?: User;
    produits: Produit[];
}

export interface Commande {
    id: number;
    status: CommandeStatus; // Utilisation de l'enum pour le statut
    paymentId?: string;
    createdAt: Date;
    userId: number;
    fk_userId: number; // Relation avec un utilisateur
    user: User; // Relation avec l'utilisateur
    quantites: QuantiteCommande[];
    livraison?: Livraison; // Relation avec une adresse de livraison
}

export interface Produit {
    id: number;
    name: string;
    slug: string;
    description: string;
    prix: number;
    imageId?: number;
    image?: Image; // Relation avec une image
    categorieId: number;
    categorie?: Categorie; // Relation avec la catégorie
    quantitePaniers?: QuantitePanier[]; // Produits dans des paniers
    quantiteCommandes?: QuantiteCommande[]; // Produits dans des commandes
    recettes?: Recette[]; // Relation avec des recettes
}

export interface QuantitePanier {
    id: number;
    quantite: number;
    prix: number;
    produitId: number;
    produit: Produit; // Relation avec le produit
    panierId: number;
    panier: Panier; // Relation avec le panier
}

export interface QuantiteCommande {
    id: number;
    quantite: number;
    prix: number;
    produitId: number;
    produit: Produit; // Relation avec le produit
    commandeId: number;
    commande: Commande; // Relation avec la commande
}

export interface Image {
    id: number;
    path: string;
    produits?: Produit[]; // Produits associés à l'image
    categories?: Categorie[]; // Catégories associées à l'image
    users?: User[]; // Utilisateurs associés à l'image
}

export interface Categorie {
    id: number;
    name: string;
    slug: string;
    description?: string; // Description optionnelle
    imageId?: number;
    image?: Image; // Relation avec une image
    parentId?: number;
    parent?: Categorie; // Relation avec une catégorie parent
    subcategories?: Categorie[]; // Sous-catégories
    produits?: Produit[]; // Produits associés à la catégorie
}

export interface Panier {
    id: number;
    fk_userId?: number; // Relation avec un utilisateur
    sessionId?: string; // Identifiant de session optionnel
    user?: User; // Relation avec l'utilisateur
    produits: QuantitePanier[]; // Produits dans le panier
    livraison?: Livraison; // Relation avec une livraison
}

export interface Livraison {
    id: number;
    adresse: string;
    ville: string;
    codePostal: string;
    pays: string;
    fk_userId?: number; // Relation avec un utilisateur
    user?: User; // Relation avec l'utilisateur
    fk_commande?: number; // Relation avec une commande
    commande?: Commande; // Relation avec une commande
    fk_panier?: number; // Relation avec un panier
    panier?: Panier; // Relation avec un panier
}

export interface Log {
    id: number;
    action: string;
    metadata?: Record<string, any>; // Métadonnées pour des informations contextuelles
    createdAt: Date;
    fk_userId: number; // Relation avec un utilisateur
    user: User; // Relation avec l'utilisateur
}
