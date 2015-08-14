# Dockerfile for the PDC's HAPI service
#
# Base image
#
FROM phusion/passenger-nodejs


# Update system, install Python 2.7
#
ENV DEBIAN_FRONTEND noninteractive
RUN echo 'Dpkg::Options{ "--force-confdef"; "--force-confold" }' \
      >> /etc/apt/apt.conf.d/local
RUN apt-get update; \
    apt-get upgrade -y; \
    apt-get install -y python2.7


# Create startup script and make it executable
#
RUN mkdir -p /etc/service/app/
RUN ( \
      echo "#!/bin/bash"; \
      echo "#"; \
      echo "set -e -o nounset"; \
      echo ""; \
      echo ""; \
      echo "# Environment variables"; \
      echo "#"; \
      echo "export PORT=\${PORT_HAPI}"; \
      echo "export MONGO_URI=mongodb://hubdb:27017/query_composer_development"; \
      echo "export AUTH_CONTROL=https://auth:\${PORT_AUTH_C}"; \
      echo "export ROLES=\${DACS_ROLEFILE}"; \
      echo "export SECRET=\${NODE_SECRET}"; \
      echo "export DCLAPI_URI=\${URL_DCLAPI}"; \
      echo ""; \
      echo ""; \
      echo "# Copy groups.json if not present"; \
      echo "# "; \
      echo "if([ ! -d /home/app/groups/ ]||[ ! -s /home/app/groups/groups.json ])"; \
      echo "then"; \
      echo "  ("; \
      echo "    mkdir -p /home/app/groups"; \
      echo "    cp /app/groups.json /home/app/groups/"; \
      echo "  )||("; \
      echo "    ERROR: /home/app/groups/groups.json initialization unsuccessful >&2"; \
      echo "  )"; \
      echo "fi"; \
      echo ""; \
      echo ""; \
      echo "# Start service"; \
      echo "#"; \
      echo "cd /app/"; \
      echo "/sbin/setuser app npm start"; \
    )  \
      >> /etc/service/app/run
RUN chmod +x /etc/service/app/run


# Prepare /app/ folder
#
WORKDIR /app/
COPY . .
RUN npm config set python /usr/bin/python2.7
RUN npm install
RUN chown -R app:app /app/


# Run Command
#
CMD ["/sbin/my_init"]
