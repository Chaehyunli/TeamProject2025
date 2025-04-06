# 1단계: 빌드용
FROM node:18-alpine as build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# 2단계: 실제 서비스용 (nginx로 정적 파일 서빙)
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
