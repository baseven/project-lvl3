install:
	npm ci

build:
	NODE_ENV=production npx webpack

develop:
	npx webpack serve

lint:
	npx eslint .