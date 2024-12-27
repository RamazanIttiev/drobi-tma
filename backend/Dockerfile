# Use Node.js base image
FROM node:alpine as build

# Set the working directory
WORKDIR /home/user/backend-app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Alternatively, for a clean install
RUN npm ci

# Bundle app source code
COPY . .

RUN npm run build

RUN npm prune --production

# Expose the application's port
EXPOSE 8443

# Start the application
CMD [ "node", "." ]