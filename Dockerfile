# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) into the container
COPY package.json package-lock.json ./

# Install the server dependencies
RUN npm install

# Copy the rest of the server code into the container
COPY . .

# Expose the port the server will run on
EXPOSE 3000

# Command to run the server
CMD ["node", "index.js"]
