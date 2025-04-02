# Transcriptions

## Assumptions

1. API only accepts `.mp3` and `.wav` audio files
2. If the filename already exist in the DB, API will return and error saying that it has already been transcribed
3. Search API currently only does simple substring matching

### More info
For more info and running unit test
- Frontend - see `/frontend/README.md`
- Backend - see `/backend/README.md`

## Setup

### Docker Setup
1. Build the Docker image:
  ```bash
  docker build -t project-transcription .
  ```
2. Run the container:
  ```bash
  docker run -p 80:80 -p 5000:5000 project-transcription
  ```
3. Access the application:
  - Frontend: http://localhost
  - Backend API: http://localhost:5000

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
  docker rmi project-transcription
  ```
