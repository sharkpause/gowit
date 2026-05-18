# gowit
Go Watch It. A web-app to help you finally go watch your movies.

# How to run
## Requirements
- Go
- Python 3
- Node.js + npm
- MariaDB/MySQL

This how-to-run manual has only been tested for Linux machines, adjust accordingly to your OS if not using a Linux machine.
1. Clone the repo  
   ```bash
   $ git clone https://github.com/sharkpause/gowit.git
   ```
2. Set up the server. First make sure you have your browser cookies exported to a cookies.txt file so the script can download youtube trailer videos  
   ```bash
   $ cp <path/to/your/cookies.txt> gowit/src/server/setup/scripts/
   $ cd gowit/src/server/setup/scripts
   $ cp .env.example .env
   ```
   Make sure you edit the .env file to include your real API keys and other credentials.
   ```bash
   $ python3 setup_db.py
   $ cd ../..
   $ go get
   $ cp .env.example .env
   $ go run main.go
   ```
   Make sure you edit the .env file to include your real API keys and other credentials.
4. Set up the frontend.
   ```bash
   $ cd ../client/gowit/
   $ npm install
   $ npm run dev
   ```

## NOTE FOR WINDOWS
because webp library is a cgo library, windows user need to have gcc and enable cgo option on go environment by running this command on powershell.
   ```powershell
   go env -w CGO_ENABLED=1
   ```
