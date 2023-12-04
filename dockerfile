# ----------------------------------------
## Build for Local development
# ----------------------------------------

FROM node:20-alpine as development

# ----------------------------------------
## Build for production
# ----------------------------------------
FROM development as build

COPY . .

ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV=production

# for devDependencies
RUN NODE_ENV=development npm ci 
RUN NODE_ENV=production npm run build
RUN npm prune --production
USER node

# ----------------------------------------
## Run for production
# ----------------------------------------
FROM development as production

COPY --chown=node:node --from=build /dist /dist
COPY --chown=node:node --from=build /node_modules /node_modules
# COPY --chown=node:node --from=build /.env.production /.env.production

ENV NODE_ENV=production

CMD ["node", "dist/main.js"]
EXPOSE 3000
USER node
