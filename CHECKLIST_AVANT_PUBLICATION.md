# Checklist avant publication

**Ne pas fusionner dans `main` tant que toutes les cases ne sont pas cochées.**

Cette liste reprend chaque affirmation écrite comme « fait » qui vient de la section 6B du brief (les tâches en cours de finition). Pour chaque point : la page où il apparaît, la clé du texte, et la ligne exacte dans `content/fr.json` et `content/en.json`. Coche une case seulement quand c’est vraiment fait sur la boutique. Si un point ne sera pas fait, supprime ou réécris le texte aux lignes indiquées.

Les numéros de ligne correspondent à la version de ce commit ; si les fichiers de contenu changent, cherche la clé entre parenthèses.

## Images produits générées par IA

- [ ] Un seul style d’image pour les 20 produits
  - `/espace-deals/` (`s5-pages-2`) → [fr.json:212](content/fr.json#L212) · [en.json:212](content/en.json#L212)
- [ ] Chaque image respecte les caractéristiques réelles du produit (matière, taille)
  - `/espace-deals/` (`s5-pages-2`) → [fr.json:212](content/fr.json#L212) · [en.json:212](content/en.json#L212)
- [ ] Texte alternatif écrit pour chaque image
  - `/espace-deals/` (`s5-pages-3`) → [fr.json:213](content/fr.json#L213) · [en.json:213](content/en.json#L213)
- [ ] La génération par IA est indiquée sur le site
  - `/espace-deals/` (`s5-pages-4`) → [fr.json:214](content/fr.json#L214) · [en.json:214](content/en.json#L214)
  - `/espace-deals/` (`demo-p`) → [fr.json:123](content/fr.json#L123) · [en.json:123](content/en.json#L123)
- [ ] Outil utilisé pour les images renseigné (remplacer le `[À COMPLÉTER]`)
  - `/espace-deals/` (`s5-pages-2`) → [fr.json:212](content/fr.json#L212) · [en.json:212](content/en.json#L212)

## Accueil et en-tête de la boutique en français

- [ ] Hero, catégories et produits mis en avant
  - `/espace-deals/` (`s6-site-1`) → [fr.json:233](content/fr.json#L233) · [en.json:233](content/en.json#L233)
  - `/` (`case-shot-caption`) → [fr.json:51](content/fr.json#L51) · [en.json:51](content/en.json#L51)
  - `/espace-deals/` (`s8-shot-home-caption`) → [fr.json:265](content/fr.json#L265) · [en.json:265](content/en.json#L265)
- [ ] Barre de réassurance : paiement à la livraison, livraison 7 DT / gratuite dès 150 DT, retours
  - `/espace-deals/` (`s6-site-1`) → [fr.json:233](content/fr.json#L233) · [en.json:233](content/en.json#L233)
  - `/` (`case-shot-caption`) → [fr.json:51](content/fr.json#L51) · [en.json:51](content/en.json#L51)
  - `/espace-deals/` (`s8-shot-home-caption`) → [fr.json:265](content/fr.json#L265) · [en.json:265](content/en.json#L265)
- [ ] Mon propre logo et lien vers la page Facebook
  - `/espace-deals/` (`s6-site-1`) → [fr.json:233](content/fr.json#L233) · [en.json:233](content/en.json#L233)

## SEO on-page avec Rank Math

- [ ] Title et meta description pour chacune des 26 pages, écrits depuis la sheet
  - `/espace-deals/` (`s5-seo-1`) → [fr.json:216](content/fr.json#L216) · [en.json:216](content/en.json#L216)
  - `/espace-deals/` (`s5-line`) → [fr.json:209](content/fr.json#L209) · [en.json:209](content/en.json#L209)
  - `/` (`case-step-4`) → [fr.json:55](content/fr.json#L55) · [en.json:55](content/en.json#L55)
  - `/espace-deals/` (`s5-shot-rankmath-caption`) → [fr.json:222](content/fr.json#L222) · [en.json:222](content/en.json#L222)
- [ ] Un texte d’introduction pour chaque catégorie
  - `/espace-deals/` (`s5-seo-2`) → [fr.json:217](content/fr.json#L217) · [en.json:217](content/en.json#L217)
  - `/espace-deals/` (`s8-shot-cat-caption`) → [fr.json:267](content/fr.json#L267) · [en.json:267](content/en.json#L267)
- [ ] H1 et H2 propres sur chaque page
  - `/espace-deals/` (`s5-seo-3`) → [fr.json:218](content/fr.json#L218) · [en.json:218](content/en.json#L218)
- [ ] Maillage interne catégories ↔ produits ↔ guide
  - `/espace-deals/` (`s5-seo-4`) → [fr.json:219](content/fr.json#L219) · [en.json:219](content/en.json#L219)
  - `/espace-deals/` (`s5-line`) → [fr.json:209](content/fr.json#L209) · [en.json:209](content/en.json#L209)
- [ ] Fil d’Ariane et sitemap XML
  - `/espace-deals/` (`s5-seo-4`) → [fr.json:219](content/fr.json#L219) · [en.json:219](content/en.json#L219)
- [ ] Rank Math cité dans la liste d’outils
  - `/` (`tools-tags`) → [fr.json:79](content/fr.json#L79) · [en.json:79](content/en.json#L79)
  - `/about/` (`skills-tools-tags`) → [fr.json:346](content/fr.json#L346) · [en.json:346](content/en.json#L346)
  - `/espace-deals/` (`fact-stack-dd`) → [fr.json:117](content/fr.json#L117) · [en.json:117](content/en.json#L117)

## Données structurées

- [ ] Schéma Product / Offer (JSON-LD) sur les fiches produits, validé dans le test des résultats enrichis
  - `/espace-deals/` (`s5-seo-5`) → [fr.json:220](content/fr.json#L220) · [en.json:220](content/en.json#L220)
  - `/espace-deals/` (`s5-shot-rich-caption`) → [fr.json:224](content/fr.json#L224) · [en.json:224](content/en.json#L224)
  - `/` (`case-step-4`) → [fr.json:55](content/fr.json#L55) · [en.json:55](content/en.json#L55)
  - `/` (`skill-3-p`) → [fr.json:72](content/fr.json#L72) · [en.json:72](content/en.json#L72)

## Suivi GA4 + Google Tag Manager (GTM4WP)

- [ ] Événements view_item_list, view_item, add_to_cart, begin_checkout, purchase (aussi en dur dans `templates/espace-deals.html`, bloc `.funnel`)
  - `/espace-deals/` (`s7-line`) → [fr.json:243](content/fr.json#L243) · [en.json:243](content/en.json#L243)
  - `/espace-deals/` (`s7-shot-ga4-caption`) → [fr.json:256](content/fr.json#L256) · [en.json:256](content/en.json#L256)
  - `/` (`case-step-6`) → [fr.json:57](content/fr.json#L57) · [en.json:57](content/en.json#L57)
  - `/` (`skill-4-p`) → [fr.json:76](content/fr.json#L76) · [en.json:76](content/en.json#L76)
  - `/about/` (`skills-ecom-6`) → [fr.json:344](content/fr.json#L344) · [en.json:344](content/en.json#L344)
- [ ] Vérifiés dans l’Aperçu GTM et GA4 DebugView
  - `/espace-deals/` (`s7-checked`) → [fr.json:250](content/fr.json#L250) · [en.json:250](content/en.json#L250)
- [ ] GTM4WP / GA4 cités dans les outils
  - `/` (`tools-tags`) → [fr.json:79](content/fr.json#L79) · [en.json:79](content/en.json#L79)
  - `/about/` (`skills-tools-tags`) → [fr.json:346](content/fr.json#L346) · [en.json:346](content/en.json#L346)
  - `/` (`hero-pills`) → [fr.json:39](content/fr.json#L39) · [en.json:39](content/en.json#L39)

## Légal et test

- [ ] Page Politique de confidentialité
  - `/espace-deals/` (`s6-site-2`) → [fr.json:234](content/fr.json#L234) · [en.json:234](content/en.json#L234)
- [ ] Commande test complète avec paiement à la livraison, de la fiche produit à la confirmation
  - `/espace-deals/` (`s6-site-4`) → [fr.json:236](content/fr.json#L236) · [en.json:236](content/en.json#L236)
  - `/espace-deals/` (`s6-shot-order-caption`) → [fr.json:240](content/fr.json#L240) · [en.json:240](content/en.json#L240)
  - `/` (`case-step-5`) → [fr.json:56](content/fr.json#L56) · [en.json:56](content/en.json#L56)

## En ligne

- [ ] Boutique publiée sur espacedeals.com (puis remplacer `[À COMPLÉTER : lien]` par le vrai lien)
  - `/espace-deals/` (`s1-build-1`) → [fr.json:144](content/fr.json#L144) · [en.json:144](content/en.json#L144)
  - `/espace-deals/` (`fact-store-dd`) → [fr.json:121](content/fr.json#L121) · [en.json:121](content/en.json#L121)
- [ ] Google Search Console : domaine vérifié, sitemap soumis, pages clés inspectées
  - `/espace-deals/` (`s7-gsc-p`) → [fr.json:252](content/fr.json#L252) · [en.json:252](content/en.json#L252)
  - `/espace-deals/` (`s7-shot-gsc-caption`) → [fr.json:258](content/fr.json#L258) · [en.json:258](content/en.json#L258)
  - `/` (`case-step-6`) → [fr.json:57](content/fr.json#L57) · [en.json:57](content/en.json#L57)

## Meta

- [ ] Page Facebook Espace Deals connectée à la boutique
  - `/espace-deals/` (`s7-meta-p`) → [fr.json:254](content/fr.json#L254) · [en.json:254](content/en.json#L254)
- [ ] Meta Pixel installé
  - `/espace-deals/` (`s7-meta-p`) → [fr.json:254](content/fr.json#L254) · [en.json:254](content/en.json#L254)
- [ ] Catalogue produits synchronisé avec Meta (Meta for WooCommerce), sans campagne
  - `/espace-deals/` (`s7-meta-p`) → [fr.json:254](content/fr.json#L254) · [en.json:254](content/en.json#L254)
  - `/espace-deals/` (`s7-shot-meta-caption`) → [fr.json:260](content/fr.json#L260) · [en.json:260](content/en.json#L260)
  - `/` (`tools-tags`) → [fr.json:79](content/fr.json#L79) · [en.json:79](content/en.json#L79)
  - `/about/` (`skills-tools-tags`) → [fr.json:346](content/fr.json#L346) · [en.json:346](content/en.json#L346)

## Captures d’écran

- [ ] Les 12 captures sont dans `public/espacedeals/` (mêmes noms de fichier) et remplacent les images « Capture à venir ».
- [ ] Si une capture n’a pas le format 1600×1000, ses `width`/`height` sont mis à jour dans `templates/espace-deals.html` (et `templates/index.html` pour `01-accueil.webp`).

## Autres `[À COMPLÉTER]`

- [ ] Plus aucun `[À COMPLÉTER` dans `content/fr.json` et `content/en.json` (`grep -n "À COMPLÉTER" content/*.json`).
