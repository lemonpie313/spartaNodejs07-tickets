# 티켓 예매 사이트
## 기술
<h3 align="center">🍋 BackEnd 🍋</h3>
<div align="center">
<img alt="Static Badge" src="https://img.shields.io/badge/-Typescript-%233178C6?style=flat-square&logo=typescript&logoColor=white">
<img alt="Static Badge" src="https://img.shields.io/badge/-Nest.js-%23E0234E?style=flat-square&logo=nestjs&logoColor=white">
<img alt="Static Badge" src="https://img.shields.io/badge/-typeORM-%23FE0803?style=flat-square&logo=typeorm&logoColor=white">
</div>

<h3 align="center">🍋 Tools 🍋</h3>
<div align="center">
<img alt="Static Badge" src="https://img.shields.io/badge/-Git-%23F05032?style=flat-square&logo=git&logoColor=white">
<img alt="Static Badge" src="https://img.shields.io/badge/-Github-%23181717?style=flat-square&logo=github&logoColor=white">
<img alt="Static Badge" src="https://img.shields.io/badge/-Vscode-%23007ACC?style=flat-square&logo=visualstudiocode&logoColor=white">
</div>

## ERD
https://drawsql.app/teams/own-64/diagrams/ticket

## API 명세서
https://taropie313.notion.site/Nest-js-API-0a291e9e70894744b760f5f6e559213f?pvs=4
## 프로젝트 설치 및 실행 방법
### Setting
#### 1. 코드 불러오기
```
git clone https://github.com/lemonpie313/spartaNodejs07-tickets.git .
```

#### 2. 패키지 설치
```
npm install
```

#### 3. .env 파일 생성
```
DB_HOST="사용할 RDS 엔드포인트"
DB_PORT=사용할 RDS 포트(3306)
DB_USERNAME="사용할 RDS의 계정이름"
DB_PASSWORD="사용할 RDS의 비밀번호"
DB_NAME="사용할 RDS DB 이름"
DB_SYNC=true
JWT_SECRET_KEY="jwt 토큰 시크릿 키(임의 지정)"
```

#### 4. 서버 실행
```
npm start
```