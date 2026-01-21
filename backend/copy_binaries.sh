#!/bin/bash
# Copy Prisma binaries to project directory so they're included in deployment

echo "Copying Prisma binaries..."

# Find and copy the query engine binary
BINARY_SOURCE=$(find /opt/render/.cache/prisma-python/binaries -name "query-engine-debian-openssl-3.0.x" 2>/dev/null | head -1)

if [ -n "$BINARY_SOURCE" ]; then
    echo "Found binary at: $BINARY_SOURCE"
    cp "$BINARY_SOURCE" ./prisma-query-engine-debian-openssl-3.0.x
    chmod +x ./prisma-query-engine-debian-openssl-3.0.x
    echo "✓ Binary copied successfully"
    ls -lh ./prisma-query-engine-debian-openssl-3.0.x
else
    echo "✗ Binary not found!"
    exit 1
fi
