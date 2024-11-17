export enum Role {
    USER,
    ADMIN,
}

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    role: Role;
    imageId?: number;
    commandes: Commande[];
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
    status: string;
    paymentId?: string;
    createdAt: Date;
    userId: number;
    quantites: QuantiteCommande[];
}

export interface Produit {
    id: number;
    name: string;
    prix: number;
    slug: string;
    description: string;
    imageId?: number;
    categorieId: number;
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
}
