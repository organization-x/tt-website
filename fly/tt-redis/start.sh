#!/bin/sh

# Prevent redis from throwing memory warnings
sysctl vm.overcommit_memory=1
sysctl net.core.somaxconn=1024

# Start server with secrets password
redis-server redis.conf --requirepass $REDIS_PASSWORD
