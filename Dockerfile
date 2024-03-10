# Use an official Node.js runtime as a base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

COPY ./frontend/ ./

RUN chmod -R 777 .

# Install dependencies, including Next.js
RUN npm install
RUN npm install next

# Expose the port that Next.js app will run on
EXPOSE 3000

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

COPY --chown=nextjs:nodejs ./ ./

# Build the production-ready optimized version and start the app
CMD npm run build && npm run start
