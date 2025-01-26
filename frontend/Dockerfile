FROM node:18-alpine

WORKDIR /app

# Add development dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose port
EXPOSE 3000

CMD ["npm", "run", "dev"]