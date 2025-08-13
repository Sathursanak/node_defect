project/
├── models/ # Sequelize models for all tables/
|              entities
│ └── *.js
├── repository/ # Database query logic (per entity)
│ └── *.js
├── services/ # Business logic (per entity)
│ └── *.js
├── controllers/ # Request handling, call services, send responses
│ └── *.js
├── routes/ # Define API endpoints and route to controllers
│ └── *.js
├── db.js # Database connection setup
├── app.js # Main app entry, server start, middleware setup
└── README.md # This file - project overview and structure



models => Defines how your data looks in the DB (like a blueprint or table structure)

repository => Talks directly with the DB using Sequelize (only DB logic here)

services =>	The brain: it decides what to do using the repo. Handles business logic.

controllers =>	Talks with the client (frontend). Gets request, gives response. Calls service.

routes =>	Connects URL paths (like /designations) to the right controller functions

app.js =>	The entry point. Starts server, sets up routes.

db.js =>	Connects to your database.





Relationship 
belongsTo	: “I point to another table”	The table calling belongsTo has the FK
hasOne :	“I have exactly one related row in another table”	FK goes to the other table
hasMany :	“I have multiple related rows in another table”	FK goes to the other table
belongsToMany :	“We are connected through a separate join table”	FK is in a join table
