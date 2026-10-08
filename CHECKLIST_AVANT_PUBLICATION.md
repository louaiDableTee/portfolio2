# Checklist avant publication

**Ne pas fusionner dans `main` tant que toutes les cases ne sont pas cochées.**

Cette liste reprend chaque affirmation écrite comme « fait » qui vient de la section 6B du brief (les tâches en cours de finition). Pour chaque point : la page où il apparaît, la clé du texte, et la ligne exacte dans `content/fr.json` et `content/en.json`. Coche une case seulement quand c’est vraiment fait sur la boutique. Si un point ne sera pas fait, supprime ou réécris le texte aux lignes indiquées.

Les numéros de ligne correspondent à la version de ce commit ; si les fichiers de contenu changent, cherche la clé entre parenthèses.

## Images produits

- [x] Photos libres de droits (Unsplash, Pexels) pour les 20 produits
  - `/espace-deals/` (`s5-pages-2`) → [fr.json:212](content/fr.json#L212) · [en.json:212](content/en.json#L212)
  - `/espace-deals/` (`demo-p`) → [fr.json:123](content/fr.json#L123) · [en.json:123](content/en.json#L123)
- [x] Texte alternatif écrit pour chaque image
  - `/espace-deals/` (`s5-pages-3`) → [fr.json:213](content/fr.json#L213) · [en.json:213](content/en.json#L213)

## Accueil et en-tête de la boutique en français

- [x] Hero, catégories et produits mis en avant
  - `/espace-deals/` (`s6-site-1`) → [fr.json:232](content/fr.json#L232) · [en.json:232](content/en.json#L232)
  - `/` (`case-shot-caption`) → [fr.json:52](content/fr.json#L52) · [en.json:52](content/en.json#L52)
  - `/espace-deals/` (`s8-shot-home-caption`) → [fr.json:256](content/fr.json#L256) · [en.json:256](content/en.json#L256)
- [x] Barre de réassurance : paiement à la livraison, livraison 7 DT / gratuite dès 150 DT, retours
  - `/espace-deals/` (`s6-site-1`) → [fr.json:232](content/fr.json#L232) · [en.json:232](content/en.json#L232)
  - `/` (`case-shot-caption`) → [fr.json:52](content/fr.json#L52) · [en.json:52](content/en.json#L52)
  - `/espace-deals/` (`s8-shot-home-caption`) → [fr.json:256](content/fr.json#L256) · [en.json:256](content/en.json#L256)
- [x] Mon propre logo (lien Facebook retiré du site)
  - `/espace-deals/` (`s6-site-1`) → [fr.json:232](content/fr.json#L232) · [en.json:232](content/en.json#L232)

## SEO on-page avec Rank Math

- [x] Title et meta description pour l’accueil, les 5 catégories et les 20 fiches produits, écrits depuis la sheet
  - `/espace-deals/` (`s5-seo-1`) → [fr.json:215](content/fr.json#L215) · [en.json:215](content/en.json#L215)
  - `/espace-deals/` (`s5-line`) → [fr.json:209](content/fr.json#L209) · [en.json:209](content/en.json#L209)
  - `/` (`case-step-4`) → [fr.json:56](content/fr.json#L56) · [en.json:56](content/en.json#L56)
  - `/espace-deals/` (`s5-shot-rankmath-caption`) → [fr.json:221](content/fr.json#L221) · [en.json:221](content/en.json#L221)
- [x] Un texte d’introduction pour chaque catégorie
  - `/espace-deals/` (`s5-seo-2`) → [fr.json:216](content/fr.json#L216) · [en.json:216](content/en.json#L216)
  - `/espace-deals/` (`s8-shot-cat-caption`) → [fr.json:258](content/fr.json#L258) · [en.json:258](content/en.json#L258)
- [x] H1 et H2 propres sur chaque page
  - `/espace-deals/` (`s5-seo-3`) → [fr.json:217](content/fr.json#L217) · [en.json:217](content/en.json#L217)
- [x] Maillage interne catégories ↔ produits (guide retiré : il est prévu)
  - `/espace-deals/` (`s5-seo-4`) → [fr.json:218](content/fr.json#L218) · [en.json:218](content/en.json#L218)
  - `/espace-deals/` (`s5-line`) → [fr.json:209](content/fr.json#L209) · [en.json:209](content/en.json#L209)
- [x] Fil d’Ariane et sitemap XML
  - `/espace-deals/` (`s5-seo-4`) → [fr.json:218](content/fr.json#L218) · [en.json:218](content/en.json#L218)
- [x] Rank Math cité dans la liste d’outils
  - `/` (`tools-tags`) → [fr.json:80](content/fr.json#L80) · [en.json:80](content/en.json#L80)
  - `/about/` (`skills-tools-tags`) → [fr.json:340](content/fr.json#L340) · [en.json:340](content/en.json#L340)
  - `/espace-deals/` (`fact-stack-dd`) → [fr.json:119](content/fr.json#L119) · [en.json:119](content/en.json#L119)

## Données structurées

- [x] Schéma Product / Offer (JSON-LD) sur les fiches produits, validé dans le test des résultats enrichis
  - `/espace-deals/` (`s5-seo-5`) → [fr.json:219](content/fr.json#L219) · [en.json:219](content/en.json#L219)
  - `/espace-deals/` (`s5-shot-rich-caption`) → [fr.json:223](content/fr.json#L223) · [en.json:223](content/en.json#L223)
  - `/` (`case-step-4`) → [fr.json:56](content/fr.json#L56) · [en.json:56](content/en.json#L56)
  - `/` (`skill-3-p`) → [fr.json:73](content/fr.json#L73) · [en.json:73](content/en.json#L73)

## Suivi GA4 + Google Tag Manager (GTM4WP)

- [x] Événements view_item_list, view_item, add_to_cart, begin_checkout, purchase (aussi en dur dans `templates/espace-deals.html`, bloc `.funnel`)
  - `/espace-deals/` (`s7-line`) → [fr.json:242](content/fr.json#L242) · [en.json:242](content/en.json#L242)
  - `/espace-deals/` (`s7-shot-ga4-caption`) → [fr.json:251](content/fr.json#L251) · [en.json:251](content/en.json#L251)
  - `/` (`case-step-6`) → [fr.json:58](content/fr.json#L58) · [en.json:58](content/en.json#L58)
  - `/` (`skill-4-p`) → [fr.json:77](content/fr.json#L77) · [en.json:77](content/en.json#L77)
  - `/about/` (`skills-ecom-6`) → [fr.json:338](content/fr.json#L338) · [en.json:338](content/en.json#L338)
- [x] Vérifiés dans l’Aperçu GTM et GA4 DebugView
  - `/espace-deals/` (`s7-checked`) → [fr.json:249](content/fr.json#L249) · [en.json:249](content/en.json#L249)
- [x] GTM4WP / GA4 cités dans les outils
  - `/` (`tools-tags`) → [fr.json:80](content/fr.json#L80) · [en.json:80](content/en.json#L80)
  - `/about/` (`skills-tools-tags`) → [fr.json:340](content/fr.json#L340) · [en.json:340](content/en.json#L340)
  - `/` (`hero-pills`) → [fr.json:40](content/fr.json#L40) · [en.json:40](content/en.json#L40)

## Test

- [x] Commande test complète avec paiement à la livraison, de la fiche produit à la confirmation
  - `/espace-deals/` (`s6-site-4`) → [fr.json:235](content/fr.json#L235) · [en.json:235](content/en.json#L235)
  - `/espace-deals/` (`s6-shot-order-caption`) → [fr.json:239](content/fr.json#L239) · [en.json:239](content/en.json#L239)
  - `/` (`case-step-5`) → [fr.json:57](content/fr.json#L57) · [en.json:57](content/en.json#L57)

## Démo locale : affirmations alignées (fait le 8 oct. 2026)

- [x] Ligne « Boutique / espacedeals.com [À COMPLÉTER : lien] » retirée de la fiche d’infos
  - `/espace-deals/` (`fact-period-dd`) → [fr.json:115](content/fr.json#L115) · [en.json:115](content/en.json#L115)
- [x] « Mise en ligne prévue » au lieu de « puis mise en ligne »
  - `/espace-deals/` (`s1-build-1`) → [fr.json:144](content/fr.json#L144) · [en.json:144](content/en.json#L144)
- [x] « 26 pages au plan », guide marqué « (prévu) »
  - `/` (`case-fig-pages`) → [fr.json:49](content/fr.json#L49) · [en.json:49](content/en.json#L49)
  - `/` (`case-step-2`) → [fr.json:54](content/fr.json#L54) · [en.json:54](content/en.json#L54)
  - `/espace-deals/` (`s3-h2`) → [fr.json:167](content/fr.json#L167) · [en.json:167](content/en.json#L167)
  - `/espace-deals/` (`s3-line`) → [fr.json:168](content/fr.json#L168) · [en.json:168](content/en.json#L168)
  - `/espace-deals/` (`s3-fig-guide`) → [fr.json:171](content/fr.json#L171) · [en.json:171](content/en.json#L171)
  - `/espace-deals/` (`s3-tree-guide`) → [fr.json:181](content/fr.json#L181) · [en.json:181](content/en.json#L181)
- [x] Politique de confidentialité et lien Facebook retirés de la section 06
  - `/espace-deals/` (`s6-site-1`) → [fr.json:232](content/fr.json#L232) · [en.json:232](content/en.json#L232)
  - `/espace-deals/` (`s6-site-2`) → [fr.json:233](content/fr.json#L233) · [en.json:233](content/en.json#L233)
- [x] Paragraphes Search Console et Meta retirés de la section 07, captures 10 et 12 retirées de la page
  - `/espace-deals/` (`s7-checked`) → [fr.json:249](content/fr.json#L249) · [en.json:249](content/en.json#L249)
  - `/espace-deals/` (`toc-7`) → [fr.json:131](content/fr.json#L131) · [en.json:131](content/en.json#L131)
- [x] Search Console et Meta for WooCommerce présentés comme étapes suivantes
  - `/espace-deals/` (`s9-next-1`) → [fr.json:270](content/fr.json#L270) · [en.json:270](content/en.json#L270)
  - `/espace-deals/` (`s9-next-2`) → [fr.json:271](content/fr.json#L271) · [en.json:271](content/en.json#L271)
- [x] Suivi sur l’accueil : GA4 via GTM, vérifié dans DebugView ; Search Console rattaché à Worku
  - `/` (`case-step-6`) → [fr.json:58](content/fr.json#L58) · [en.json:58](content/en.json#L58)
  - `/` (`skill-4-p`) → [fr.json:77](content/fr.json#L77) · [en.json:77](content/en.json#L77)
- [x] Outils : Search Console et Meta for WooCommerce retirés des outils Espace Deals
  - `/` (`tools-tags`) → [fr.json:80](content/fr.json#L80) · [en.json:80](content/en.json#L80)
  - `/about/` (`skills-tools-tags`) → [fr.json:340](content/fr.json#L340) · [en.json:340](content/en.json#L340)

## Captures d’écran

- [x] Captures 01 à 06 dans `public/espacedeals/` (vraies captures, 1600×1000) : `01-accueil`, `02-categorie`, `03-fiche-produit`, `04-sheet-mots-cles`, `05-import-csv`, `06-livraison-paiement`.
- [x] Captures 07, 08, 09 et 11 dans `public/espacedeals/` (vraies captures, 1600×1000) : `07-rank-math`, `08-rich-results`, `09-ga4-debugview`, `11-commande-test`.
- [x] Captures 10 et 12 retirées de la page tant que la boutique n’est pas en ligne (les fichiers restent dans `public/espacedeals/`).

## À faire

- [ ] Nouveau CV en français (`public/cv/Mohamed-Louai-Bouraoui-CV-FR.pdf`) : l’actuel présente encore un profil Worku / B2B.
- [ ] CV en anglais : ajouter le PDF dans `public/cv/`, puis le mettre en premier dans la liste anglaise de `vite.config.ts` (en attendant, les pages anglaises pointent vers le CV français).
- [ ] Article de guide de la boutique (aujourd’hui « prévu » sur la page).
- [ ] Page Politique de confidentialité de la boutique.
- [ ] Quand la boutique sera en ligne : captures `10-search-console` et `12-catalogue-meta`, les remettre dans la section 07 avec leur texte.

## Autres `[À COMPLÉTER]`

- [x] Plus aucun `[À COMPLÉTER` dans `content/fr.json` et `content/en.json` (`grep -n "À COMPLÉTER" content/*.json`).
