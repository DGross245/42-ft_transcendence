all: up

data:
	./create_certs.sh localhost

up: data
	@docker compose up --build -d

down:
	@docker compose down

clean:
	@docker compose down -v --rmi all --remove-orphans
	@docker network prune -f
	# @rm -rf ./database/data

ps:
	@docker compose ps

logs:
	@docker compose logs

.PHONY: up data down clean ps logs
