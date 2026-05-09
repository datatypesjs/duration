.PHONY: help
help: makefile
	@tail -n +4 makefile | grep ".PHONY"


.PHONY: format
format:
	npx dprint fmt
	npx eslint --ignore-pattern=.gitignore --fix .
