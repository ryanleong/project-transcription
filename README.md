# Transcriptions

## Assumptions

1. API only accepts `.mp3` and `.wav` audio files
2. If the filename already exist in the DB, API will return and error saying that it has already been transcribed

## Setup

### Option 1: Docker Setup (Recommended)
1. Install Docker Desktop for Windows from https://www.docker.com/products/docker-desktop
2. Build the Docker image:
  ```bash
  docker build -t project-encode .
  ```
3. Run the container:
  ```bash
  docker run -p 80:80 -p 5000:5000 project-encode
  ```
4. Access the application:
  - Frontend: http://localhost
  - Backend API: http://localhost/api

#### Stopping and Cleaning Up Docker
1. To stop a running container:
  ```bash
  # List running containers
  docker ps

  # Stop the container (replace CONTAINER_ID with the ID from docker ps)
  docker stop CONTAINER_ID
  ```
2. To remove the container:
  ```bash
  docker rm CONTAINER_ID
  ```
3. To remove the image:
  ```bash
  docker rmi project-encode
  ```

### Option 2: Manual Setup
Frontend - see `/frontend/README.md`
Backend - see `/backend/README.md`