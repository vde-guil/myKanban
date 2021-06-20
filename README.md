# myKanban

Very simple kanban like application done in vanilla JS (front) and PostgreSQL (Sequelize), Node and express (REST API).
the project is deployed [here](https://dashboard.heroku.com/apps/my-kanban-vde-guil).

You can create/delete a new List, a new Card and a new Label.
(deleting the list will remove all the cards contained in it as well)

You can Switch the card from a list to another (drag and drop).
You can add or remove a label to/from a Card

You can modify the list title by double clicking on it.
you can also update the color and content of the cards.

## Front

### Stack

- Vanilla Js

### Installation

Clone the repo locally

```bash
git clone <repo url>
```

go into the clone directory then go into the front subirectory

```bash
cd front/
```

build the project with browserify

```bash
npx browserify -e assets/js/app.js -o ../back/static/js/bundle.js
```

this command will bundle the source files in a single javascript file and move it into the server static folder to be served.

## API

### Stack

- NodeJS 15
- NPM
- PostgreSQL 13
- Sequelize

Those tools are necessary for the good execution of the API.

### Installation

The repo should be already cloned, go into the back subfolder

```bash
cd back/
```

then, once in the cloned directory, install the dependencies

```bash
npm i
```

Create a postgresql database

```bash
createdb kanban
```

Please configure PostgreSQL (or provide the necessary environment variables) so that the `createdb` command can execute properly.

Import the tables into your database  via the script provided in ```back/docs/create_table.sql``` by running the command

```bash
psql -U user -h host -d dbName -f path/to/back/docs/create_table.sql
```

### Launch

```bash
npm start
```
