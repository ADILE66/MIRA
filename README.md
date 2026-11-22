# MiraStudio — Simulateur Tactique B2B & Serious Games IA

**MiraStudio** est une plateforme SaaS B2B d'entraînement et d'évaluation décisionnelle assistée par IA. Elle repose sur un **moteur de simulation hybride** combinant un **Moteur d'État déterministe** (zéro hallucination chiffrée), un **Moteur Narratif multi-personas** (Gemini avec Function Calling), une base documentaire **RAG en temps réel** et un **Agent Évaluateur structuré**.

---

## 4 Modules Métiers

1. **Formation & Upskilling (`upskilling`) :** Jeux de rôle (vente, négociation, management, cybersécurité) face à des personas IA adaptatifs dont l'humeur évolue dynamiquement.
2. **Simulation Stratégique / Business Game (`business_game`) :** Pilotage d'une entreprise ou BU sur plusieurs trimestres virtuels (budgets, BFR, trésorerie, pricing) avec imprévus de marché générés par l'IA.
3. **Recrutement / Gamified Assessment (`recruitment`) :** Mises en situation chronométrées (20–30 min) pour évaluer les réflexes et soft skills des candidats sans triche possible (protection anti-jailbreak et calculs hermétiques côté serveur).
4. **Onboarding & Conduite du Changement (`onboarding`) :** Parcours gamifiés basés sur les procédures et réglementations internes de l'entreprise.

---

## Architecture Hybride

* **Pilier 1 — Moteur d'État Déterministe (`lib/state-engine.ts`) :** Réducteur TypeScript pur garantissant l'intégrité absolue des métriques (Trésorerie, ARR, Marge EBITDA, Churn, Confiance).
* **Pilier 2 — Moteur Narratif & Décisionnel IA (`lib/gemini-engine.ts`) :** Function Calling strict (`recordSimulationTurnImpact`) forçant la séparation entre discours incarné et deltas de KPIs.
* **Pilier 3 — Audit RAG en Temps Réel (`lib/rag-engine.ts`) :** Ingestion de documents internes (PDF, Markdown) et audit systématique du respect (`RESPECTED`) ou violation (`VIOLATED`) des règles métier.
* **Architecture Multi-Tenant & Mode Marque Blanche :** Prise en charge des ETI, PME, Directions RH et Cabinets de Conseil (compatibilité PostgreSQL / Supabase RLS).

---

## Démarrage Rapide

### Prérequis
* Node.js v18+ (recommandé v20+)
* Clé API Google Gemini (`GEMINI_API_KEY`)

### Installation & Lancement

```bash
# 1. Cloner le dépôt
git clone https://github.com/ADILE66/MIRA.git
cd MIRA

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Définir votre GEMINI_API_KEY dans .env.local

# 4. Lancer le serveur de développement
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).
