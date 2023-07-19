# Use an official Node runtime as a parent image
FROM node:lts

# Set the working directory
WORKDIR /usr/src/app

# Install the dependencies and nodemon
RUN npm install express body-parser mysql cors

# Copy the rest of the app
COPY 'index.js' .

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Run the app when the container launches using nodemon
CMD ["node", "index.js"]
