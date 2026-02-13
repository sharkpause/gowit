# Backend Overview

This is the backend system for handling API requests and database queries

## Tech Stack
- Go
- Gin
- MySQL/MariaDB

## How to Run
1. Clone repository
```bash
$ git clone https://github.com/sharkpause/gowit.git
```
2. Run database migrations and seeding
```bash

$ cd gowit/src/server/setup/scripts  
$ python -m venv venv  
$ source .venv/bin/activate  
$ pip install -r requirements.txt  
$ python setup_db.py  

```

3. Start server
```bash

$ cd ../..  
$ go run main.go  

```