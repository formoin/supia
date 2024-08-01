FROM node:20-alpine AS build
WORKDIR /app 

COPY package*.json ./ 
RUN npm install
COPY . .
RUN npx expo export --platform web 

FROM nginx:stable-alpine AS production-stage
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 3000

CMD ["nginx", "-g","daemon off;"]
