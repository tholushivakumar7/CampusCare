
# Stage 1: Build the React frontend
FROM node:22-alpine AS frontend-build

WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
RUN npm run build


# Stage 2: Run the CampusCare server
FROM node:22-alpine

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

COPY package.json server.js ./
COPY test ./test

# Include the compiled React dashboard
COPY --from=frontend-build /app/client/dist ./client/dist

USER node

EXPOSE 3000

CMD ["node", "server.js"]
