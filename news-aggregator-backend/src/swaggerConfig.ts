import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'News Aggregator API',
            version: '1.0.0',
            description: 'API documentation for the News Aggregator backend service',
        },
    },
    apis: ['./src/**/*.ts'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export default specs;