# 🖼️ MagicCut PRO - Background Remover

Logiciel de détourage d'image ultra-performant utilisant l'IA (**FastAPI** + **rembg** + **React**).

## 🚀 Fonctionnalités
- **Détourage HD** : IA haute performance (modèle u2net) pour une précision chirurgicale.
- **Interface Premium** : Design moderne, fluide et responsive.
- **Drag & Drop** : Importation facile de vos photos.
- **Preview Côte-à-Côte** : Visualisation instantanée sur grille de transparence.
- **Gratuit & Illimité** : Pas d'API externe, traitement local.

---

## 🛠️ Installation & Lancement

### 1. Backend (Python API)
Le backend utilise FastAPI et la bibliothèque `rembg`.

**Prérequis :** Python 3.9+

```bash
cd backend
# Créer un environnement virtuel (optionnel mais recommandé)
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Lancer le serveur
python main.py
```
Le serveur sera disponible sur `http://localhost:8000`.

### 2. Frontend (React App)
Le frontend est construit avec React, Vite et Tailwind CSS.

**Prérequis :** Node.js 18+

```bash
cd frontend
# Installer les dépendances
npm install

# Lancer le projet en mode développement
npm run dev
```
L'application sera disponible sur `http://localhost:5173`.

---

## 🏗️ Architecture & Connexion

### Comment le Frontend communique avec l'API ?
Le frontend utilise l'API standard `fetch` pour envoyer les images au backend :
1. L'utilisateur dépose une image dans la zone de **Drag & Drop** (utilisant `react-dropzone`).
2. Le fichier est encapsulé dans un objet `FormData`.
3. Une requête `POST` est envoyée à `http://localhost:8000/remove-bg`.
4. Le backend Python reçoit l'image, la traite avec `rembg`, et renvoie un flux binaire (`blob`) au format PNG transparent.
5. Le frontend crée une URL locale (`URL.createObjectURL`) pour afficher et permettre le téléchargement du résultat.

### Optimisations incluses :
- **CORS** : Configuré dans le backend pour autoriser les requêtes du frontend.
- **Session IA** : Le modèle IA est pré-chargé au démarrage du serveur pour des détourages ultra-rapides.
- **UI/UX** : Utilisation de `framer-motion` pour des transitions lisses et une barre de progression animée.

---

## 📦 Dépendances Principales
- **Backend** : `fastapi`, `uvicorn`, `rembg`, `pillow`.
- **Frontend** : `react`, `vite`, `tailwindcss`, `framer-motion`, `lucide-react`, `react-dropzone`.

---
*Développé avec passion par Antigravity.*
