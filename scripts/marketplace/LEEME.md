# Marketplace: un solo registro
`publicados.json` es la lista única de lo ya subido a Facebook (la usan todos los chats).
Antes de publicar: `git pull`. Cada ~10 publicaciones: commit + `git pull --rebase` + push.
Si hay conflicto en publicados.json, unir las listas (no borrar nada).
`revisar` y `duplicados_descartados` NO se publican.
