# syntax=docker/dockerfile:1

FROM alpine:3.6

# You can change Pocketbase version here
ARG POCKETBASE_VERSION=0.8.0

# Install the dependencies
RUN apk add --no-cache \
    ca-certificates \
    unzip \
    wget \
    zip \
    zlib-dev \
    bash

# Download Pocketbase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${POCKETBASE_VERSION}/pocketbase_${POCKETBASE_VERSION}_linux_amd64.zip /tmp/pocketbase.zip
RUN unzip /tmp/pocketbase.zip -d /usr/local/bin
RUN chmod +x /usr/local/bin/pocketbase

# Start Pocketbase
CMD [ "/usr/local/bin/pocketbase", "serve", "--http=0.0.0.0:5000", "--dir=/pb_data", "--publicDir=/pb_public" ]
