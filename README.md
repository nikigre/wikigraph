# PISRS Graf

> Vizualizacija povezave med slovenskimi predpisi (PISRS - Pravno-informatski sistem Republike Slovenije)

> Koda je narejena na osnovi repozitorija [WikiGraph](https://github.com/dannydi12/wikigraph)

## Setup
- Run `yarn` to install packages
- Download pages multistream torrent from [metawiki site](https://meta.wikimedia.org/wiki/Data_dump_torrents#English_Wikipedia)
	- [More info](https://en.wikipedia.org/wiki/Wikipedia:Database_download#E-book)
- After unzipping, rename the file to `wiki.xml` and move it into the `data` folder for further processing
- Then run `yarn db:csv` to convert the XML to CSV
- Then run `yarn db:init` to build the database file
- Then  run `sqlite3 wiki.db`
  - `.mode csv`
  - `.import links.csv links`
  - run `CREATE INDEX idx_from_title ON links (from_title);`
- Go to the `backend` folder
  - Add an `.env` file with a your DB's file path as the value for `DB_FILE`
  - Run `yarn watch` to start the server
- Go to the `frontend` folder
  - Create a `.env.local` file with the following: `VITE_API_URL=http://localhost:8000/api`
  - Run `yarn dev` to start the website

## Attribution

Koda je bazirana na [WikiGraph](https://github.com/dannydi12/wikigraph) - vizualizaciji povezav med Wikipedia članki.
