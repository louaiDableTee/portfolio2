# Checklist avant publication

**Ne pas fusionner dans `main` tant que toutes les cases ne sont pas cochées.**

Cette liste reprend chaque affirmation écrite comme « fait » qui vient de la section 6B du brief (les tâches en cours de finition). Pour chaque point : la page où il apparaît, la clé du texte, et la ligne exacte dans `content/fr.json` et `content/en.json`. Coche une case seulement quand c’est vraiment fait sur la boutique. Si un point ne sera pas fait, supprime ou réécris le texte aux lignes indiquées.

Les numéros de ligne correspondent à la version de ce commit ; si les fichiers de contenu changent, cherche la clé entre parenthèses.

## Images produits

- [x] Photos libres de droits (Unsplash, Pexels) pour les 20 produits
  - `/espace-deals/` (`s5-pages-2`) → [fr.json:227](content/fr.json#L227) · [en.json:227](content/en.json#L227)
  - `/espace-deals/` (`demo-p`) → [fr.json:132](content/fr.json#L132) · [en.json:132](content/en.json#L132)
- [x] Texte alternatif écrit pour chaque image
  - `/espace-deals/` (`s5-pages-3`) → [fr.json:228](content/fr.json#L228) · [en.json:228](content/en.json#L228)

## Accueil et en-tête de la boutique en français

- [x] Hero, catégories et produits mis en avant
  - `/espace-deals/` (`s6-site-1`) → [fr.json:247](content/fr.json#L247) · [en.json:247](content/en.json#L247)
  - `/` (`case-shot-caption`) → [fr.json:54](content/fr.json#L54) · [en.json:54](content/en.json#L54)
  - `/espace-deals/` (`s8-shot-home-caption`) → [fr.json:271](content/fr.json#L271) · [en.json:271](content/en.json#L271)
- [x] Barre de réassurance : paiement à la livraison, livraison 7 DT / gratuite dès 150 DT, retours
  - `/espace-deals/` (`s6-site-1`) → [fr.json:247](content/fr.json#L247) · [en.json:247](content/en.json#L247)
  - `/` (`case-shot-caption`) → [fr.json:54](content/fr.json#L54) · [en.json:54](content/en.json#L54)
  - `/espace-deals/` (`s8-shot-home-caption`) → [fr.json:271](content/fr.json#L271) · [en.json:271](content/en.json#L271)
- [x] Mon propre logo (lien Facebook retiré du site)
  - `/espace-deals/` (`s6-site-1`) → [fr.json:247](content/fr.json#L247) · [en.json:247](content/en.json#L247)

## SEO on-page avec Rank Math

- [x] Title et meta description pour l’accueil, les 5 catégories et les 20 fiches produits, écrits depuis la sheet
  - `/espace-deals/` (`s5-seo-1`) → [fr.json:230](content/fr.json#L230) · [en.json:230](content/en.json#L230)
  - `/espace-deals/` (`s5-line`) → [fr.json:224](content/fr.json#L224) · [en.json:224](content/en.json#L224)
  - `/` (`case-step-4`) → [fr.json:58](content/fr.json#L58) · [en.json:58](content/en.json#L58)
  - `/espace-deals/` (`s5-shot-rankmath-caption`) → [fr.json:236](content/fr.json#L236) · [en.json:236](content/en.json#L236)
- [x] Un texte d’introduction pour chaque catégorie
  - `/espace-deals/` (`s5-seo-2`) → [fr.json:231](content/fr.json#L231) · [en.json:231](content/en.json#L231)
  - `/espace-deals/` (`s8-shot-cat-caption`) → [fr.json:273](content/fr.json#L273) · [en.json:273](content/en.json#L273)
- [x] H1 et H2 propres sur chaque page
  - `/espace-deals/` (`s5-seo-3`) → [fr.json:232](content/fr.json#L232) · [en.json:232](content/en.json#L232)
- [x] Maillage interne catégories ↔ produits ↔ guide
  - `/espace-deals/` (`s5-seo-4`) → [fr.json:233](content/fr.json#L233) · [en.json:233](content/en.json#L233)
  - `/espace-deals/` (`s5-line`) → [fr.json:224](content/fr.json#L224) · [en.json:224](content/en.json#L224)
- [x] Fil d’Ariane et sitemap XML
  - `/espace-deals/` (`s5-seo-4`) → [fr.json:233](content/fr.json#L233) · [en.json:233](content/en.json#L233)
- [x] Rank Math cité dans la liste d’outils
  - `/` (`tools-tags`) → [fr.json:82](content/fr.json#L82) · [en.json:82](content/en.json#L82)
  - `/about/` (`skills-tools-tags`) → [fr.json:614](content/fr.json#L614) · [en.json:614](content/en.json#L614)
  - `/espace-deals/` (`fact-stack-dd`) → [fr.json:128](content/fr.json#L128) · [en.json:128](content/en.json#L128)

## Données structurées

- [x] Schéma Product / Offer (JSON-LD) sur les fiches produits, validé dans le test des résultats enrichis
  - `/espace-deals/` (`s5-seo-5`) → [fr.json:234](content/fr.json#L234) · [en.json:234](content/en.json#L234)
  - `/espace-deals/` (`s5-shot-rich-caption`) → [fr.json:238](content/fr.json#L238) · [en.json:238](content/en.json#L238)
  - `/` (`case-step-4`) → [fr.json:58](content/fr.json#L58) · [en.json:58](content/en.json#L58)
  - `/` (`skill-3-p`) → [fr.json:75](content/fr.json#L75) · [en.json:75](content/en.json#L75)

## Suivi GA4 + Google Tag Manager (GTM4WP)

- [x] Événements view_item_list, view_item, add_to_cart, begin_checkout, purchase (aussi en dur dans `templates/espace-deals.html`, bloc `.funnel`)
  - `/espace-deals/` (`s7-line`) → [fr.json:257](content/fr.json#L257) · [en.json:257](content/en.json#L257)
  - `/espace-deals/` (`s7-shot-ga4-caption`) → [fr.json:266](content/fr.json#L266) · [en.json:266](content/en.json#L266)
  - `/` (`case-step-6`) → [fr.json:60](content/fr.json#L60) · [en.json:60](content/en.json#L60)
  - `/` (`skill-4-p`) → [fr.json:79](content/fr.json#L79) · [en.json:79](content/en.json#L79)
  - `/about/` (`skills-ecom-6`) → [fr.json:612](content/fr.json#L612) · [en.json:612](content/en.json#L612)
- [x] Vérifiés dans l’Aperçu GTM et GA4 DebugView
  - `/espace-deals/` (`s7-checked`) → [fr.json:264](content/fr.json#L264) · [en.json:264](content/en.json#L264)
- [x] GTM4WP / GA4 cités dans les outils
  - `/` (`tools-tags`) → [fr.json:82](content/fr.json#L82) · [en.json:82](content/en.json#L82)
  - `/about/` (`skills-tools-tags`) → [fr.json:614](content/fr.json#L614) · [en.json:614](content/en.json#L614)
  - `/` (`hero-pills`) → [fr.json:42](content/fr.json#L42) · [en.json:42](content/en.json#L42)

## Test

- [x] Commande test complète avec paiement à la livraison, de la fiche produit à la confirmation
  - `/espace-deals/` (`s6-site-4`) → [fr.json:250](content/fr.json#L250) · [en.json:250](content/en.json#L250)
  - `/espace-deals/` (`s6-shot-order-caption`) → [fr.json:254](content/fr.json#L254) · [en.json:254](content/en.json#L254)
  - `/` (`case-step-5`) → [fr.json:59](content/fr.json#L59) · [en.json:59](content/en.json#L59)

## Démo locale : affirmations alignées (fait le 8 oct. 2026)

- [x] Ligne « Boutique / espacedeals.com [À COMPLÉTER : lien] » retirée de la fiche d’infos
  - `/espace-deals/` (`fact-period-dd`) → [fr.json:124](content/fr.json#L124) · [en.json:124](content/en.json#L124)
- [x] « Mise en ligne prévue » au lieu de « puis mise en ligne »
  - `/espace-deals/` (`s1-build-1`) → [fr.json:159](content/fr.json#L159) · [en.json:159](content/en.json#L159)
- [x] « 26 pages au plan » (le guide n’est plus marqué « prévu » depuis le 9 oct.)
  - `/` (`case-fig-pages`) → [fr.json:51](content/fr.json#L51) · [en.json:51](content/en.json#L51)
  - `/` (`case-step-2`) → [fr.json:56](content/fr.json#L56) · [en.json:56](content/en.json#L56)
  - `/espace-deals/` (`s3-h2`) → [fr.json:182](content/fr.json#L182) · [en.json:182](content/en.json#L182)
  - `/espace-deals/` (`s3-line`) → [fr.json:183](content/fr.json#L183) · [en.json:183](content/en.json#L183)
  - `/espace-deals/` (`s3-fig-guide`) → [fr.json:186](content/fr.json#L186) · [en.json:186](content/en.json#L186)
  - `/espace-deals/` (`s3-tree-guide`) → [fr.json:196](content/fr.json#L196) · [en.json:196](content/en.json#L196)
- [x] Politique de confidentialité et lien Facebook retirés de la section 06
  - `/espace-deals/` (`s6-site-1`) → [fr.json:247](content/fr.json#L247) · [en.json:247](content/en.json#L247)
  - `/espace-deals/` (`s6-site-2`) → [fr.json:248](content/fr.json#L248) · [en.json:248](content/en.json#L248)
- [x] Paragraphes Search Console et Meta retirés de la section 07, captures 10 et 12 retirées de la page
  - `/espace-deals/` (`s7-checked`) → [fr.json:264](content/fr.json#L264) · [en.json:264](content/en.json#L264)
  - `/espace-deals/` (`toc-7`) → [fr.json:146](content/fr.json#L146) · [en.json:146](content/en.json#L146)
- [x] Search Console et Meta for WooCommerce présentés comme étapes suivantes
  - `/espace-deals/` (`s9-next-1`) → [fr.json:285](content/fr.json#L285) · [en.json:285](content/en.json#L285)
  - `/espace-deals/` (`s9-next-2`) → [fr.json:286](content/fr.json#L286) · [en.json:286](content/en.json#L286)
- [x] Suivi sur l’accueil : GA4 via GTM, vérifié dans DebugView ; Search Console rattaché à Worku
  - `/` (`case-step-6`) → [fr.json:60](content/fr.json#L60) · [en.json:60](content/en.json#L60)
  - `/` (`skill-4-p`) → [fr.json:79](content/fr.json#L79) · [en.json:79](content/en.json#L79)
- [x] Outils : Search Console et Meta for WooCommerce retirés des outils Espace Deals
  - `/` (`tools-tags`) → [fr.json:82](content/fr.json#L82) · [en.json:82](content/en.json#L82)
  - `/about/` (`skills-tools-tags`) → [fr.json:614](content/fr.json#L614) · [en.json:614](content/en.json#L614)

## Captures d’écran

- [x] Captures 01 à 06 dans `public/espacedeals/` (vraies captures, 1600×1000) : `01-accueil`, `02-categorie`, `03-fiche-produit`, `04-sheet-mots-cles`, `05-import-csv`, `06-livraison-paiement`.
- [x] Captures 07, 08, 09 et 11 dans `public/espacedeals/` (vraies captures, 1600×1000) : `07-rank-math`, `08-rich-results`, `09-ga4-debugview`, `11-commande-test`.
- [x] Captures 10 et 12 retirées de la page tant que la boutique n’est pas en ligne (les fichiers restent dans `public/espacedeals/`).

## Pages Worku et UX/UI (ajoutées le 8 oct. 2026)

À confirmer avant publication : chaque affirmation doit pouvoir s’expliquer en entretien.

- [ ] `/worku/` : fichier Google Sheets de plus de 200 prospects, avec les colonnes listées (type, spécialité, actif sur LinkedIn, score, statut, prochaine action, notes). Aucune capture, aucun nom : le tableau affiché est un exemple fictif.
- [ ] `/worku/` : enrichissement des contacts avec Worku, FullEnrich, Prospeo et ContactOut ; messages et relances rédigés par moi.
- [ ] `/worku/` : phrase « maquettes et code produits avec Claude Code et Claude Design sous ma direction ; chaque changement vérifié avant mise en ligne ».
- [ ] `/worku/` : environ 9 posts LinkedIn entre février et juillet 2026, en organique uniquement ; les 3 captures de posts sont publiables.
- [ ] `/worku/` et `/ux-ui/` : les captures « live » de worku.tn (accueil, recrutement, prospection commerciale) correspondent encore au site en ligne.
- [x] Aucun chiffre d’abonnés, de trafic ou de conversion ; pas de capture d’abonnés ; bloc « calendrier » retiré.
- [x] Puces techniques retirées de l’accueil et de À propos (robots.txt, redirections 301, types JSON-LD) ; capture Schema Markup Validator retirée.
- [x] Section « Design system » retirée de `/ux-ui/` ; bloc TANIT WEB retiré.
- [x] « Excel » ajouté aux outils (À propos).

## Ajouts du 9 oct. 2026

- [x] Article de guide en ligne sur la boutique locale : « Comment choisir sa planche à découper » (environ 980 mots), relié à la catégorie Planches à découper. Capture `13-guide`.
- [x] Gestion des commandes : confirmation par téléphone avant l’envoi, statuts, notes internes et note client. Capture `14-commande-retour` (commande test n° 1279).
- [x] Retour sous 7 jours : remboursement du produit, remise en stock, motif noté dans la commande.
- [x] Exercice Amazon : 3 produits réécrits au format Amazon.fr, longueurs contrôlées par formule, pas de compte vendeur. Capture `15-fiches-amazon`.
- [x] Rapport KPI sur le compte de démonstration public GA4 (Google Merchandise Store, pas Espace Deals), 4 actions proposées. Captures `16-rapport-kpi` et `17-rapport-kpi-actions`.
- [x] Ligne « Lecture des KPI e-commerce » ajoutée à la carte Suivi de l’accueil.

## Ajouts du 10 oct. 2026

- [x] Accueil : nouvelle intro (« J’ai construit et configuré une boutique WooCommerce complète… ») et 8 étiquettes du hero ; « SEO on-page », « Données structurées » et « Google Search Console » retirés du hero seulement.
- [x] À propos : « faire tourner une boutique » remplacé par « une boutique WooCommerce complète, construite et configurée de A à Z ». Plus aucune occurrence de « faire tourner » / « run a store ».
- [x] Étude de cas : encadré « En 30 secondes » sous l’avis « Boutique de démonstration », 5 liens vers les sections.
- [ ] Section 07 : 4 modèles de messages clients (confirmation, retard, client injoignable, retour) — à confirmer : rédigés par moi pour la boutique de démonstration.
- [x] Contact : adresse e-mail visible dans le bloc bleu (lien mailto) ; déjà visible dans le pied de page de toutes les pages.

## À faire

- [ ] Nouveau CV en français (`public/cv/Mohamed-Louai-Bouraoui-CV-FR.pdf`) : l’actuel présente encore un profil Worku / B2B.
- [ ] CV en anglais : ajouter le PDF dans `public/cv/`, puis le mettre en premier dans la liste anglaise de `vite.config.ts` (en attendant, les pages anglaises pointent vers le CV français).
- [ ] Page Politique de confidentialité de la boutique.
- [ ] Quand la boutique sera en ligne : captures `10-search-console` et `12-catalogue-meta`, les remettre dans la section 07 avec leur texte.

## Autres `[À COMPLÉTER]`

- [x] Plus aucun `[À COMPLÉTER` dans `content/fr.json` et `content/en.json` (`grep -n "À COMPLÉTER" content/*.json`).
