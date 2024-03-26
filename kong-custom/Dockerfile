FROM kong/kong-gateway:3.2.2.5-alpine
USER 0
# RUN mkdir -p /kong/declarative/
# COPY kong.yml /kong/declarative/
RUN cp /etc/kong/kong.conf.default /etc/kong/kong.conf
USER kong
