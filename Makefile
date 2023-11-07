# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: dgross <dgross@student.42.fr>              +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/09/16 11:24:22 by dgross            #+#    #+#              #
#    Updated: 2023/11/07 14:23:41 by dgross           ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

#Header ist nur da um zu wissen wann das projekt angefangen wurde :D
all: up

data:

up: data
	docker-compose up --build

down:
	docker-compose down

clean:
	docker-compose down -v --rmi all --remove-orphans
	docker network prune -f
	rm -rf ./database/data

ps:
	docker-compose ps

logs:
	docker-compose logs

.PHONY: up data down clean ps logs