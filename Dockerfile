# Choose the Node.js base image
FROM --platform=linux/amd64 node:20.9.0

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Prisma
RUN npx prisma generate

# Build the Next.js app
RUN npm run build

# Expose the port that your app runs on
EXPOSE 3000

# Start the app
CMD [ "npm", "start" ]

# Run the development server
# CMD ["npm", "run", "dev"]