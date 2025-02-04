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
COPY --from=build /dist /usr/share/nginx/html
COPY --from=build nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5001

CMD [ "nginx", "-g", "daemon off;" ]