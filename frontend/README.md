# Transcription Frontend

A React base SPA for users to upload audio files for transcriptions

## Project structure
```
frontend/
├── src/
│   ├── api/                 # API integration layer
│   │   ├── endpoints/       # API endpoint definitions
│   │   └── types/          # API related TypeScript types
│   ├── assets/             # Static assets (images, fonts, etc.)
│   ├── components/         # Reusable UI components from ShadCN/ui library
│   │   ├── common/        # Shared components
│   │   ├── forms/         # Form-related components
│   │   └── layout/        # Layout components
│   ├── config/            # Configuration files
│   ├── lib/               # Utility functions and shared logic
│   │   ├── types/        # Global TypeScript types
│   │   └── utils/        # Helper functions
│   ├── App.tsx            # Root component
│   └── main.tsx           # Application entry point
└── public/                # Public static files
```

## Setup and Running
1. Clone the repository and navigate to the frontend directory:
```bash
cd frontend
```

2. Install Dependencies
```bash
npm i
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

The server will be hosted on `http://localhost:5173` by default.

## Development

### Running Tests

