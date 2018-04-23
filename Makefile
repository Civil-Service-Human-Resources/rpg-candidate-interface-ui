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

deploy-staging: ;@echo "🚀......Deploying to STAGING........🚀";\
	              cf push rpg-ci -f manifest.staging.yml ;\
	              echo "Updating environment variables using LOCAL .env file" ;\
	              cat .env |sed 's/=/ /'| xargs -t -I % sh -c 'cf set-env rpg-ci %';\
              	cf restage rpg-ci
