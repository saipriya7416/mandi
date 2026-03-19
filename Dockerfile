# --- PHASE 1: BUILD ENGINE ---
FROM node:20-alpine AS build

WORKDIR /app

# Enable caching for high build speeds
COPY package*.json ./
RUN npm install

COPY . .

# Compile optimized artifacts
RUN npm run build

# --- PHASE 2: PRODUCTION SERVER ---
FROM nginx:stable-alpine

# Set custom configuration for React/Vite routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Deploy static records to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Serve the Mandi Matrix
CMD ["nginx", "-g", "daemon off;"]
