
# Build the React frontend
FROM node:22-alpine AS frontend-build

WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
RUN npm run build

# Production application
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

# Install backend dependencies, including Express
COPY package*.json ./
RUN npm ci --omit=dev

# Copy backend source code
COPY server.js ./
COPY config ./config
COPY routes ./routes
COPY middleware ./middleware
COPY models ./models

# Copy the compiled React frontend
COPY --from=frontend-build /app/client/dist ./client/dist

EXPOSE 3000

CMD ["node", "server.js"]
