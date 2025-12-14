# Test Technique Pando2 - Visualisation de Données de Qualité de l'Air

## Description

Cette application Ruby on Rails affiche les mesures de capteurs de qualité de l'air contenues dans plusieurs fichiers CSV. L'interface fonctionne sur une seule page web sans base de données - les données CSV sont parsées directement côté client avec JavaScript.

## Choix techniques

- **Framework** : le projet utilise Ruby on Rails
- **Traitement des données** : le parsing et la logique d'affichage sont réalisés en JavaScript côté client (`app/assets/javascript/dashboard.js`) 
- **Format des données** : les CSV sont placés dans `public/data/` afin d'être servis statiquement et lus directement depuis le navigateur.
- **Librairie graphique** : Chart.js 
- **Parsing CSV** : PapaParse 



## Prérequis

- **Ruby** : version 3.x ou supérieure
- **Rails** : version 8.1.1
- **Bundler** : pour la gestion des dépendances

### Vérifier les versions installées


## Installation

### 1. Cloner le repository Git

Le projet est disponible sur GitHub :

```bash
git clone https://github.com/celinetibouche/pando2-test.git
cd pando2-test
```

### 2. Installer les dépendances

```bash
bundle install
```

L'application est prête à être lancée.

## Lancer l'application

### Démarrage du serveur

```bash
rails server
```


### Accéder à l'application

Une fois le serveur démarré, ouvrez votre navigateur web et accédez à :

```
http://localhost:3000
```

L'application affichera automatiquement le dashboard avec les données des capteurs de qualité de l'air.

## Données

Les fichiers CSV contenant les mesures des capteurs se trouvent dans le répertoire :
```
public/data/
```

Fichiers inclus :
- `20211101_B3D54FD00007B2.csv`
- `20211101_B3D54FD000088A.csv`
- `20211101_B3D54FD000088F.csv`

## Structure du projet

```
app/
  ├── controllers/      # Contrôleurs Rails
  ├── views/           # Vues et templates
  ├── assets/          # CSS et JavaScript
  └── helpers/         # Helpers Rails
config/                # Configuration de l'application
public/
  └── data/           # Fichiers CSV
```

## Technologies utilisées

- **Backend** : Ruby on Rails 8.1.1
- **Frontend** : HTML, CSS, JavaScript vanilla
- **Parsing CSV** : PapaParse (bibliothèque JavaScript)
- **Graphiques** : Chart.js

## Notes

- L'application fonctionne en environnement de développement par défaut
- Les données sont chargées depuis les fichiers CSV statiques dans `public/data/`
- Aucune authentification ou configuration supplémentaire n'est requise

##  Dépannage

### Le serveur ne démarre pas
- Vérifiez que toutes les dépendances sont installées : `bundle install`
- Vérifiez que le port 3000 n'est pas déjà utilisé : `lsof -i :3000`
- Vérifiez que les fichiers CSV sont bien dans `public/data/`


### Erreurs de gems
- Mettez à jour bundler : `gem install bundler`
- Réinstallez les dépendances : `bundle install`

## Auteur

Projet réalisé dans le cadre du test technique Pando2.