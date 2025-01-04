# Use Node.js base image
FROM node:20-alpine as build

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Bundle app source code
COPY . .

RUN npm run build

RUN npm prune --production

EXPOSE 8080
# Start the application
CMD [ "node", "." ]