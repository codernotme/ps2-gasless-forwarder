FROM node:18-alpine

WORKDIR /app

# Install dependencies only when needed
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Build for production
RUN npm run build

# Use development server by default
CMD ["npm", "run", "dev"]

# Production command (override in docker-compose)
# CMD ["npm", "start"] 