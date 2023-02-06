FROM node:18
WORKDIR /app

# configuration files to run application
COPY package*.json /app
COPY tsconfig.json /app
COPY startup /app

# source files application
COPY src /app/src
COPY prisma /app/prisma

RUN ls -a

EXPOSE ${PORT}

CMD ["./startup"]