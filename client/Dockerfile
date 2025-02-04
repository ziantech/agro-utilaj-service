# Stage 1: Build Angular app
FROM node:18 AS build
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --output-path=dist/client --configuration production

# Stage 2: Serve with NGINX
FROM nginx:alpine
COPY --from=build /usr/src/app/dist/client /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
