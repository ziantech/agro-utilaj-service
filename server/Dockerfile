# Use Node.js as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --only=production

# Copy the entire backend source code
COPY . .

# Expose the port used by the backend
EXPOSE 5000

# Start the production server
CMD ["node", "dist/index.prod.js"]
