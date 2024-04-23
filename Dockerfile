FROM node:20-slim AS build

COPY . /app
WORKDIR /app

RUN npm ci
RUN npm run build

#######
# RUN #
#######

FROM nginx:alpine-slim

COPY --from=build /app/dist/ /usr/share/nginx/html/
