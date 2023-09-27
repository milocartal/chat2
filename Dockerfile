# --------------> The build image
 FROM node:lts-alpine AS build
 WORKDIR /
 COPY package*.json ./
 #RUN --mount=type=secret,mode=0644,id=npmrc,target=/usr/src/app/.npmrc npm ci --only=production
 
 RUN npm install
 
 COPY src ./src
 COPY prisma ./prisma
 COPY public ./public
 COPY tailwind.config.ts ./
 COPY tsconfig.json ./
 COPY prettier.config.mjs ./
 COPY postcss.config.cjs ./
 COPY next.config.mjs ./
 COPY next-env.d.ts ./
 COPY .env ./
 
 RUN npx prisma generate
 RUN npm run build
  
 # --------------> The production image
 FROM node:lts-alpine
 RUN apk add dumb-init
 ENV NODE_ENV production
 USER node
 WORKDIR /
 COPY --chown=node:node --from=build / /
 EXPOSE 3000
 CMD ["dumb-init", "yarn", "start"]