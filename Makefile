.DEFAULT_GOAL := build

list:
	@$(MAKE) -pRrq -f $(lastword $(MAKEFILE_LIST)) : 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | sort | egrep -v -e '^[^[:alnum:]]' -e '^$@$$' | xargs  | tr ' ' '\n'

build:
	@bin/build.sh

run:
	@docker-compose up app

stop:
	@docker-compose stop app

test:
	@docker-compose run --rm app npm run test
