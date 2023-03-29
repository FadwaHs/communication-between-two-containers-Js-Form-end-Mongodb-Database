FROM ubuntu:latest

# Update package list and install required dependencies
RUN apt-get update && apt-get install -y gnupg wget

# Import the MongoDB public GPG key
RUN wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -

# Add MongoDB repository to sources.list.d
RUN echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list

RUN wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.0g-2ubuntu4_amd64.deb
RUN dpkg -i libssl1.1_1.1.0g-2ubuntu4_amd64.deb

# Install MongoDB
RUN apt-get update && apt-get install -y mongodb-org

# Expose MongoDB default port
EXPOSE 27017

# Start MongoDB service
CMD ["mongod", "--bind_ip_all"]

