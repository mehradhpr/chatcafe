# Use an official Node runtime as a parent image
FROM node:lts

# Set the working directory
WORKDIR /usr/src/app

# Install the required packages
RUN npm install -g create-react-app
RUN create-react-app .
RUN npm install react react-dom react-router-dom


# Copy the rest of the app
COPY . ./src

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define environment variable
ENV NODE_ENV development

# Run the app when the container launches
CMD ["npm", "start"]