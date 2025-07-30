# Use latest LTS version of Node
FROM node:lts

# Set working directory inside container
WORKDIR /app

# Copy files into container
COPY . .

# Install dependencies
RUN npm install

# Build the site
RUN npm run build

# Install static file server
RUN npm install -g serve

# Expose port 3000 for preview
EXPOSE 3000

# Serve the site
CMD ["serve", "dist", "-l", "3000"]
