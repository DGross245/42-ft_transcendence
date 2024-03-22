# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: dna <dna@student.42.fr>                    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/09/16 11:24:22 by dgross            #+#    #+#              #
#    Updated: 2024/03/22 03:11:06 by dna              ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

#Header ist nur da um zu wissen wann das projekt angefangen wurde :D
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
