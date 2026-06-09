---
description: Read this file to understand how to fetch data in the project. This includes both server-side and client-side data fetching patterns, as well as best practices for handling asynchronous data in React components.
---
# Data Fetching Guidelines
This document outlines the best practices for fetching data in our project, covering both server-side and client-side approaches. Adhering to these guidelines will ensure that our application remains performant, maintainable, and secure.

## 1. Use Server components for Data Fetching
In Next.js 13 and later, ALWAYS use Server components for data fetching. NEVER use client components for data fetching. 

## 2. Data Fetching methods
ALWAYS use the helper functions in the /data directory for all data fetching. NEVER import the database client (e.g., Drizzle ORM) directly into your components. This ensures that all data access is properly scoped and secure.

ALL helper functions in the /data directory MUST use Drizzle ORM exclusively for database interactions. NEVER use raw SQL queries.