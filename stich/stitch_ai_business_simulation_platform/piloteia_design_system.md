---
name: "PiloteIA Design System"
description: "Système de design haute précision pour un simulateur de vol B2B assisté par IA, alliant clarté analytique et rigueur opérationnelle."
---

## Overview

PiloteIA est un SaaS B2B de Serious Games et simulations d'entreprise assistées par IA (« le simulateur de vol pour les équipes en entreprise »). L'interface s'adresse aux Directeurs Commerciaux, DRH, formateurs et candidats en évaluation. Elle doit inspirer la **fiabilité**, la **maîtrise opérationnelle** et la **précision analytique**.

Le style adopte une esthétique **Corporate / Modern** en **mode clair** par défaut : des surfaces ivoire-ardoise très lisibles, une hiérarchie typographique nette avec chiffres tabulaires pour les KPIs en temps réel, et une séparation visuelle claire entre le moteur d'état déterministe (jauges, trésorerie, chronomètre) et le flux narratif IA.

## Colors

La palette s'appuie sur un bleu cobalt profond (`primary: #002C76`) évoquant l'aviation et le conseil stratégique, associé à des neutres froids (`#FAF8FF` à `#E2E2E9`) pour hiérarchiser les panneaux sans lourdeur. Les couleurs sémantiques (`success`, `warning`, `error`) sont réservées strictement aux états des jauges KPI, alertes de crise et scores d'évaluation.

```yaml
colors:
  success: "#146C2E"
  on-success: "#FFFFFF"
  success-container: "#C4EED0"
  on-success-container: "#072711"
  warning: "#8F4E00"
  on-warning: "#FFFFFF"
  warning-container: "#FFDCC1"
  on-warning-container: "#2E1500"
  light:
    primary: "#002C76"
    on-primary: "#FFFFFF"
    primary-container: "#1B4396"
    on-primary-container: "#9BB5FF"
    secondary: "#525D80"
    on-secondary: "#FFFFFF"
    secondary-container: "#CBD6FE"
    on-secondary-container: "#515C7E"
    tertiary: "#562100"
    on-tertiary: "#FFFFFF"
    tertiary-container: "#7A3200"
    on-tertiary-container: "#FF9F6B"
    error: "#BA1A1A"
    on-error: "#FFFFFF"
    error-container: "#FFDAD6"
    on-error-container: "#93000A"
    background: "#FAF8FF"
    on-background: "#1A1B21"
    surface: "#FAF8FF"
    surface-dim: "#DAD9E1"
    surface-bright: "#FAF8FF"
    surface-container-lowest: "#FFFFFF"
    surface-container-low: "#F4F3FB"
    surface-container: "#EEEDF5"
    surface-container-high: "#E8E7EF"
    surface-container-highest: "#E2E2E9"
    on-surface: "#1A1B21"
    surface-variant: "#E0E2F0"
    on-surface-variant: "#434651"
    outline: "#747783"
    outline-variant: "#C4C6D3"
    inverse-surface: "#2F3036"
    inverse-on-surface: "#F1F0F8"
    inverse-primary: "#B2C5FF"
    shadow: "#000000"
    scrim: "#000000"
  dark:
    primary: "#B2C5FF"
    on-primary: "#002B73"
    primary-container: "#1B4396"
    on-primary-container: "#9BB5FF"
    secondary: "#BAC5ED"
    on-secondary: "#242F4F"
    secondary-container: "#3D4869"
    on-secondary-container: "#ACB7DE"
    tertiary: "#FFB691"
    on-tertiary: "#552100"
    tertiary-container: "#7A3200"
    on-tertiary-container: "#FF9F6B"
    error: "#FFB4AB"
    on-error: "#690005"
    error-container: "#93000A"
    on-error-container: "#FFDAD6"
    background: "#121318"
    on-background: "#E2E2E9"
    surface: "#121318"
    surface-dim: "#121318"
    surface-bright: "#38393F"
    surface-container-lowest: "#0C0E13"
    surface-container-low: "#1A1B21"
    surface-container: "#1E1F25"
    surface-container-high: "#282A2F"
    surface-container-highest: "#33343A"
    on-surface: "#E2E2E9"
    surface-variant: "#434651"
    on-surface-variant: "#C4C6D3"
    outline: "#8E909D"
    outline-variant: "#434651"
    inverse-surface: "#E2E2E9"
    inverse-on-surface: "#2F3036"
    inverse-primary: "#375AAE"
    shadow: "#000000"
    scrim: "#000000"
```

## Typography

