export const categories = [
    {
      title: "Produits régionaux et locaux",
      description:
        "Découvrez les produits authentiques de nos régions, avec une traçabilité complète pour vous garantir le meilleur de chez nous. Chaque produit est sélectionné avec soin pour refléter la richesse de nos terroirs.",

        subcategories: [
        {
          name: "Fruits de nos régions",
          slug: "fruits-de-nos-regions",
          produits: [
            {
              name: "Pommes de Normandie",
              description:
                "Pommes fraîches et croquantes issues des vergers de Normandie, cultivées selon les méthodes traditionnelles.",
              price: 3.99,
            },
            {
              name: "Poires du Limousin",
              description:
                "Poires juteuses et sucrées, idéales pour les desserts ou à consommer nature.",
              price: 4.5,
            },
            {
              name: "Pruneaux d’Agen",
              description:
                "Pruneaux d’Agen moelleux et sucrés, parfaits pour vos collations et recettes gourmandes.",
              price: 5.99,
            },
            {
              name: "Cerises de Provence",
              description:
                "Cerises rouges et juteuses récoltées en Provence, idéales pour les clafoutis et desserts.",
              price: 6.99,
            },
            {
              name: "Châtaignes d’Ardèche",
              description:
                "Châtaignes grillées, parfaites pour l’automne, avec une saveur douce et délicate.",
              price: 7.5,
            },
          ],
        },
        {
          name: "Fromages de nos régions",
          slug: "fromages-de-nos-regions",
          produits: [
            {
              name: "Camembert de Normandie AOP",
              description:
                "Camembert au lait cru, produit selon la tradition Normande avec une pâte fondante.",
              price: 5.99,
            },
            {
              name: "Roquefort AOP",
              description:
                "Roquefort AOP, fromage à pâte persillée produit dans les caves naturelles de l’Aveyron.",
              price: 7.5,
            },
            {
              name: "Comté 18 mois",
              description:
                "Comté affiné 18 mois, aux arômes fruités et subtils, idéal pour vos plateaux de fromages.",
              price: 8.99,
            },
            {
              name: "Reblochon de Savoie",
              description:
                "Reblochon fermier au lait cru, parfait pour une tartiflette ou à déguster avec du pain frais.",
              price: 6.99,
            },
            {
              name: "Chèvre frais du Poitou",
              description:
                "Fromage de chèvre frais, doux et crémeux, produit artisanalement dans la région du Poitou.",
              price: 4.99,
            },
          ],
        },
        {
          name: "Charcuteries régionales",
          slug: "charcuteries-regionales",
          produits: [
            {
              name: "Saucisson sec d’Auvergne",
              description:
                "Saucisson sec traditionnel, fabriqué à partir de porc élevé en plein air dans le Massif Central.",
              price: 7.99,
            },
            {
              name: "Jambon de Bayonne IGP",
              description:
                "Jambon de Bayonne affiné selon la tradition, avec un goût légèrement salé et raffiné.",
              price: 12.99,
            },
            {
              name: "Rillettes du Mans",
              description:
                "Rillettes de porc fondantes et onctueuses, parfaites pour vos toasts ou sandwichs.",
              price: 6.99,
            },
            {
              name: "Andouille de Guémené",
              description:
                "Andouille de Guémené, une charcuterie fumée traditionnelle de Bretagne.",
              price: 9.5,
            },
            {
              name: "Pâté Basque",
              description:
                "Pâté traditionnel du Pays Basque, relevé avec des piments doux pour un goût unique.",
              price: 8.99,
            },
          ],
        },
        {
          name: "Vins régionaux",
          slug: "vins-regionaux",
          produits: [
            {
              name: "Bordeaux Supérieur",
              description:
                "Vin rouge puissant, parfait pour accompagner des viandes rouges et fromages.",
              price: 12.99,
            },
            {
              name: "Sancerre Blanc",
              description:
                "Vin blanc sec et minéral, idéal avec des fruits de mer et du poisson.",
              price: 14.99,
            },
            {
              name: "Chablis",
              description:
                "Vin blanc de Bourgogne, aux arômes de fruits blancs et de fleurs, parfait avec des crustacés.",
              price: 19.99,
            },
            {
              name: "Côtes du Rhône",
              description:
                "Vin rouge généreux et épicé, excellent pour accompagner des plats mijotés et des grillades.",
              price: 11.5,
            },
            {
              name: "Rosé de Provence",
              description:
                "Vin rosé frais et fruité, parfait pour les repas estivaux et les apéritifs.",
              price: 9.99,
            },
          ],
        },
        {
          name: "Épicerie fine régionale",
          slug: "epicerie-fine-regionale",
          produits: [
            {
              name: "Miel de Lavande de Provence",
              description:
                "Miel doux et floral, produit par des apiculteurs de Provence.",
              price: 7.99,
            },
            {
              name: "Confiture de Mirabelles de Lorraine",
              description:
                "Confiture artisanale à base de mirabelles, parfaite pour les petits-déjeuners gourmands.",
              price: 6.5,
            },
            {
              name: "Huile d’Olive de Nyons",
              description:
                "Huile d’olive extra vierge, produite dans les oliveraies de Nyons.",
              price: 14.99,
            },
            {
              name: "Piment d’Espelette AOP",
              description:
                "Piment d’Espelette, une épice douce et parfumée qui relève vos plats avec finesse.",
              price: 5.99,
            },
            {
              name: "Sel de Guérande",
              description:
                "Sel de Guérande récolté à la main, non raffiné, parfait pour toutes vos préparations culinaires.",
              price: 4.99,
            },
          ],
        },
      ],
    },
    {
      title: "Marché frais",
      description:
        "Découvrez une sélection de produits frais de saison, directement issus de nos producteurs locaux. Chaque produit est sélectionné pour sa qualité et sa fraîcheur, afin de garantir des saveurs authentiques à chaque repas.",
        subcategories: [
        {
          name: "Fruits et Légumes",
          slug: "fruits-et-legumes",
          description:
            "Les meilleurs produits de saison directement de nos producteurs pour des repas sains et équilibrés.",
          produits: [
            {
              name: "Pommes Bio",
              description:
                "Pommes fraîches et biologiques, issues de vergers locaux certifiés bio.",
              price: 3.49,
            },
            {
              name: "Carottes de saison",
              description:
                "Carottes croquantes, cultivées sans pesticides, parfaites pour les soupes ou à croquer.",
              price: 2.99,
            },
            {
              name: "Salade Verte Bio",
              description:
                "Salade fraîche et croquante, cultivée sans produits chimiques.",
              price: 2.5,
            },
            {
              name: "Tomates Cœur de Bœuf",
              description:
                "Tomates charnues et savoureuses, parfaites pour les salades ou à cuire.",
              price: 4.99,
            },
            {
              name: "Poivrons tricolores",
              description:
                "Un assortiment de poivrons rouges, verts et jaunes, riches en vitamines.",
              price: 3.99,
            },
            {
              name: "Champignons de Paris",
              description:
                "Champignons frais, cultivés localement, parfaits pour accompagner vos plats.",
              price: 4.5,
            },
          ],
        },
        {
          name: "Viandes et Poissons",
          slug: "viandes-et-poissons",
          description:
            "Une sélection rigoureuse de viandes locales et poissons frais, préparés avec soin pour vos repas gourmands.",
          produits: [
            {
              name: "Poulet Fermier",
              description:
                "Poulet fermier élevé en plein air, tendre et juteux, idéal pour un repas en famille.",
              price: 12.99,
            },
            {
              name: "Saumon Atlantique",
              description:
                "Saumon frais issu des pêcheries durables de l’Atlantique, parfait pour les grillades.",
              price: 19.99,
            },
            {
              name: "Côte de Bœuf",
              description:
                "Côte de bœuf de qualité supérieure, idéale pour les barbecues.",
              price: 25.99,
            },
            {
              name: "Darnes de Thon",
              description:
                "Thon frais pêché à la ligne, à griller ou poêler pour un plat raffiné.",
              price: 17.99,
            },
            {
              name: "Agneau Bio",
              description:
                "Viande d’agneau biologique, tendre et savoureuse, parfaite pour les plats mijotés.",
              price: 22.5,
            },
          ],
        },
        {
          name: "Crèmerie et Produits laitiers",
          slug: "cremerie-et-produits-laitiers",
          description:
            "Une sélection de produits laitiers frais et crémeux, directement issus des fermes locales.",
          produits: [
            {
              name: "Lait Demi-écrémé",
              description:
                "Lait demi-écrémé, fraîchement collecté et embouteillé dans une ferme locale.",
              price: 1.5,
            },
            {
              name: "Yaourt Nature Bio",
              description:
                "Yaourt nature biologique, sans additifs ni conservateurs.",
              price: 0.99,
            },
            {
              name: "Crème Fraîche Épaisse",
              description:
                "Crème fraîche épaisse, parfaite pour vos plats et desserts.",
              price: 2.5,
            },
            {
              name: "Beurre demi-sel",
              description:
                "Beurre demi-sel fabriqué de manière artisanale, idéal pour tartiner ou cuisiner.",
              price: 2.99,
            },
            {
              name: "Fromage blanc fermier",
              description:
                "Fromage blanc frais et onctueux, idéal en dessert ou avec des fruits frais.",
              price: 3.5,
            },
          ],
        },
        {
          name: "Charcuterie et Traiteur",
          slug: "charcuterie-et-traiteur",
          description:
            "Un assortiment de charcuterie fine et de plats traiteur préparés avec passion pour satisfaire vos papilles.",
          produits: [
            {
              name: "Jambon de Pays",
              description:
                "Jambon de pays affiné, tranché fin pour une saveur intense et authentique.",
              price: 4.99,
            },
            {
              name: "Terrine de Campagne",
              description:
                "Terrine de campagne faite maison, idéale en entrée ou pour un apéritif convivial.",
              price: 6.5,
            },
            {
              name: "Saucisse sèche artisanale",
              description:
                "Saucisse sèche fabriquée de manière artisanale avec un goût intense.",
              price: 8.99,
            },
            {
              name: "Quiche Lorraine",
              description:
                "Quiche Lorraine artisanale, préparée avec des ingrédients frais et locaux.",
              price: 7.99,
            },
            {
              name: "Salade de lentilles et saumon fumé",
              description:
                "Plat traiteur frais, idéal pour un repas équilibré et savoureux.",
              price: 9.5,
            },
          ],
        },
      ],
    },
  
    {
      title: "Bio et Ecologie",
      description:
        "Un large choix de produits respectueux de l’environnement, pour une consommation plus responsable et durable. Nos produits bio sont issus de l’agriculture biologique certifiée, garantissant une qualité optimale pour vous et votre famille.",
        subcategories: [
        {
          name: "Fruits et Légumes Bio",
          slug: "fruits-et-legumes-bio",
          description:
            "Découvrez une sélection de fruits et légumes biologiques, cultivés sans pesticides ni produits chimiques pour des repas sains et naturels.",
          produits: [
            {
              name: "Carottes Bio",
              description:
                "Carottes bio cultivées sans pesticides, idéales pour les soupes ou à croquer crues.",
              price: 2.99,
            },
            {
              name: "Tomates Bio",
              description:
                "Tomates biologiques juteuses, parfaites pour les salades ou à cuire.",
              price: 3.49,
            },
            {
              name: "Pommes de terre Bio",
              description:
                "Pommes de terre bio, parfaites pour accompagner vos plats de viande ou poissons.",
              price: 3.99,
            },
            {
              name: "Courgettes Bio",
              description:
                "Courgettes fraîches et croquantes, cultivées en pleine terre sans produits chimiques.",
              price: 4.5,
            },
            {
              name: "Poires Bio",
              description:
                "Poires bio sucrées, idéales pour les desserts ou à consommer en collation.",
              price: 4.2,
            },
          ],
        },
        {
          name: "Viandes Bio",
          slug: "viandes-bio",
          description:
            "Une sélection de viandes issues d’élevages biologiques, pour des repas gourmands et responsables.",
          produits: [
            {
              name: "Poulet Bio",
              description:
                "Poulet fermier biologique, élevé en plein air avec une alimentation 100% bio.",
              price: 14.99,
            },
            {
              name: "Bœuf Bio",
              description:
                "Viande de bœuf bio, tendre et savoureuse, idéale pour les grillades ou les rôtis.",
              price: 22.5,
            },
            {
              name: "Agneau Bio",
              description:
                "Viande d’agneau bio, parfaite pour les plats mijotés ou les rôtis.",
              price: 24.99,
            },
            {
              name: "Saucisses Bio",
              description:
                "Saucisses fraîches bio, préparées avec des ingrédients naturels, sans conservateurs.",
              price: 9.99,
            },
          ],
        },
        {
          name: "Produits laitiers Bio",
          slug: "produits-laitiers-bio",
          description:
            "Des produits laitiers bio de grande qualité, pour une alimentation saine et naturelle.",
          produits: [
            {
              name: "Lait Bio",
              description: "Lait biologique demi-écrémé, sans OGM ni additifs.",
              price: 1.8,
            },
            {
              name: "Yaourt Nature Bio",
              description:
                "Yaourt nature biologique, fabriqué à partir de lait frais de fermes bio.",
              price: 0.99,
            },
            {
              name: "Crème Fraîche Bio",
              description:
                "Crème fraîche épaisse bio, idéale pour cuisiner ou accompagner vos plats.",
              price: 2.99,
            },
            {
              name: "Beurre Bio",
              description:
                "Beurre bio demi-sel, fabriqué à partir de lait biologique, parfait pour tartiner.",
              price: 3.5,
            },
            {
              name: "Fromage de Chèvre Bio",
              description:
                "Fromage de chèvre bio, doux et crémeux, idéal pour vos salades et apéritifs.",
              price: 5.99,
            },
          ],
        },
        {
          name: "Boissons Bio",
          slug: "boissons-bio",
          description:
            "Une sélection de boissons biologiques pour vous hydrater de manière naturelle et responsable.",
          produits: [
            {
              name: "Jus de pomme Bio",
              description:
                "Jus de pomme bio, sans sucres ajoutés, élaboré à partir de pommes 100% biologiques.",
              price: 3.5,
            },
            {
              name: "Thé Vert Bio",
              description:
                "Thé vert biologique récolté dans des fermes durables, idéal pour une pause saine.",
              price: 4.99,
            },
            {
              name: "Café Bio en grains",
              description:
                "Café en grains bio, issu de l’agriculture biologique, pour un goût riche et intense.",
              price: 6.99,
            },
            {
              name: "Jus d’orange Bio",
              description:
                "Jus d’orange bio pressé à froid, sans additifs, riche en vitamine C.",
              price: 4.5,
            },
            {
              name: "Smoothie Bio aux Fruits Rouges",
              description:
                "Smoothie bio aux fruits rouges, sans sucres ajoutés, idéal pour un petit-déjeuner sain.",
              price: 5.5,
            },
          ],
        },
      ],
    },

    {
      title: "Épicerie Salée",
      description:
        "Découvrez une sélection d'épicerie salée pour vos plats gourmands. Des produits de qualité pour préparer vos recettes salées favorites, que ce soit des pâtes, sauces, huiles ou épices.",
      subcategories: [
        {
  "name": "Pâtes, Riz et Féculents",
  "slug": "pates-riz-feculents",
  "description": "Une sélection de pâtes, riz et féculents pour accompagner tous vos plats, qu'ils soient italiens, asiatiques ou traditionnels. Parfaits pour une cuisine variée et savoureuse.",
  "produits": [
    {
      "name": "Spaghetti Bio",
      "description": "Spaghetti biologiques, idéals pour vos plats italiens et respectueux de l'environnement.",
      "price": 2.99
    },
    {
      "name": "Riz Basmati",
      "description": "Riz basmati long grain, parfumé et léger, idéal pour accompagner vos plats de curry ou autres recettes exotiques.",
      "price": 3.49
    },
    {
      "name": "Penne Rigate",
      "description": "Penne rigate, parfaites pour les sauces riches comme la sauce tomate ou la sauce à la crème.",
      "price": 2.89
    },
    {
      "name": "Riz Complet",
      "description": "Riz complet, riche en fibres et en nutriments, idéal pour des repas sains et équilibrés.",
      "price": 3.99
    },
    {
      "name": "Couscous",
      "description": "Couscous de blé, parfait pour les recettes traditionnelles nord-africaines, à servir avec des légumes ou de la viande.",
      "price": 2.79
    }
  ]
},

        {
          name: "Sauces et Condiments",
          slug: "sauces-et-condiments",
          description:
            "Une gamme de sauces et condiments pour relever vos plats avec des saveurs uniques. Choisissez parmi une sélection d’huiles, vinaigres et sauces.",
          produits: [
            {
              name: "Sauce Tomate Bio",
              description: "Sauce tomate biologique, idéale pour les pâtes ou pizzas.",
              price: 4.5,
            },
            {
              name: "Vinaigre Balsamique",
              description: "Vinaigre balsamique traditionnel, parfait pour vos salades.",
              price: 5.99,
            },
            {
              name: "Huile d'Olive Bio",
              description: "Huile d'olive extra vierge, riche en goût et parfaite pour vos plats méditerranéens.",
              price: 8.49,
            },
            {
              name: "Moutarde de Dijon",
              description: "Moutarde de Dijon traditionnelle, idéale pour vos viandes et sauces.",
              price: 2.49,
            },
          ],
        },
        {
          name: "Epices et Herbes",
          slug: "epices-et-herbes",
          description:
            "Des épices et herbes séchées pour donner du goût et de la couleur à vos plats. Découvrez notre sélection d'épices d'origine biologique.",
          produits: [
            {
              name: "Sel de Mer",
              description: "Sel de mer naturel, pour assaisonner tous vos plats.",
              price: 1.99,
            },
            {
              name: "Poivre Noir",
              description:
                "Poivre noir moulu de qualité supérieure, idéal pour vos plats salés.",
              price: 2.99,
            },
            {
              name: "Paprika Fumé",
              description: "Paprika fumé, idéal pour les plats épicés ou les grillades.",
              price: 3.29,
            },
            {
              name: "Herbes de Provence",
              description: "Mélange d'herbes de Provence séchées, parfait pour les plats méditerranéens.",
              price: 3.99,
            },
          ],
        },
        {
          name: "Produits en conserve",
          slug: "produits-en-conserve",
          description:
            "Des produits en conserve pour vous offrir une solution rapide et pratique tout en gardant une excellente qualité.",
          produits: [
            {
              name: "Tomates Concassées",
              description: "Tomates concassées en conserve, parfaites pour les sauces et les plats cuisinés.",
              price: 2.49,
            },
            {
              name: "Pois Chiches",
              description: "Pois chiches en conserve, idéals pour les salades, couscous ou houmous.",
              price: 2.99,
            },
            {
              name: "Maïs en Conserve",
              description: "Maïs en conserve, délicieux pour accompagner vos salades ou vos plats mexicains.",
              price: 1.99,
            },
            {
              name: "Thon à l'Huile",
              description:
                "Thon en conserve, préparé dans de l'huile d'olive, parfait pour les salades ou les pâtes.",
              price: 3.99,
            },
          ],
        },
      ],
    },
  
    {
      title: "Pains et Pâtisseries",
      description:
        "Découvrez nos pains et pâtisseries artisanales, préparés quotidiennement pour vous offrir une fraîcheur et une qualité incomparables.",

        subcategories: [
        {
          name: "Pains",
          slug: "pains",
          produits: [
            {
              name: "Baguette Tradition",
              description:
                "Baguette croustillante préparée chaque matin, parfaite pour tous vos repas.",
              price: 1.2,
            },
            {
              name: "Pain Complet",
              description:
                "Pain complet riche en fibres, idéal pour une alimentation équilibrée.",
              price: 2.5,
            },
            {
              name: "Pain de Campagne",
              description:
                "Pain rustique à la croûte dorée et à la mie moelleuse, fabriqué selon la tradition.",
              price: 3.0,
            },
            {
              name: "Pain aux Noix",
              description:
                "Pain artisanal garni de noix, idéal pour accompagner des fromages.",
              price: 4.0,
            },
            {
              name: "Pain Multigrains",
              description:
                "Pain fait maison, garni de graines variées pour un goût authentique et croquant.",
              price: 3.5,
            },
          ],
        },
        {
          name: "Viennoiseries",
          slug: "viennoiseries",
          produits: [
            {
              name: "Croissant au Beurre",
              description:
                "Croissant doré et feuilleté, préparé avec du beurre de qualité.",
              price: 1.5,
            },
            {
              name: "Pain au Chocolat",
              description:
                "Pain au chocolat moelleux, parfait pour un petit-déjeuner gourmand.",
              price: 1.7,
            },
            {
              name: "Chausson aux Pommes",
              description:
                "Viennoiserie garnie de pommes fondantes, idéale pour une pause sucrée.",
              price: 2.0,
            },
            {
              name: "Brioche Tressée",
              description:
                "Brioche moelleuse et légèrement sucrée, parfaite pour accompagner vos confitures.",
              price: 4.5,
            },
            {
              name: "Pain aux Raisins",
              description:
                "Viennoiserie roulée avec des raisins secs et une crème pâtissière onctueuse.",
              price: 1.8,
            },
          ],
        },
        {
          name: "Pâtisseries",
          slug: "patisseries",
          produits: [
            {
              name: "Éclair au Chocolat",
              description:
                "Éclair garni d’une crème au chocolat onctueuse, avec un glaçage fondant.",
              price: 2.5,
            },
            {
              name: "Tarte aux Fraises",
              description:
                "Tarte fine garnie de fraises fraîches et d’une crème pâtissière délicate.",
              price: 3.5,
            },
            {
              name: "Millefeuille",
              description:
                "Feuilleté léger et croustillant avec une crème pâtissière vanillée entre les couches.",
              price: 3.0,
            },
            {
              name: "Tartelette Citron Meringuée",
              description:
                "Tartelette avec une base de pâte sablée, une crème au citron acidulée et une meringue dorée.",
              price: 3.2,
            },
            {
              name: "Macaron Framboise",
              description:
                "Macaron moelleux avec une ganache à la framboise, pour une explosion de saveurs.",
              price: 1.8,
            },
          ],
        },
      ],
    },
  
    {
      title: "Maison et Hygiène",
      description:
        "Retrouvez une large gamme de produits pour l’entretien de votre maison et votre hygiène personnelle, avec une sélection respectueuse de l’environnement.",

        subcategories: [
        {
          name: "Entretien de la Maison",
          slug: "entretien-de-la-maison",
          produits: [
            {
              name: "Liquide Vaisselle Écologique",
              description:
                "Liquide vaisselle biodégradable, sans phosphates, pour un lavage efficace et respectueux de l’environnement.",
              price: 3.99,
            },
            {
              name: "Lessive en Poudre",
              description:
                "Lessive en poudre concentrée, idéale pour le linge blanc et couleurs, à base d’agents nettoyants d’origine naturelle.",
              price: 9.5,
            },
            {
              name: "Nettoyant Multi-surfaces",
              description:
                "Nettoyant multi-surfaces, efficace sur toutes les surfaces lavables, pour une maison propre et éclatante.",
              price: 5.2,
            },
            {
              name: "Désodorisant Naturel",
              description:
                "Désodorisant en spray à base d’huiles essentielles, pour un intérieur frais et agréable.",
              price: 4.99,
            },
            {
              name: "Éponges Compostables",
              description:
                "Éponges écologiques, compostables, fabriquées à partir de matériaux naturels.",
              price: 2.5,
            },
          ],
        },
        {
          name: "Hygiène Personnelle",
          slug: "hygiene-personnelle",
          produits: [
            {
              name: "Gel Douche Bio",
              description:
                "Gel douche hydratant, formulé à base d’ingrédients biologiques pour un soin tout en douceur.",
              price: 6.5,
            },
            {
              name: "Shampoing Solide",
              description:
                "Shampoing solide sans sulfates, parfait pour nourrir et fortifier vos cheveux tout en respectant l’environnement.",
              price: 8.0,
            },
            {
              name: "Savon de Marseille",
              description:
                "Savon traditionnel de Marseille, idéal pour le corps et les mains, fabriqué à base d’huiles végétales.",
              price: 3.2,
            },
            {
              name: "Brosse à Dents en Bambou",
              description:
                "Brosse à dents écologique en bambou, avec des poils souples pour un brossage tout en douceur.",
              price: 2.99,
            },
            {
              name: "Déodorant Naturel",
              description:
                "Déodorant à base de bicarbonate et d’huiles essentielles, sans aluminium, pour une protection efficace.",
              price: 7.5,
            },
          ],
        },
        {
          name: "Produits Écologiques",
          slug: "produits-ecologiques",
          produits: [
            {
              name: "Lessive Liquide Éco-responsable",
              description:
                "Lessive liquide éco-responsable, respectueuse des peaux sensibles et de l’environnement.",
              price: 10.99,
            },
            {
              name: "Produit Vaisselle Rechargeable",
              description:
                "Produit vaisselle concentré dans une bouteille rechargeable, pour un impact réduit sur l’environnement.",
              price: 5.0,
            },
            {
              name: "Nettoyant Sols Naturel",
              description:
                "Nettoyant sols naturel à base d’agents nettoyants dérivés de plantes, pour des sols impeccables et un air sain.",
              price: 6.99,
            },
            {
              name: "Recharge de Savon Liquide",
              description:
                "Recharge de savon liquide bio pour réduire les déchets plastiques tout en prenant soin de votre peau.",
              price: 4.5,
            },
            {
              name: "Bicarbonate de Soude",
              description:
                "Bicarbonate de soude multi-usages pour l’entretien de la maison, sans produits chimiques.",
              price: 3.0,
            },
          ],
        },
        {
          name: "Accessoires et Matériel",
          slug: "accessoires-et-materiel",
          produits: [
            {
              name: "Balai Microfibre",
              description:
                "Balai microfibre avec tête pivotante, idéal pour capturer la poussière et la saleté sans effort.",
              price: 12.99,
            },
            {
              name: "Gants Ménagers Écologiques",
              description:
                "Gants ménagers en caoutchouc naturel, résistants et confortables pour protéger vos mains lors du nettoyage.",
              price: 4.5,
            },
            {
              name: "Seau Pliable",
              description:
                "Seau pliable en silicone, idéal pour un gain de place dans vos placards.",
              price: 9.99,
            },
            {
              name: "Lavettes Réutilisables",
              description:
                "Lavettes réutilisables en tissu, lavables en machine pour un nettoyage efficace et durable.",
              price: 5.5,
            },
            {
              name: "Brosse WC en Bambou",
              description:
                "Brosse WC en bambou avec support, élégante et écologique pour vos sanitaires.",
              price: 6.99,
            },
          ],
        },
      ],
    },
    {
      title: "Mode, Bijoux, Bagagerie",
      description:
        "Découvrez notre collection de mode, bijoux et bagagerie, alliant élégance, qualité et diversité pour répondre à tous les goûts et occasions.",
        subcategories: [
        {
          name: "Vêtements Femme",
          slug: "vetements-femme",
          produits: [
            {
              name: "Robe d'Été Fleurie",
              description: "Robe légère et fluide avec un imprimé floral, parfaite pour les journées ensoleillées.",
              price: 29.99,
            },
            {
              name: "Jean Slim Taille Haute",
              description: "Jean slim classique, taille haute, avec une coupe flatteuse pour toutes les morphologies.",
              price: 49.99,
            },
            {
              name: "Pull en Cachemire",
              description: "Pull doux en cachemire, idéal pour les jours frais, offrant confort et élégance.",
              price: 89.99,
            },
          ],
        },
        {
          name: "Bijoux Fantaisie",
          slug: "bijoux-fantaisie",
          produits: [
            {
              name: "Bracelet en Perles",
              description: "Bracelet en perles naturelles, conçu pour sublimer votre poignet avec une touche élégante.",
              price: 15.99,
            },
            {
              name: "Collier Pendentif Coeur",
              description: "Collier avec pendentif en forme de cœur, un bijou romantique pour toutes les occasions.",
              price: 19.99,
            },
            {
              name: "Boucles d'Oreilles Créoles",
              description: "Boucles d'oreilles créoles dorées, un accessoire intemporel pour un look chic.",
              price: 12.99,
            },
          ],
        },
        {
          name: "Sacs à Main",
          slug: "sacs-a-main",
          produits: [
            {
              name: "Sac Bandoulière en Cuir",
              description: "Sac en cuir véritable avec bandoulière ajustable, parfait pour un style urbain et élégant.",
              price: 59.99,
            },
            {
              name: "Pochette de Soirée",
              description: "Pochette élégante pour les soirées et occasions spéciales, avec des détails scintillants.",
              price: 34.99,
            },
            {
              name: "Sac Cabas en Toile",
              description: "Sac cabas spacieux en toile, idéal pour transporter vos essentiels au quotidien.",
              price: 24.99,
            },
          ],
        },
        {
          name: "Montres",
          slug: "montres",
          produits: [
            {
              name: "Montre Classique en Acier",
              description: "Montre avec bracelet en acier inoxydable, style classique et intemporel.",
              price: 129.99,
            },
            {
              name: "Montre Connectée Sport",
              description: "Montre connectée avec suivi des activités, idéale pour les sportifs.",
              price: 89.99,
            },
            {
              name: "Montre Cuir Vintage",
              description: "Montre avec bracelet en cuir vintage, pour un style élégant et rétro.",
              price: 79.99,
            },
          ],
        },
        {
          name: "Valises et Bagages",
          slug: "valises-et-bagages",
          produits: [
            {
              name: "Valise Rigide Cabine",
              description: "Valise rigide taille cabine, résistante aux chocs, idéale pour les voyages en avion.",
              price: 99.99,
            },
            {
              name: "Sac de Voyage Weekender",
              description: "Sac de voyage en toile, spacieux et pratique pour les escapades de fin de semaine.",
              price: 49.99,
            },
            {
              name: "Set de Valises",
              description: "Set de trois valises de différentes tailles, idéal pour les longs voyages.",
              price: 199.99,
            },
          ],
        },
      ],
    }
    
  ];
  