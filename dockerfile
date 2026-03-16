# Stage 1: Сборка
FROM node:20-alpine AS build

# Устанавливаем pnpm через corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Копируем файлы зависимостей
COPY pnpm-lock.yaml package.json ./

# Устанавливаем зависимости (frozen-lockfile гарантирует соответствие локфайлу)
RUN pnpm install --frozen-lockfile

# Копируем остальной код и билдим
COPY . .
RUN pnpm run build

# Stage 2: Раздача статики (Nginx)
FROM nginx:stable-alpine

# ГАРАНТИРОВАННО удаляем все стандартные конфиги
RUN rm /etc/nginx/conf.d/*

# Копируем наш кастомный конфиг в папку Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем билд из первого стейджа
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]