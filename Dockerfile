# Use an official Node.js runtime as a base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) to install dependencies
COPY ./frontend/package*.json ./

# Install dependencies, including Next.js
RUN npm install
RUN npm install next
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache
RUN chmod -R 777 .

# Copy the rest of the application code
COPY ./frontend/ ./
# TO-DO:check if is necessary
# COPY ./contracts/ ./

# Expose the port that your Next.js app will run on
EXPOSE 3000

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

COPY --chown=nextjs:nodejs ./ ./

# Build the development version and start the app
CMD npm run dev

# Build the production-ready optimized version and start the app
# CMD npm run build && npm run start
