# Use a Node.js base image for building
FROM node:20-alpine as build

# Copy package.json and package-lock.json
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn

# Copy the rest of the application code
COPY . .

# Build the application for production
RUN yarn run build

# Use a lightweight web server for serving static files
FROM nginx:alpine

# Copy built files from the previous stage
COPY --from=build frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000

CMD [ "nginx", "-g", "daemon off;" ]