export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
    MAGASINIER = "MAGASINIER"
}

export enum CommandeStatus {
    EN_ATTENTE = "EN_ATTENTE",
    EN_PREPARATION = "EN_PREPARATION",
    EXPEDIEE = "EXPEDIE",
    LIVREE = "LIVREE",
    ANNULEE = "ANNULEE"
}

export enum Livraison_Type {
    DOMICILE = "DOMICILE",
    DRIVE = "DRIVE",
    EMPORTER = "EMPORTER"
}

export interface CartItem {
    id: number;
    produit: {
      id: number;
      name: string;
      prix: number;
      description: string;
      image: { path: string };
    };
    quantite: number;
  };

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    role: Role;
    imageId?: number;
    image?: Image;
    commandes: Commande[];
    recettes: Recette[];
    panier?: Panier;
    livraisons: Livraison[]; 
    logs: Log[]; 
}

export interface Recette {
    id: number;
    title: string;
    description: string;
    instructions: string;
    image?: string;
    user?: User;
    produits: Produit[];
    ingredients: Ingredient[];
}

export interface Commande {
    error: string;
    id: number;
    status: CommandeStatus;
    paymentId?: string;
    createdAt: Date;
    userId: number;
    fk_userId: number; 
    user: User; 
    quantites: QuantiteCommande[];
    livraison?: Livraison;
    type: Livraison_Type;
}

export interface Produit {
    id: number;
    name: string;
    slug: string;
    description: string;
    prix: number;
    imageId?: number;
    image?: Image; 
    categorieId: number | null; 
    categorie?: Categorie; 
    quantitePaniers?: QuantitePanier[]; 
    quantiteCommandes?: QuantiteCommande[];
    recettes?: Recette[]; 
    stock: number;
}

export interface Ingredient {
    id: number;
    name: string;
    description: string;
    prix: number;
    categorie: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface QuantitePanier {
    id: number;
    quantite: number;
    prix: number;
    produitId: number;
    produit: Produit; 
    panierId: number;
    panier: Panier; 
}

export interface QuantiteCommande {
    id: number;
    quantite: number;
    prix: number;
    produitId: number;
    produit: Produit; 
    commandeId: number;
    commande: Commande;
}

export interface Image {
    id: number;
    path: string;
    produits?: Produit[]; 
    categories?: Categorie[]; 
    users?: User[]; 
}

export interface Categorie {
    id: number;
    name: string;
    slug: string;
    description?: string;
    imageId?: number;
    image?: Image;
    parentId?: number;
    parent?: Categorie; 
    subcategories?: Categorie[]; 
    produits?: Produit[];
}

export interface Panier {
    id: number;
    fk_userId?: number; 
    sessionId?: string;
    user?: User; 
    produits: QuantitePanier[];
    livraison?: Livraison; 
}

export interface Livraison {
    id: number;
    adresse: string;
    ville: string;
    codePostal: string;
    pays: string;
    fk_userId?: number; 
    user?: User; 
    fk_commande?: number; 
    commande?: Commande; 
    fk_panier?: number; 
    panier?: Panier; 
}

export interface Log {
    id: number;
    action: string;
    metadata?: Record<string, any>; 
    createdAt: Date;
    fk_userId: number;
    user: User; 
}
