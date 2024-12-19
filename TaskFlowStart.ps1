# Aller dans le dossier backend
Set-Location -Path "C:\Users\alexi\Documents\M2\DP_DL\Projet\TaskFlow\backend"

# Lancer npm build
npm run build

# Lancer npm start dans une nouvelle fenêtre pour afficher les logs
Start-Process -NoNewWindow -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "npm run start"

# Remonter dans le dossier parent, puis aller dans frontend
Set-Location -Path "..\frontend"

# Lancer le serveur frontend
npm run dev
