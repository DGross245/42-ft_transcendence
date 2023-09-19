# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: dgross <dgross@student.42.fr>              +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/09/16 11:24:22 by dgross            #+#    #+#              #
#    Updated: 2023/09/19 14:37:51 by dgross           ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

#Header ist nur da um zu wissen wann das projekt angefangen wurde :D
all: up

data:
	mkdir -p ./database/data/postgres

up: data
	docker-compose up --build

down:
	docker-compose down

clean:
	docker-compose down -v

fclean: clean
	docker-compose down --rmi all
	rm -rf ./database/data

ps:
	docker-compose ps

logs:
	docker-compose logs

.PHONY: up down clean 