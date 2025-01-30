# Use Node.js as base image for building
FROM node:18 as build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire project
COPY . .

# Build the Angular project for dashboard
RUN npm run build -- --configuration=production --project=dashboard

# Use Nginx for serving the frontend
FROM nginx:alpine
COPY --from=build /app/dist/dashboard /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
