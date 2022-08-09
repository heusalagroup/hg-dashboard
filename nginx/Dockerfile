ARG NGINX_IMAGE=nginx:alpine
ARG FRONTEND_IMAGE=dashboard-frontend

FROM $FRONTEND_IMAGE as frontend-image
FROM $NGINX_IMAGE as nginx-image

FROM nginx-image

ARG DEFAULT_PORT=8080
ARG DEFAULT_API_URL=https://api.example.com

ENV NGINX_PORT=$DEFAULT_PORT
ENV NGINX_API_URL=$DEFAULT_API_URL

COPY templates /etc/nginx/templates
COPY --from=frontend-image /app/build /usr/share/nginx/html
