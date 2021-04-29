FROM mongo:latest

COPY ./DATA /var/lib/mongodb

COPY ./init_onlinesales_db.sh /docker-entrypoint-initdb.d/init_onlinesales_db.sh

COPY ./mongo.conf /etc/mongo/mongo.conf

EXPOSE 27017

#CMD ["--config", "/etc/mongo/mongo.conf"]

#CMD ["--version"]
#CMD ["--help"]

#CMD ["--bind_ip", "0.0.0.0", "--port", "27017"]
#CMD ["--bind_ip", "127.0.0.1", "--port", "27017"]
#CMD ["--bind_ip_all", "--port", "27017"]

