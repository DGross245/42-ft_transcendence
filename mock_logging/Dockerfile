# Use the official Node.js image
FROM node:14

# Set the working directory in the container
WORKDIR .

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the Node.js script to the working directory
COPY server.js .

# Start the script
CMD ["node", "server.js"]
