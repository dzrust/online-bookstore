# online-bookstore
 Online bookstore example application

## Project Setup
This project uses:
- Docker [installer](https://www.docker.com/get-started)
- Node [installer](https://nodejs.org/en/download/)
- React
- MySQL

Run:
- `npm i`
- `npm run-script build-docker`
- look at the container name of the database and set `DB_HOSTNAME` within `docker-compose.yml` 
- `npm run-script start-docker`
- Once the two aforementioned commands are done run this to fill db: `npm run-script fill-db`

Browse:
[localhost](http://localhost:8080)

## Project Requirements
- [x] API for CRUD of a books, managing title, author, isbn, description
- [x] Ability to manage books through a web interface
- [x] Ability to check in and check out a book
- [x] Ability to track state changes for a book
- [x] Report that contains the current state of all books

