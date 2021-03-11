FROM node:14.16.0

WORKDIR /usr/src/app

# Copy dependencies 
COPY package.json ./
COPY yarn.lock ./

# Install dependencies and copy all the things
RUN yarn
COPY . .

# Set production .env
COPY .env.production .env

# Compile JS from TS
RUN yarn build

# Docker for prod only, for now
ENV NODE_ENV production

# Run server
EXPOSE 8080
CMD [ "node", "dist/server.js" ]

# Use a more secure user
COPY --chown=node:node . /user/src/app
USER node