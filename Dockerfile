FROM --platform=amd64 node:14-alpine
EXPOSE 5000
WORKDIR /users
COPY /src /users/src/

# copy config json
COPY package.json /users/package.json
COPY tsconfig.build.json /users/tsconfig.build.json
COPY tsconfig.json /users/tsconfig.json

# Fix error M1 apple silicon
RUN npm i bcrypt 
# build dist folder
RUN npm install
RUN npm run build

# start app
CMD [ "npm","run","start:prod" ]