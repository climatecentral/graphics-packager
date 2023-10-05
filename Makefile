HOMEDIR = $(shell pwd)
vite = ./node_modules/.bin/vite

deploy:
	npm version patch && make build && git commit -a -m"Build" && make pushall

pushall: sync
	git push origin main

run:
	$(vite)

build:
	npm run build
