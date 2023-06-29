# Use an official Node.js runtime as the base image
FROM node:18.16.1 as nodeWork 

# 16.20.1

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install project dependencies
RUN npm install --legacy-peer-deps || npm install --legacy-peer-deps --force



# Copy the rest of the app's source code
COPY . .

# Build the React app
RUN npm run build

# Expose the desired port
EXPOSE 8080


# Specify the command to run when the container starts
CMD ["npm", "start"]

# # Nginx block code
# FROM nginx:alpine

# # Working directory
# WORKDIR /usr/share/nginx/html

# # Remove from current directory
# RUN rm -rf ./*

# # Copy
# COPY --from=nodeWork /app/dist .

# # Entrypoint
# ENTRYPOINT [ "nginx", "-g", "daemon off;" ]


