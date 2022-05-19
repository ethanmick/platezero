
db.run:
	docker run --rm --name platezero-db -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:14.3-alpine