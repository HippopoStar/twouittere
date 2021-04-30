FROM mongo:latest

COPY ./DATA /var/lib/mongodb

COPY ./init_onlinesales_db.sh /docker-entrypoint-initdb.d/init_onlinesales_db.sh

#COPY ./mongod.conf /etc/mongo/mongod.conf

#ENV MONGO_INITDB_ROOT_USERNAME=root
#ENV MONGO_INITDB_ROOT_PASSWORD=example

EXPOSE 27017

#CMD ["--version"]
#CMD ["--help"]

#CMD ["--config", "/etc/mongo/mongod.conf"]

#CMD ["--bind_ip", "0.0.0.0", "--port", "27017"]
#CMD ["--bind_ip", "127.0.0.1", "--port", "27017"]
#CMD ["--bind_ip_all", "--port", "27017"]

