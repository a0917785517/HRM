# Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm ci || yarn install --frozen-lockfile || pnpm install --frozen-lockfile
COPY . .
RUN npm run build || yarn build || pnpm build

# Serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# 覆蓋預設站台設定，加入 /api 反代
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
