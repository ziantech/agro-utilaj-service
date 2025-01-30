# Use an official Node.js image to build the Angular app
FROM node:18 as build

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the entire admin panel source code
COPY . .

# Build the Angular application
RUN npm run build --configuration production

# Use Nginx to serve the built Angular app
FROM nginx:latest
COPY --from=build /app/dist/admin /usr/share/nginx/html

# Expose the HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
