# Sitecore Quiz Application

A React TypeScript application with SCSS styling that connects to Sitecore using GraphQL queries. This application provides an API layer to interact with Sitecore's GraphQL endpoint and a modern React frontend to display and interact with Sitecore content.

## Features

- **React 18** with TypeScript for type-safe development
- **SCSS** for advanced styling with variables and mixins
- **Express API Server** that proxies requests to Sitecore GraphQL
- **Sitecore GraphQL Integration** for fetching items and their fields
- **Component-based Architecture** for displaying Sitecore content
- **Modern Development Tools** with hot reloading and error handling

## Project Structure

```
sitecore-quiz/
├── public/                  # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── SitecoreItemDisplay.tsx
│   │   ├── SitecoreItemDisplay.scss
│   │   └── index.ts
│   ├── services/          # API services
│   │   ├── sitecoreService.ts
│   │   └── index.ts
│   ├── styles/            # SCSS stylesheets
│   │   ├── _variables.scss
│   │   ├── index.scss
│   │   └── App.scss
│   ├── types/             # TypeScript type definitions
│   │   ├── sitecore.ts
│   │   └── index.ts
│   ├── App.tsx
│   └── index.tsx
├── server/                # Express API server
│   └── api.js
├── package.json
├── tsconfig.json
└── .env                   # Environment configuration
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Access to a Sitecore instance with GraphQL enabled

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd sitecore-quiz
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```
   
   Update the following variables in `.env`:
   ```env
   # Sitecore Configuration
   SITECORE_GRAPHQL_ENDPOINT=https://your-sitecore-instance.com/sitecore/api/graph/edge
   SITECORE_API_KEY=your-api-key-here
   SITECORE_SITE_NAME=your-site-name
   SITECORE_LANGUAGE=en

   # React App Configuration  
   REACT_APP_SITECORE_ENDPOINT=http://localhost:3002/api/sitecore
   REACT_APP_SITECORE_API_KEY=your-api-key-here
   REACT_APP_SITECORE_SITE_NAME=your-site-name
   ```

### Running the Application

The application consists of two servers that need to run simultaneously:

1. **Start the API Server (Terminal 1):**
   ```bash
   npm run serve-api
   ```
   This starts the Express server on `http://localhost:3002`

2. **Start the React App (Terminal 2):**
   ```bash
   npm start
   ```
   This starts the React development server on `http://localhost:3001`

### Available Scripts

- `npm start` - Runs the React app in development mode
- `npm run build` - Builds the React app for production
- `npm run serve-api` - Starts the Express API server
- `npm test` - Runs the test suite

## API Endpoints

The Express server provides the following endpoints:

### Health Check
```
GET /api/health
```
Returns the server status and timestamp.

### Get Sitecore Item
```
GET /api/sitecore/item?path=/sitecore/content/Home&includeChildren=true
```
Fetches a Sitecore item by path with optional children.

### Get Multiple Items
```
POST /api/sitecore/items
Content-Type: application/json

{
  "ids": ["item-id-1", "item-id-2"]
}
```
Fetches multiple Sitecore items by their IDs.

### GraphQL Proxy
```
POST /api/sitecore
Content-Type: application/json

{
  "query": "query GetItem($path: String!) { item(path: $path) { id name } }",
  "variables": { "path": "/sitecore/content/Home" }
}
```
Proxies GraphQL queries directly to Sitecore.

## Development

### Running Both Servers

To run both the React app and API server simultaneously, you'll need two terminal windows:

**Terminal 1 (API Server):**
```bash
cd sitecore-quiz
npm run serve-api
```

**Terminal 2 (React App):**
```bash
cd sitecore-quiz
npm start
```

The React app will be available at `http://localhost:3001` and the API server at `http://localhost:3002`.

## Next Steps

This foundation supports building:

- **Quiz Components** - Interactive quiz interfaces using Sitecore content
- **Content Management** - CRUD operations for Sitecore items
- **Authentication** - User login and personalization features
- **Caching** - Response caching for improved performance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

- **React 18** with TypeScript support
- **SCSS** for advanced styling with variables and mixins
- **Sitecore GraphQL Integration** via a custom API server
- **Express API Server** to proxy requests to Sitecore
- **Responsive Design** with modern UI components
- **Type-safe** Sitecore data models

## Project Structure

```
├── public/                 # Static files
├── src/
│   ├── components/        # React components
│   ├── services/          # API services (Sitecore integration)
│   ├── styles/           # SCSS stylesheets
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main React component
│   └── index.tsx         # React entry point
├── server/
│   └── api.js            # Express API server for Sitecore GraphQL
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

1. Copy the example environment file:
```bash
copy .env.example .env
```

2. Edit `.env` and configure your Sitecore settings:
```env
# Sitecore Configuration
SITECORE_GRAPHQL_ENDPOINT=https://your-sitecore-instance.com/sitecore/api/graph/edge
SITECORE_API_KEY=your-api-key-here
SITECORE_SITE_NAME=website
SITECORE_LANGUAGE=en

# React App Configuration
REACT_APP_SITECORE_ENDPOINT=http://localhost:3001/api/sitecore
REACT_APP_SITECORE_API_KEY=your-api-key-here
REACT_APP_SITECORE_SITE_NAME=website

# Server Configuration
PORT=3001
```

### 3. Running the Application

You'll need to run both the React app and the API server:

#### Terminal 1 - Start the API Server:
```bash
npm run serve-api
```

#### Terminal 2 - Start the React App:
```bash
npm start
```

The React app will be available at `http://localhost:3000` and the API server at `http://localhost:3001`.

## API Endpoints

The Express server provides the following endpoints:

- `GET /api/health` - Health check
- `POST /api/sitecore` - GraphQL proxy to Sitecore
- `GET /api/sitecore/item?path=/sitecore/content/Home&includeChildren=true` - Get specific item
- `POST /api/sitecore/items` - Get multiple items by IDs

## Sitecore GraphQL Integration

The application includes a `SitecoreService` class that provides:

- **getItem(path, includeChildren)** - Fetch a single item by path
- **getItemByIds(itemIds)** - Fetch multiple items by their IDs
- **getFieldValue(item, fieldName)** - Helper to extract field values

### Example Usage

```typescript
import { SitecoreService } from './services/sitecoreService';

const service = new SitecoreService();

// Fetch the Home item with children
const homeItem = await service.getItem('/sitecore/content/Home', true);

// Get a specific field value
const title = service.getFieldValue(homeItem, 'Title');
```

## Components

- **SitecoreItemDisplay** - Renders Sitecore items with fields and children
- Responsive design with SCSS modules
- Type-safe props and state management

## Styling

The application uses SCSS with:
- **Variables** for colors, fonts, and spacing
- **Mixins** for reusable styles
- **Responsive design** patterns
- **Component-specific** stylesheets

## Development

### Available Scripts

- `npm start` - Run the React development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run serve-api` - Start the API server

### Adding New Features

1. Create TypeScript interfaces in `src/types/`
2. Add services in `src/services/`
3. Create components in `src/components/`
4. Add styles in `src/styles/`

## Next Steps

This foundation provides:
- ✅ React TypeScript setup with SCSS
- ✅ Sitecore GraphQL API integration
- ✅ Express server for API proxying
- ✅ Type-safe data models
- ✅ Responsive UI components

You can now build on this foundation to:
- Add quiz functionality
- Create more complex Sitecore queries
- Add routing and navigation
- Implement user authentication
- Add real-time features