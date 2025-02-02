# Use Node.js LTS version as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the frontend
RUN npm run build

# Install a simple HTTP server
RUN npm install -g serve

# Expose the frontend port
EXPOSE 5173

# Start the frontend server
CMD ["serve", "-s", "dist", "-l", "5173"]
