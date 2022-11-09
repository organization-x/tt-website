FROM redis:alpine

WORKDIR /app

COPY redis.conf .
COPY start.sh .

RUN chmod +x ./start.sh

EXPOSE 6379

CMD ["./start.sh"]
