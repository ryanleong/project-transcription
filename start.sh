#!/bin/bash

# Start nginx
service nginx start

# Start Flask application
cd /app/backend
python run.py