FROM node:20

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Run Prisma migrations
# RUN npx prisma migrate deploy

# Build the TypeScript code
RUN yarn build

# Expose the port the app runs on
EXPOSE 4000

# Start the application
CMD ["yarn", "prod"]