# Configuration Finale Twilio & Supabase

Pour que les messages soient réellement envoyés, vous devez déployer la "Edge Function" sur votre projet Supabase.

### 1. Configuration des Secrets (Identifiants)
Ouvrez votre terminal et exécutez ces commandes pour enregistrer vos clés Twilio de manière sécurisée dans Supabase :

```bash
supabase secrets set TWILIO_ACCOUNT_SID=US6783bab35990c5ec2b58378ec80152eb
supabase secrets set TWILIO_AUTH_TOKEN=XLNVAJGAW7SSULP5LVEFRY2X
supabase secrets set TWILIO_FROM_NUMBER="+18382063137"
```

### 2. Déploiement de la Fonction
Si vous avez installé la CLI Supabase, exécutez :

```bash
# Créez le dossier de la fonction
supabase functions new send-sms

# Copiez le contenu de 'supabase-edge-function.js' dans 'supabase/functions/send-sms/index.ts'

# Déployez
supabase functions deploy send-sms
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
