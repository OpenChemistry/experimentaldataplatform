FROM node:11.11 as build
COPY ./client /client
RUN npm install -g npm
RUN git clone https://github.com/OpenChemistry/composition-plot.git
RUN cd /composition-plot && \
  npm install && \
  npm run build && \
  npm link
ENV NODE_OPTIONS --max_old_space_size=4096
RUN cd /client && \
  npm install && \
  npm link composition-plot && \
  npm run build
FROM nginx
COPY ./devops/docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /client/build/ /etc/nginx/html/