L'association typographique privilégie la lisibilité technique et la clarté décisionnelle :
- **Wix Madefor Display** pour les titres et en-têtes de cockpit.
- **Instrument Sans** pour les dialogues, formulaires et libellés d'interface.
- **Source Code Pro** pour les deltas d'état JSON, chronomètres et identifiants de session.

```yaml
typography:
  display-lg:
    fontFamily: "Wix Madefor Display"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 48px
    letterSpacing: -0.5px
  display-lg-mobile:
    fontFamily: "Wix Madefor Display"
    fontSize: 30px
    fontWeight: 700
    lineHeight: 36px
    letterSpacing: -0.25px
  headline-lg:
    fontFamily: "Wix Madefor Display"
    fontSize: 28px
    fontWeight: 600
    lineHeight: 36px
    letterSpacing: -0.25px
  headline-md:
    fontFamily: "Wix Madefor Display"
    fontSize: 22px
    fontWeight: 600
    lineHeight: 28px
    letterSpacing: 0px
  title-lg:
    fontFamily: "Wix Madefor Display"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 24px
    letterSpacing: 0px
  title-md:
    fontFamily: "Instrument Sans"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px
    letterSpacing: 0px
  body-lg:
    fontFamily: "Instrument Sans"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: 0px
  body-md:
    fontFamily: "Instrument Sans"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0px
  label-lg:
    fontFamily: "Instrument Sans"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
    letterSpacing: 0.1px
  label-sm:
    fontFamily: "Instrument Sans"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0.2px
  mono-md:
    fontFamily: "Source Code Pro"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 18px
    letterSpacing: 0px
```

## Layout & Spacing

L'architecture desktop repose sur une grille fluide à 12 colonnes (gouttière 24px) avec barre latérale persistante de 240px pour les vues de gestion (Studio, Rapports) et une vue cockpit plein écran sans distraction pour l'interface de simulation. Un pas strict de 4px/8px régit tous les espacements.

```yaml
spacing:
  gutter-xs: 4px
  gutter-sm: 8px
  gutter-md: 16px
  gutter-lg: 24px
  gutter-xl: 32px
  section: 48px
  page-margin: 24px
```

## Elevation & Depth

La hiérarchie visuelle utilise des **couches tonales** (`surface` → `surface-container-lowest` pour les cartes actives et `surface-container-low` pour les panneaux latéraux) combinées à des bordures fines `outline-variant` (1px) pour délimiter les zones de télémétrie et de dialogue sans ombres portées lourdes.

## Shapes

Les rayons d'angles restent sobres et professionnels : `8px` par défaut pour les boutons et champs, `12px` pour les cartes de scénarios et panneaux de télémétrie, `9999px` pour les badges de statut et jauges pilules.

```yaml
rounded:
  sm: 4px
  DEFAULT: 8px
  md: 12px
  lg: 16px
  xl: 24px
  full: 9999px
```

## Motion & Micro-interaction

Les transitions sont rapides et mécaniques, à l'image d'un tableau de bord aéronautique : les retours d'interaction répondent en 100ms, et les variations de jauges KPI utilisent des transitions fluides sans rebond.

```yaml
motion:
  state-change:
    duration: 100ms
    delay: 0ms
    timingFunction: ease-out
  surface-enter:
    duration: 220ms
    delay: 0ms
    timingFunction: cubic-bezier(0.2, 0, 0, 1)
  surface-exit:
    duration: 150ms
    delay: 0ms
    timingFunction: cubic-bezier(0.3, 0, 1, 1)
```

## Voice & Content Strategy

- **Ton :** Direct, factuel, orienté décision et mesure. Aucun jargon marketing creux.
- **Casse :** Casse de phrase (*Sentence case*) pour les titres, boutons et onglets.
- **Libellés d'action :** Toujours formulés par un verbe d'action précis (« Lancer la simulation », « Exporter le rapport PDF », « Importer un document RAG »).
- **Chiffres :** Tous les KPIs, durées, pourcentages et montants utilisent `tabular-nums` pour éviter tout saut visuel lors des mises à jour.

## Components

Component implementations live as individual HTML sticker sheet files in
`components/`. Each file contains the canonical, styled HTML components with
`<!-- COMPONENT: name -->` comment markers. Read each file before use.

- **Badge** → `@components/badge.html`: `badge-numeric`, `badge-dot`
- **Button** → `@components/button.html`: `button-primary`, `button-icon`, `button-with-icon`
- **Card** → `@components/card.html`: `card-elevated`, `card-action`, `card-interactive`, `card-interactive-2`
- **Input Field** → `@components/input-field.html`: `input-field-text`, `input-field-icon`
- **Tabs** → `@components/tabs.html`: `tabs-horizontal`, `tabs-with-icon`
