### 1. Authentification
Avant tout, vous devez lier votre ordinateur à votre compte Supabase :

```bash
npx supabase login
```
*(Une fenêtre de navigateur s'ouvrira pour vous demander de confirmer)*

### 2. Configuration des Secrets (Identifiants)
Une fois connecté, exécutez ces commandes :

```bash
# Remplacez les valeurs ci-dessous par vos identifiants réels
npx supabase secrets set TWILIO_ACCOUNT_SID=AC...VOTRE_ACCOUNT_SID
npx supabase secrets set TWILIO_AUTH_TOKEN=dc...VOTRE_AUTH_TOKEN
npx supabase secrets set TWILIO_FROM_NUMBER="+18382063137"
```

### 2. Déploiement de la Fonction
Utilisez `npx` pour exécuter la CLI sans l'installer globalement :

```bash
# Créez le dossier de la fonction
npx supabase functions new send-sms

# Copiez le contenu de 'supabase-edge-function.js' dans 'supabase/functions/send-sms/index.ts'

# Déployez (il vous demandera peut-être de vous connecter : npx supabase login)
npx supabase functions deploy send-sms
```

---

### Ce que j'ai déjà fait dans le code :
- [x] **Installation** de `@supabase/supabase-js`.
- [x] **Fichier de configuration** : [.env.local](file:///Users/auniellatanoh/Auni/school/.env.local) créé avec vos clés.
- [x] **Client Supabase** : [src/lib/supabase.js](file:///Users/auniellatanoh/Auni/school/src/lib/supabase.js) créé.
- [x] **Service Twilio** : [src/services/twilioService.js](file:///Users/auniellatanoh/Auni/school/src/services/twilioService.js) créé.
- [x] **Lien UI** : L'envoi est maintenant actif dans le tableau de bord Établissement et l'Appel des professeurs.

> [!NOTE]
> J'ai remarqué que votre Account SID commence par `US`. D'habitude, les SID Twilio commencent par `AC`. Vérifiez bien dans votre console Twilio si c'est le bon identifiant principal.
