# Build stage for frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
# Add verbose output and ensure build completes
RUN npm run build || (echo "Build failed" && exit 1)

# Build stage for backend
FROM python:3.11-slim AS backend-build
WORKDIR /app/backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .

# Final stage
FROM python:3.11-slim
WORKDIR /app

# Install dos2unix and nginx
RUN apt-get update && apt-get install -y nginx dos2unix && rm -rf /var/lib/apt/lists/*

# Copy backend
COPY --from=backend-build /app/backend /app/backend
COPY --from=backend-build /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

# Configure nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy and setup start script
COPY start.sh /app/start.sh
RUN dos2unix /app/start.sh && chmod +x /app/start.sh

# Expose ports
EXPOSE 80
EXPOSE 5000

CMD ["/app/start.sh"]