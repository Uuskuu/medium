# Medee - Мэдээллийн Блог Платформ

Монгол хэл дээрх мэргэжлийн блог платформ - Medium.com шиг WYSIWYG editor бүхий, reputation point болон цалингийн системтэй, backoffice review процесстэй.

## Технологийн стек

### Backend
- **Java 17** with Spring Boot 3.x
- **Gradle 8.6** build system
- **MongoDB** NoSQL database
- **JWT** authentication
- **Lombok** for boilerplate reduction

### Frontend
- **React 18** with Hooks
- **Ant Design** UI components
- **MobX** state management
- **Draft.js** WYSIWYG editor
- **Vite** build tool

## Үндсэн функционал

### Хэрэглэгчийн дүрүүд
1. **Уншигч (READER)** - Мэдээ унших, таалагдах, сэтгэгдэл үлдээх
2. **Нийтлэгч (AUTHOR)** - Мэдээ бичих, засах, шалгалтанд илгээх
3. **Админ (ADMIN)** - Мэдээ шалгах, зөвшөөрөх/буцаах, цалин тооцоолох

### Гол функционалууд
- ✅ JWT authentication (нэвтрэх/бүртгүүлэх)
- ✅ Draft.js WYSIWYG editor (code snippet дэмжлэгтэй)
- ✅ Мэдээ CRUD үйлдлүүд
- ✅ Review workflow (Draft → Pending → Approved/Rejected)
- ✅ Like болон Comment систем
- ✅ View counter
- ✅ Reputation point систем
- ✅ Сарын цалин тооцоолох
- ✅ Backoffice удирдлагын хэсэг
- ✅ Responsive дизайн

## Суулгах заавар

### Шаардлагатай зүйлс
- Docker Desktop эсвэл Docker Engine + Docker Compose
- Node.js 18+ (локал хөгжүүлэлтэд)
- Java 17+ (локал хөгжүүлэлтэд)
- MongoDB 7.0+ (локал хөгжүүлэлтэд)

### Docker ашиглан ажиллуулах (Санал болгож байна)

1. **Repository clone хийх:**
```bash
git clone <repository-url>
cd medee
```

2. **Environment тохируулга:**
```bash
# .env файл үүсгэх (үндсэн хавтаст)
echo "JWT_SECRET=your-very-long-secret-key-here-at-least-64-characters-long" > .env
```

3. **Docker Compose ашиглан бүх service-үүдийг эхлүүлэх:**
```bash
docker-compose up -d
```

4. **Application-ууд дараах хаягуудаар нээгдэнэ:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- MongoDB: mongodb://localhost:27017

5. **Logs харах:**
```bash
docker-compose logs -f
```

6. **Зогсоох:**
```bash
docker-compose down
```

### Локал хөгжүүлэлт

#### Backend ажиллуулах:
```bash
cd backend
./gradlew bootRun
```

Backend: http://localhost:8080/api

#### Frontend ажиллуулах:
```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:3000

#### MongoDB ажиллуулах:
```bash
mongod --dbpath=/path/to/data
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Бүртгүүлэх
- `POST /api/auth/login` - Нэвтрэх
- `GET /api/auth/me` - Одоогийн хэрэглэгч

### Posts (Нээлттэй)
- `GET /api/posts` - Зөвшөөрөгдсөн мэдээнүүд
- `GET /api/posts/{id}` - Тодорхой мэдээ харах
- `POST /api/posts/{id}/like` - Таалагдах
- `POST /api/posts/{id}/comments` - Сэтгэгдэл нэмэх

### Author Endpoints
- `POST /api/author/posts` - Мэдээ үүсгэх
- `PUT /api/author/posts/{id}` - Мэдээ засах
- `DELETE /api/author/posts/{id}` - Мэдээ устгах
- `POST /api/author/posts/{id}/submit` - Шалгалтанд илгээх
- `GET /api/author/posts/my` - Миний мэдээнүүд

### Admin Endpoints
- `GET /api/admin/posts/pending` - Шалгалт хүлээж байгаа мэдээ
- `POST /api/admin/posts/{id}/approve` - Зөвшөөрөх
- `POST /api/admin/posts/{id}/reject` - Буцаах
- `GET /api/admin/users` - Хэрэглэгчдийн жагсаалт
- `POST /api/admin/salary/calculate` - Цалин тооцоолох
- `GET /api/admin/salary/report` - Цалингийн тайлан

## Цалингийн тооцоолох алгоритм

```
Reputation Points = (Likes × 10) + (Views × 1) + (Comments × 5)

Цалин = Үндсэн дүн × Reputation Multiplier

Reputation Tiers:
- Bronze (0-100 points): 1.0x (100,000₮)
- Silver (101-500 points): 1.5x (150,000₮)
- Gold (501-1000 points): 2.0x (200,000₮)
- Platinum (1000+ points): 3.0x (300,000₮)
```

## Анхдагч хэрэглэгчид үүсгэх

Системд анх удаа нэвтрэх үед дараах хэрэглэгчдийг үүсгэнэ:

```bash
# Admin хэрэглэгч
username: admin
email: admin@medee.mn
password: admin123
role: ADMIN

# Author хэрэглэгч
username: author1
email: author@medee.mn
password: author123
role: AUTHOR

# Reader хэрэглэгч
username: reader1
email: reader@medee.mn
password: reader123
role: READER
```

## Production Deployment

### Cloud платформ дээр deploy хийх (AWS, Azure, GCP)

1. **MongoDB Atlas (Cloud Database)**
   - MongoDB Atlas дээр cluster үүсгэх
   - Connection string авах
   - Environment variable-д тохируулах

2. **Backend Deploy (Spring Boot)**
   - Docker image бүтээх: `docker build -t medee-backend ./backend`
   - Container registry-д push хийх (ECR, ACR, GCR)
   - Cloud service дээр deploy хийх (ECS, AKS, GKE)
   - Environment variables:
     - `MONGODB_URI=mongodb+srv://...`
     - `JWT_SECRET=your-production-secret`

3. **Frontend Deploy**
   - Docker image бүтээх: `docker build -t medee-frontend ./frontend`
   - Static hosting эсвэл Container service дээр deploy хийх
   - Environment variables:
     - `VITE_API_BASE_URL=https://api.yourdomain.com`

## Хөгжүүлэлт

### Backend тестүүд ажиллуулах:
```bash
cd backend
./gradlew test
```

### Frontend тестүүд ажиллуулах:
```bash
cd frontend
npm test
```

## Лиценз

MIT License

## Холбоо барих

Асуулт, санал байвал issue үүсгэнэ үү.

