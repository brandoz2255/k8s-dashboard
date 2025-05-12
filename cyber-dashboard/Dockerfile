FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package files and install dependencies (this layer is cached)
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port Next.js uses (default is 3000)
EXPOSE 3000

# Start Next.js in development mode with hot reloading
CMD ["npm", "run", "dev"]

