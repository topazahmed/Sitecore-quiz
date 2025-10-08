const express = require("express");
const cors = require("cors");
const axios = require("axios");
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sitecore Quiz API',
      version: '1.0.0',
      description: 'API for connecting to Sitecore GraphQL and managing quiz content',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}`,
        description: 'Development server'
      }
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints'
      },
      {
        name: 'Sitecore GraphQL',
        description: 'GraphQL proxy endpoints for Sitecore'
      },
      {
        name: 'Quiz',
        description: 'Quiz-specific endpoints'
      }
    ],
    components: {
      schemas: {
        SitecoreItem: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            displayName: { type: 'string' },
            path: { type: 'string' },
            templateId: { type: 'string' },
            templateName: { type: 'string' },
            hasChildren: { type: 'boolean' },
            fields: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  value: { type: 'string' },
                  type: { type: 'string' }
                }
              }
            },
            children: {
              type: 'array',
              items: { $ref: '#/components/schemas/SitecoreItem' }
            }
          }
        },
        GraphQLRequest: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'GraphQL query string' },
            variables: { type: 'object', description: 'GraphQL variables' }
          },
          required: ['query']
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
            details: { type: 'object' }
          }
        }
      }
    }
  },
  apis: ['./server/api.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Sitecore Quiz API Documentation'
}));

// Root route - redirect to API docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Sitecore configuration
const SITECORE_CONFIG = {
  graphqlEndpoint:
    process.env.SITECORE_GRAPHQL_ENDPOINT ||
    "https://your-sitecore-instance.com/sitecore/api/graph/edge",
  apiKey: process.env.SITECORE_API_KEY || "your-api-key-here",
  siteName: process.env.SITECORE_SITE_NAME || "website",
  language: process.env.SITECORE_LANGUAGE || "en",
};

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the server status and current timestamp
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

/**
 * @swagger
 * /api/sitecore:
 *   post:
 *     summary: GraphQL proxy to Sitecore
 *     description: Forwards GraphQL queries to Sitecore and returns the response
 *     tags: [Sitecore GraphQL]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GraphQLRequest'
 *           example:
 *             query: |
 *               {
 *                 item(path: "/sitecore/content/Home") {
 *                   id
 *                   name
 *                   displayName
 *                 }
 *               }
 *             variables: {}
 *     responses:
 *       200:
 *         description: Successful GraphQL response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request - missing query
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       503:
 *         description: Service unavailable - cannot connect to Sitecore
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.post("/api/sitecore", async (req, res) => {
  try {
    const { query, variables } = req.body;

    if (!query) {
      return res.status(400).json({ error: "GraphQL query is required" });
    }

    console.log("Forwarding GraphQL query to Sitecore:", query);
    console.log("Variables:", variables);

    const response = await axios.post(
      SITECORE_CONFIG.graphqlEndpoint,
      {
        query,
        variables: {
          ...variables,
          siteName: variables?.siteName || SITECORE_CONFIG.siteName,
          language: variables?.language || SITECORE_CONFIG.language,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          sc_apikey: SITECORE_CONFIG.apiKey,
          "X-GQL-Token": SITECORE_CONFIG.apiKey,
        },
        timeout: 30000,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error proxying to Sitecore GraphQL:", error.message);

    if (error.response) {
      // Sitecore returned an error
      res.status(error.response.status).json({
        error: "Sitecore GraphQL Error",
        message: error.response.data?.message || error.message,
        details: error.response.data,
      });
    } else if (error.request) {
      // Network error
      res.status(503).json({
        error: "Service Unavailable",
        message: "Unable to connect to Sitecore GraphQL endpoint",
      });
    } else {
      // Other error
      res.status(500).json({
        error: "Internal Server Error",
        message: error.message,
      });
    }
  }
});

// Get specific item by path
app.get("/api/sitecore/item", async (req, res) => {
  try {
    const { path, includeChildren } = req.query;

    if (!path) {
      return res.status(400).json({ error: "Item path is required" });
    }

    const query = `
      query GetItem($path: String!, $language: String!, $siteName: String!) {
        item(path: $path, language: $language, siteName: $siteName) {
          id
          name
          displayName
          path
          templateId
          templateName
          fields {
            name
            value
            type
          }
          ${
            includeChildren === "true"
              ? `
          children {
            results {
              id
              name
              displayName
              path
              templateId
              templateName
              fields {
                name
                value
                type
              }
            }
          }
          `
              : ""
          }
        }
      }
    `;

    const variables = {
      path: path,
      language: SITECORE_CONFIG.language,
      siteName: SITECORE_CONFIG.siteName,
    };

    const response = await axios.post(
      SITECORE_CONFIG.graphqlEndpoint,
      { query, variables },
      {
        headers: {
          "Content-Type": "application/json",
          sc_apikey: SITECORE_CONFIG.apiKey,
          "X-GQL-Token": SITECORE_CONFIG.apiKey,
        },
        timeout: 30000,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching Sitecore item:", error.message);
    res.status(500).json({
      error: "Failed to fetch Sitecore item",
      message: error.message,
    });
  }
});

// Get multiple items by IDs
app.post("/api/sitecore/items", async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: "Item IDs array is required" });
    }

    const query = `
      query GetItems($ids: [String!]!, $language: String!, $siteName: String!) {
        items(ids: $ids, language: $language, siteName: $siteName) {
          results {
            id
            name
            displayName
            path
            templateId
            templateName
            fields {
              name
              value
              type
            }
          }
        }
      }
    `;

    const variables = {
      ids: ids,
      language: SITECORE_CONFIG.language,
      siteName: SITECORE_CONFIG.siteName,
    };

    const response = await axios.post(
      SITECORE_CONFIG.graphqlEndpoint,
      { query, variables },
      {
        headers: {
          "Content-Type": "application/json",
          sc_apikey: SITECORE_CONFIG.apiKey,
          "X-GQL-Token": SITECORE_CONFIG.apiKey,
        },
        timeout: 30000,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching Sitecore items:", error.message);
    res.status(500).json({
      error: "Failed to fetch Sitecore items",
      message: error.message,
    });
  }
});

/**
 * @swagger
 * /api/sitecore/quiz:
 *   get:
 *     summary: Get DynamicQuiz content
 *     description: Fetches the DynamicQuiz item from Sitecore with its children
 *     tags: [Quiz]
 *     responses:
 *       200:
 *         description: Quiz data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     item:
 *                       type: object
 *                       properties:
 *                         displayName:
 *                           type: string
 *                         hasChildren:
 *                           type: boolean
 *                         children:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               displayName:
 *                                 type: string
 *                               children:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     displayName:
 *                                       type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get("/api/sitecore/quiz", async (req, res) => {
  try {
    const query = `
      {
        item(
          path: "/sitecore/content/Mimecast/Home/Test Content/DynamicQuiz"
          language: "en"
        ) {
          displayName
          hasChildren
          children {
            displayName
            children {
              displayName
            }
          }
        }
      }
    `;

    const response = await axios.post(
      SITECORE_CONFIG.graphqlEndpoint,
      { query },
      {
        headers: {
          "Content-Type": "application/json",
          sc_apikey: SITECORE_CONFIG.apiKey,
          "X-GQL-Token": SITECORE_CONFIG.apiKey,
        },
        timeout: 30000,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching quiz:", error.message);
    res.status(500).json({
      error: "Failed to fetch quiz",
      message: error.message,
    });
  }
});

// Quiz-specific endpoint - Get quiz questions
app.get("/api/sitecore/quiz/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;

    if (!quizId) {
      return res.status(400).json({ error: "Quiz ID is required" });
    }

    const query = `
      {
        item(
          path: "/sitecore/content/Mimecast/Home/Test Content/DynamicQuiz"
          language: "en"
        ) {
          displayName
          hasChildren
          children {
            displayName
            children {
              displayName
            }
          }
        }
      }
    `;

    const response = await axios.post(
      SITECORE_CONFIG.graphqlEndpoint,
      { query },
      {
        headers: {
          "Content-Type": "application/json",
          sc_apikey: SITECORE_CONFIG.apiKey,
          "X-GQL-Token": SITECORE_CONFIG.apiKey,
        },
        timeout: 30000,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching quiz:", error.message);
    res.status(500).json({
      error: "Failed to fetch quiz",
      message: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Sitecore API server running at http://localhost:${port}`);
  console.log("Configuration:");
  console.log(`- GraphQL Endpoint: ${SITECORE_CONFIG.graphqlEndpoint}`);
  console.log(`- Site Name: ${SITECORE_CONFIG.siteName}`);
  console.log(`- Language: ${SITECORE_CONFIG.language}`);
  console.log(`- API Key configured: ${SITECORE_CONFIG.apiKey ? "Yes" : "No"}`);
});
