# stage 1
# Use the official Node.js 14 image as the base image
FROM node:16.10-alpine as build
# Use an official Node.js runtime as a parent image

# Set the working directory inside the container
WORKDIR /app

RUN apk update && \
    apk add --no-cache tzdata

CMD [ "date" ]
# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the application source code to the container
COPY . .
RUN npm run build --prod

# Serve the app with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/frontend /usr/share/nginx/html

EXPOSE 80
# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
