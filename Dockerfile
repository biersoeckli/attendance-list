#Building frontends
FROM node:lts AS build

WORKDIR /build-dir

COPY . .

RUN cd fischmarkt && npm install && npm run build
RUN cd bfa && npm install && npm run build
RUN cd attendance-list && npm install && npm run build

# Creating final image
FROM node:lts
WORKDIR /app
COPY --from=build /build-dir/parse-server .

RUN npm install

CMD ["node", "index.js"]