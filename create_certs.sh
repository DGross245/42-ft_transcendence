#!/bin/bash

# Define variables
DOMAIN=$1
DAYS=365
SSL_DIR="./ssl"
PRIVATE_KEY="$SSL_DIR/cert.key"
CERTIFICATE="$SSL_DIR/cert.pem"

# Check if domain argument is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <domain>"
  exit 1
fi

# Create SSL directory if it doesn't exist
if [ ! -d "$SSL_DIR" ]; then
  mkdir -p "$SSL_DIR"
fi

# Generate a Private Key and a Self-Signed Certificate
openssl req -x509 -nodes -days $DAYS -newkey rsa:2048 -keyout "$PRIVATE_KEY" -out "$CERTIFICATE" -subj "/CN=$DOMAIN"

echo "Self-signed certificate and private key have been generated."
echo "Private Key: $PRIVATE_KEY"
echo "Certificate: $CERTIFICATE"
