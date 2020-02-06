# base image
FROM pipdevs/angular

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# added node options to avoid js heap out of memory error
ENV NODE_OPTIONS --max_old_space_size=2048

# Copy npm config
COPY docker/.npmrc /root/.npmrc

# install and cache app dependencies
COPY package.json /usr/src/app/package.json
RUN npm install

# add app
COPY . /usr/src/app
