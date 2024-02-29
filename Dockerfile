
# https://hub.docker.com/_/node
FROM node:16

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy local code to the container image.
COPY . .

# Install production dependencies.
RUN npm install

# Adjust this line to correctly reference the location of server.js
CMD [ "node", "src/server.js" ]