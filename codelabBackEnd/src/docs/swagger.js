import swaggerJsdoc from 'swagger-jsdoc';

const METHODS_WITH_BODY = new Set(['POST', 'PUT', 'PATCH']);

function normalizePath(path) {
  return path.replace(/:([A-Za-z0-9_]+)/g, '{$1}');
}

function extractParameters(path) {
  const matches = [...path.matchAll(/:([A-Za-z0-9_]+)/g)];

  return matches.map((match) => ({
    in: 'path',
    name: match[1],
    required: true,
    schema: { type: 'string' },
  }));
}

function buildTag(path) {
  const [segment] = path.split('/').filter(Boolean);

  if (!segment) {
    return 'Sistema';
  }

  return segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function buildOperation(route) {
  const normalizedPath = normalizePath(route.path);
  const parameters = extractParameters(route.path);
  const operation = {
    tags: [buildTag(route.path)],
    summary: `${route.method} ${normalizedPath}`,
    description: `Endpoint registrado en ${normalizedPath}.`,
    responses: {
      200: {
        description: 'Respuesta exitosa.',
      },
    },
  };

  if (parameters.length > 0) {
    operation.parameters = parameters;
  }

  if (METHODS_WITH_BODY.has(route.method)) {
    operation.requestBody = {
      required: false,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            additionalProperties: true,
          },
        },
      },
    };
  }

  return operation;
}

export function createSwaggerSpec(routes = []) {
  const paths = {};

  for (const route of routes) {
    if (!route?.path || route.path.startsWith('/api-docs') || route.path === '/openapi.json') {
      continue;
    }

    const normalizedPath = normalizePath(route.path);

    if (!paths[normalizedPath]) {
      paths[normalizedPath] = {};
    }

    paths[normalizedPath][route.method.toLowerCase()] = buildOperation(route);
  }

  return swaggerJsdoc({
    definition: {
      openapi: '3.0.3',
      info: {
        title: 'SIMM API',
        version: '1.0.0',
        description: 'Documentacion generada automaticamente a partir de las rutas registradas.',
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3000}`,
          description: 'Servidor local',
        },
      ],
      paths,
    },
    apis: [],
  });
}
