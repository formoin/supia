FROM node:20-alpine as build
WORKDIR /app 

COPY package*.json ./ 
RUN npm install
COPY . .
RUN npx expo export --platform web 

FROM nginx:stable-alpine as production-stage
COPY --from=build ./dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g","daemon off;"]