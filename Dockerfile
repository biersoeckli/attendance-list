#Building frontends
FROM node:lts AS build

WORKDIR /build-dir

COPY . .

# environment variables for building
ARG IS_PRODUCTION=true
ARG PARSE_SERVER_URL=/parse
ARG PARSE_APP_ID=attendance-list
ARG ATTENDANCE_LIST_URL=/att
ARG BFA_AUTH_URL=/bfa
ARG FISCHMARKT_AUTH_URL=/fm
ARG ATTENDANCE_LIST_BASE_PATH=/att
ARG FISCHMARKT_BASE_PATH=/fm

RUN cd fischmarkt && npm install && npm run build-prod-dockerfile
RUN cd bfa && npm install && npm run build-prod-dockerfile
RUN cd attendance-list && npm install && npm run build-prod-dockerfile

# Creating final image
FROM node:lts
WORKDIR /app
COPY --from=build /build-dir/parse-server .

RUN npm install

CMD ["node", "index.js"]