# News API

## Live Version

Live version of this app [hosted here](https://ncnewsapi.cyclic.app/api) using [Cyclic](https://www.cyclic.sh/).

## Project Summary

The purpose of this project is to demonstrate the setting up of a RESTful api which is written in JavaScript. It is using Express JS as a backend framework along with PSQL (PostgreSql) for its database where all the data is stored and manipulated.
It allows a user to interact with placeholder articles/comments data in ways described below:

- `GET /api` - GET a list of all of the available endpoints.

- `GET /api/topics` - GET a list of topics of the articles.
- `POST /api/topics` - POST a new topic.

- `GET /api/articles` GET a list of articles. A user can filter by topic, sort by author, title, topic, votes, date or comment count. They can also choose a sort order and decide on the pagination limits or view specific pages of results.
- `POST /api/articles` - POST a new article.

- `GET /api/articles/:article_id` - GET a specific article using an article_id parameter.
- `PATCH /api/articles/:article_id` - PATCH a specific article by changing its vote count (upvote/downvote).
- `DELETE /api/articles/:article_id` - DELETE a specific article along with its comments.

- `GET /api/articles/:article_id/comments` - GET a list of the comments associated with a specific article.
- `POST /api/articles/:article_id/comments` - POST a new comment to a specific article.

- `DELETE /api/comments/:comment_id` - DELETE a specific comment using its comment_id as parameter.
- `PATCH /api/comments/:comment_id` - PATCH a specific comment by changing its vote count (upvote/downvote).

- `GET /api/users` - GET a list of the registered users. Please note there is no ability to register a new user currently.

- `GET /api/users/:username` - GET a specific user using a username parameter.

## Cloning and installing modules

This repository can be cloned via one of the links shown in the "code" dropdown at the top of this page.

HTTPS link for convenience:

```
https://github.com/donblizy/News-API.git
```

Once cloned, navigate to that directory in your terminal and run the below command to install all of the dependencies needed as found in the package.json file.
The command is: `npm i` .

## System setup

In order for a local copy to function in your system there are a few things that need to be set up.

Please install the below:

- [Node](https://nodejs.org/en/) (version 17+)
- [npm](https://www.npmjs.com/) (version 8.1+)
- [PostgreSQL](https://www.postgresql.org/) (version 13.5+)

Versions earlier than those listed may work but have not been tested.

## Environment setup

You will need to create two .env files for this project locally: `.env.test` and `.env.development`.

Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names).

\*\*<b>THIS IS VITAL FOR CONNECTING THE TWO DATABASES LOCALLY<b>\*\*

## Creating and seeding the databases

In order to create both the development and test databases you will need to run `npm run setup-dbs` .

Following that, run `npm run seed` to populate them with placeholder data.

## Testing

Everything was written using the Test Driven Development paradigm.
Through `npm i` you should have Jest installed which is a popular Javascript testing framework.
In order to run the current tests, please run `npm t` in your terminal.

## Trying it

You can run `npm run start` in order to start a locally hosted version.
This automatically opens up a local port at 9090 by default (can be changed in the listen.js file) which allows you to make any HTTP request. A recommended program to do such requests is [Insomnia](https://insomnia.rest/download) .

As a suggestion, it would be best to perform a GET request to `/api` which will bring up all your options along with example responses and expected statuses.
