FROM node:14.16.0-alpine3.13 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .

FROM node:22.14.0-alpine3.20 AS production

RUN addgroup app && adduser -S -G app app
WORKDIR /app
COPY --from=build /app /app
RUN chown -R app:app /app

USER app
EXPOSE 3001
CMD ["npm", "start"]
