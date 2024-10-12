dev:
	docker build -t bingo .
	docker run -it --rm -v .:/app -v /app/node_modules -p 5174:5174 bingo
