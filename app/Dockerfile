FROM node:0.10

# ADD package.json /tmp/package.json
# RUN cd /tmp && npm install
# RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app

# ADD . /usr/src/app
# RUN npm run build

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN cp -a /tmp/node_modules /usr/src/app

ADD package.json /usr/src/app/package.json
#ADD webpack.config.js /usr/src/app/webpack.config.js
WORKDIR /usr/src/app

EXPOSE 80
#CMD ["node", "node_modules/webpack-dev-server/bin/webpack-dev-server",  "--port", "80", "--config", "webpack.config.js", "--host", "0.0.0.0"]
CMD ["npm", "start"]
