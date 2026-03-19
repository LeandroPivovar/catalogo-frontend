# Guia de Deploy - Frontend (Vue.js) 🌐

Este guia explica como compilar e servir o frontend usando o Nginx.

## 1. Configuração de Ambiente
Crie um arquivo `.env.production` na raiz da pasta `frontend` para apontar para o seu backend real:

```env
VUE_APP_API_URL=https://api.seu-dominio.com/api
```

## 2. Gerar o Build de Produção
No seu computador local (ou no servidor se tiver recursos), rode o comando de compilação:

```bash
npm run build
```
Isso criará uma pasta chamada `dist/`. Esta pasta contém os arquivos estáticos (HTML, JS, CSS) que devem ser enviados ao servidor.

## 3. Subir para o Servidor
Envie a pasta `dist/` para o servidor (ex: `/var/www/frontend/dist`).

## 4. Configuração do Nginx
Edite a configuração do Nginx para apontar para a pasta `dist` e lidar com rotas SPA:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        root /var/www/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html; # CRUCIAL para Vue Router
    }

    # Proxy para o Backend (Node.js)
    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 5. Dicas de Otimização
- **SSL/HTTPS:** Recomendamos fortemente o uso do Certbot (Let's Encrypt) para habilitar HTTPS.
- **Cache:** O Nginx já lida bem com cache de arquivos estáticos por padrão.

---
**Pronto!** Seu frontend agora está configurado para o ambiente de produção.
