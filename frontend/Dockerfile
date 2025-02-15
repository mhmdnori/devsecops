FROM node:14.16.0-alpine3.13 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.12-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run && \
    chown -R appuser:appgroup /var/cache/nginx /var/log/nginx /var/run
COPY --from=build /app/build /usr/share/nginx/html
RUN chown -R appuser:appgroup /usr/share/nginx/html
USER appuser
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]