# Use a Node.js base image for building
FROM node:alpine as build

# Set the working directory
WORKDIR /home/user/frontend-app

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
COPY --from=build /home/user/frontend-app/build /usr/share/nginx/html

# Expose HTTP and HTTPS ports
EXPOSE 80 443

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]