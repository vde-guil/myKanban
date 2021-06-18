-- On démarre la transaction, en cas d'erreur durant le script
-- tout est annulé !
BEGIN;

-- On fait le ménage
DROP TABLE IF EXISTS "list",
"card",
"label",
"card_has_label";


-- On créé les différentes tables
CREATE TABLE IF NOT EXISTS "list" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    -- On créé un champs createdAt qui est de type
    -- timestamp avec pouv valeur par déffaut la date et l'heure
    -- au moment de l'insertion
    -- On ne s'occupera pas de ces champs, ils seront géré
    -- par sequelize
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "card" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    -- ON delete cascade permet de supprimer automatiquement
    -- toutes les cartes qui sont associées à une liste lors de la
    -- suppression de cette dernière.
    "list_id" INTEGER NOT NULL REFERENCES "list" ("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "label" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "card_has_label" (
  "label_id" INTEGER NOT NULL REFERENCES "label"("id") ON DELETE CASCADE,
  "card_id" INTEGER NOT NULL REFERENCES "card" ("id") ON DELETE CASCADE,
<<<<<<< HEAD
  PRIMARY KEY ("label_id", "card_id"),
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP
=======
   "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP,
  PRIMARY KEY ("label_id", "card_id")
>>>>>>> 7d64c5423a8a558b7a9ccc1258f87a8a2f3e3fd7
);

INSERT INTO "list" ("name") VALUES
('TODO'),
('ON DOING'),
('DONE');

INSERT INTO "card" ("title", "position", "color", "list_id") VALUES
('Faire le MCD',1,'ea52ce', 1),
('Faire page accueil',2,'18449B', 1),
('Mettre en place le routeur',1,'52ea61',2);

INSERT INTO "label" ("name") VALUES
('Back'),
('Front'),
('Gestion de projet');

INSERT INTO "card_has_label" ("card_id", "label_id") VALUES
(1, 3),
(1, 2),
(2, 3);

COMMIT;