# =========================
# 1. BUILD
# =========================
FROM node:24-alpine AS build

WORKDIR /app

# Copy manifests first so `npm ci` is cached until dependencies actually change.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Same-origin API calls; nginx proxies /api and /uploads to the backend.
ENV VITE_API_BASE_URL=/api
ENV VITE_APP_NAME=TechnoVolt

RUN npm run build


# =========================
# 2. NGINX
# =========================
FROM nginx:alpine AS final

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
