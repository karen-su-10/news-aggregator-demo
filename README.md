# Getting Started with news-aggregator

## Introduction
A demo project to show how to build a news aggregator system with React, Node.js, Express, and TypeScript.
It contains three parts:
1. news-aggregator-backend: backend server with Express and TypeScript
2. news-aggregator-frontend: frontend server with React and TypeScript
3. news-aggregator-data-pipeline: a shell script to fetch news from newsapi.org and load to the backend server in memory db

## How to run locally
### Start backend server and initialize in memory db
```
cd news-aggregator-backend
npm install
ts-node src/initDB.ts
npx ts-node src/index.ts
```
### load data to in memory db
```
cd news-aggregator-data-pipeline
replace the api key with yours
bash fetch-news.sh (or your shell script run command depends on your OS)
```

### Start frontend server
```
cd news-aggregator-frontend
npm install
npm start
```

### Open browser 
```
http://localhost:3001/api-docs for backend api sawgger
http://localhost:3000/ for frontend
```

### System Design Consideration

### News Aggregation from multiple sources and handle deduplication
- Multiple pipelines will be used to fetch news from different sources and load to the unified schema. Airflow or other pipeline orchestration tools can be used to manage the pipelines.
- Each should have its own schedules to check whether to fetch newest batch of data from the source, the APIs/file transfer services will provide timestamp or etag to help to identify the newest data. The pipeline will use the timestamp or etag to decide whether to fetch the data or not.
- A central deduplication service/pipeline step will be used to handle deduplication by comparing articles based on metadata such as the article title, URL, or content hash, or a combined hash. Each pipeline wil use this service as the step before load data into the central database.
### Scalability and Performance
- Instead of this in memory db for demo purpose, a vector database like Qdrant to support semantic search plus some ML models should be used or in combine with other databases to enable smart search and recommendation.
- The total data size pulled form news.api.org for a day is 108563 bytes(~100 kb) per day for state legislation for all states in US , which is very small. But if the data size is big, the clustering model can be used for Qdrant to support the scalability, it can be deployed in different nodes / data centers/ regions. Data can be split into shards across multiple nodes(sharding by date or state), so each node handles a portion of the vectors. Qdrant will route queries to the appropriate node. It supports replication of data across nodes to ensure fault tolerance.
- Efficient searching can be achieved by using a combination of indexes and caching. Indexes should be created on the state, topic, date, and potentially some article tags/ keywords/labels. Qdrant has in memory mode like a cache to ensure performance. 
- Current code already implemented the pagination feature for the news list, using bootstrap pagination components for illustration purpose. For actually production, frontend Mobile Android or OS app should implement auto-scrolling instead of pagination. The API response support this with offset and limit parameters.
- The frontend and backend services can be wrapped in docker and deployed in Kubernetes for auto-scaling and load balancing for handling incoming traffic.
### Security
- Authentication and authorization should be separate components, which can be used on all apis and frontend services, for example, okta or google IAP or other identity providers. 
- If use google cloud, the load balancer/network layer of Kubernetes of google infrastructure can be configured and assure to prevent DDoS attacks and ensure other security concerns by configuring encryptions/auth key rotation etc from hardware layer, network layer to application layer.
- Rate limiter should be a separate component, which can be used on all apis including this one, Google Apigee is a good choice. If just one simple api service, then it can use some libraries like express-rate-limit.
- If vector DB solution is used, then no sql ingestion/attack since it is not sql. For sql, web frameworks like SpringBoot or flask has built-in protection against sql injection, e.g use Spring Data JPA/SQLAlchemy. Looks like express-validator or similar libraries can be used in a Node.js/Express
