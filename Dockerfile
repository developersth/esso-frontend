# Base image
FROM node:14.17.0-alpine as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build --prod

# Use Nginx as the base image
FROM nginx:1.21.1-alpine

# Copy the built application from the previous stage
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port used by Nginx
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
