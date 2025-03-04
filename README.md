# Checkout Page avec Stripe Integration

Ce projet implémente une page de **Checkout** dans une application **React** avec **Stripe** pour le traitement des paiements. L'application permet aux utilisateurs de passer des commandes en ligne et de payer via un formulaire sécurisé intégré avec Stripe.

## Description du projet

Cette application de **Checkout** est conçue pour calculer le total de la commande et permettre un paiement en ligne via **Stripe**. La page intègre un formulaire de paiement sécurisé qui utilise **Stripe Elements** pour collecter les informations de carte de crédit, ainsi qu'un backend pour traiter les paiements via l'API de Stripe.

Le projet utilise **React**, **Next.js** et **Bootstrap** pour la mise en page et la gestion du style, et **Stripe** pour le traitement des paiements. J'utilise pages/router comme demandé dans le test plutôt que app/router. L'objectif est de permettre aux utilisateurs de finaliser leur achat avec une expérience utilisateur fluide et sécurisée.
La CardElement est séparé en 3 pour nous permettre d'avoir le style recherché.
(Numéro de carte, date d'expiration et CVC).
Le checkout aurait pu etre separé en composant mais je ne pense pas que cela soit utile dans ce cas.

Seul le test de paiement stripe est fonctionnel et à une validation des données.

## Technologies utilisées

- **React.js** pour la structure de la page.
- **Next.js** pour le framework React.
- **Stripe.js** et **Stripe Elements** pour gérer le processus de paiement.
- **Bootstrap** pour la mise en page et le style.
- **TypeScript** pour la typage statique.

## Instructions d'installation

### 1. Cloner le projet

Clone le projet depuis le repository GitHub en utilisant la commande suivante :

SSH ```git clone git@github.com:julien-rousselot/Stripe-checkout.git```

### 2. Installez les dépendances

npm install

### 3. Configurez vos clés Stripe

Créez un fichier .env.local à la racine de votre projet et ajoutez vos clés Stripe (clé publique et clé secrète) :
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXX
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXX

### 4. Démarrez le serveur de développement

npm run dev

## Étapes pour tester le paiement

### 1. Accédez à la page de checkout

Ouvrez votre navigateur et allez sur la page de checkout de l'application.
 (http://localhost:3000/checkout), la page (http://localhost:3000) nous renvoi une erreur 404 car ce n'est pas le but de l'exercice.

### 2. Utilisez une carte de test Stripe

Stripe propose des cartes de test pour simuler des paiements sans utiliser de véritable argent. Utilisez les informations de carte suivantes pour tester :

- **Numéro de carte** : `4242 4242 4242 4242`
- **Date d'expiration** : `date future`
- **CVC** : `aleatoire de 3 chiffres`

Ces informations peuvent être utilisées pour effectuer un paiement en mode test.

### 3. Tester différents scénarios

- **Testez un paiement réussi** en soumettant le formulaire avec la carte de test mentionnée ci-dessus.
- **Testez un paiement échoué** en utilisant une carte de test comme `4000 0000 0000 9995`, qui simule une carte rejetée par Stripe.

### 4. Vérifiez la réponse du serveur

Après soumission, l'API Stripe renverra une réponse. Si le paiement est accepté :

- Un message de succès sera affiché à l'utilisateur.

Si une erreur se produit :

- Un message d'erreur sera affiché à l'utilisateur pour lui permettre de corriger le problème et de réessayer.
