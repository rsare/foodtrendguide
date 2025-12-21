FoodTrend Guide
FoodTrend Guide is a modern, full-stack web application designed for food enthusiasts to discover top-rated venues, manage favorites, and explore trending culinary spots. The platform integrates localized data with external services to provide a seamless user experience.

-----------------------------------------------------------------------------------------
Features
Venue Discovery: Filter venues by city, district, and category (Dessert, Coffee, Healthy, etc.).

User Authentication: Secure registration and login system with JWT support and Google OAuth2 integration.

Bookmarks & Favorites: Logged-in users can save venues to their personal favorites list.

Blog Section: Explore curated content and detailed venue reviews.

Admin Dashboard: Special server-side rendered (SSR) panel for data synchronization and system management.

Responsive Design: Fully optimized for mobile, tablet, and desktop views using Tailwind CSS.
-----------------------------------------------------------------------------------------
Technology Stack
Backend
- Java 21 & Spring Boot 3.5.7
- Spring Security: (Dummy)JWT & Google OAuth2
- Spring Data JPA: Hibernate ORM
- MySQL: Relational database management
- Maven: Dependency and build management

Frontend
- React 18 (TypeScript)
- Vite: Fast development and build tool
- Tailwind CSS: Modern utility-first styling
- Axios: REST API communication

Infrastructure & Deployment
- AWS EC2 (Ubuntu): Cloud hosting
- Nginx: Reverse proxy and SSL management
- Systemd: Automated service management (foodtrend.service)

Project Structure:
```
Directory structure:
└── rsare-foodtrendguide/
    ├── README.md
    ├── foodtrend-yeni.pem.txt
    ├── foodtrendnew-key
    ├── foodtrendnew-key.pub
    ├── HELP.md
    ├── LICENSE
    ├── mvnw
    ├── mvnw.cmd
    ├── pom.xml
    ├── windows-key
    ├── windows-key.pub
    ├── backend/
    │   ├── pom.xml
    │   └── src/
    │       └── main/
    │           ├── java/
    │           │   └── com/
    │           │       └── foodtrendguide/
    │           │           └── foodtrendguide/
    │           │               ├── FoodTrendGuideApplication.java
    │           │               ├── config/
    │           │               │   ├── AppConfig.java
    │           │               │   ├── CorsConfig.java
    │           │               │   ├── DataLoader.java
    │           │               │   ├── SecurityConfig.java
    │           │               │   └── WebConfig.java
    │           │               ├── controller/
    │           │               │   ├── AdminController.java
    │           │               │   ├── AuthController.java
    │           │               │   ├── BlogPostController.java
    │           │               │   ├── BookmarkController.java
    │           │               │   ├── InfoController.java
    │           │               │   ├── NoteController.java
    │           │               │   ├── PageController.java
    │           │               │   ├── PhotoController.java
    │           │               │   ├── ReviewController.java
    │           │               │   ├── UserController.java
    │           │               │   └── VenueController.java
    │           │               ├── dto/
    │           │               │   └── LoginRequest.java
    │           │               ├── entity/
    │           │               │   └── User.java
    │           │               ├── model/
    │           │               │   ├── BlogPost.java
    │           │               │   ├── Bookmark.java
    │           │               │   ├── GoogleLoginRequest.java
    │           │               │   ├── LoginRequest.java
    │           │               │   ├── Note.java
    │           │               │   ├── Photo.java
    │           │               │   ├── Review.java
    │           │               │   └── Venue.java
    │           │               ├── repository/
    │           │               │   ├── BlogPostRepository.java
    │           │               │   ├── BookmarkRepository.java
    │           │               │   ├── NoteRepository.java
    │           │               │   ├── PhotoRepository.java
    │           │               │   ├── ReviewRepository.java
    │           │               │   ├── UserRepository.java
    │           │               │   └── VenueRepository.java
    │           │               └── service/
    │           │                   ├── AuthService.java
    │           │                   ├── BookmarkService.java
    │           │                   ├── GooglePlacesService.java
    │           │                   ├── LoginAttemptService.java
    │           │                   ├── OpenStreetMapService.java
    │           │                   ├── PhotoService.java
    │           │                   └── VenueService.java
    │           └── resources/
    │               ├── application.properties
    │               ├── application.yml
    │               ├── keystore.p12
    │               ├── static/
    │               │   ├── index.html
    │               │   └── assets/
    │               │       ├── index-DBQyoEa8.css
    │               │       ├── index-DcGZwgnK.css
    │               │       └── index-xb71MQPT.css
    │               └── templates/
    │                   ├── admin.html
    │                   ├── index.html
    │                   └── info.html
    ├── frontend/
    │   ├── README.md
    │   ├── eslint.config.js
    │   ├── index.html
    │   ├── package.json
    │   ├── tailwind.config.js
    │   ├── tsconfig.app.json
    │   ├── tsconfig.json
    │   ├── tsconfig.node.json
    │   ├── vite.config.ts
    │   └── src/
    │       ├── App.tsx
    │       ├── index.css
    │       ├── main.tsx
    │       ├── types.ts
    │       ├── api/
    │       │   ├── authApi.ts
    │       │   └── venueApi.ts
    │       ├── components/
    │       │   ├── Badge.tsx
    │       │   ├── Button.tsx
    │       │   ├── EmptyState.tsx
    │       │   ├── FilterBar.tsx
    │       │   ├── Header.tsx
    │       │   ├── Navbar.tsx
    │       │   ├── SearchBar.tsx
    │       │   └── VenueCard.tsx
    │       ├── data/
    │       │   └── turkiye-data.ts
    │       └── pages/
    │           ├── AdminSyncPage.tsx
    │           ├── BlogDetailPage.tsx
    │           ├── BlogPage.tsx
    │           ├── BookmarksPage.tsx
    │           ├── ExplorePage.tsx
    │           ├── FavoritesPage.tsx
    │           ├── HomePage.tsx
    │           ├── LandingPage.tsx
    │           ├── LoginPage.tsx
    │           ├── ProfilePage.tsx
    │           ├── RegisterPage.tsx
    │           ├── VenueDetailPage.tsx
    │           └── WidgetPage.tsx
    └── .mvn/
        └── wrapper/
            └── maven-wrapper.properties
```
Installation & Deployment
1. Frontend Build
Navigate to the frontend directory and build the production assets:
```
cd frontend
npm install
npm run build
```
Copy the contents of frontend/dist to backend/src/main/resources/static.

2. Backend Build
Navigate to the backend directory and create the executable JAR:
```
cd backend
mvn clean package -DskipTests
```

3. Deployment (Ubuntu/AWS)
Upload the backend-service.jar to your server and restart the service:
```
sudo systemctl restart foodtrend
```
Technical Challenges Overcome
Mixed Content Security: Migrated all API calls from absolute http paths to relative /api paths to ensure compatibility with HTTPS/SSL environments.

TypeScript Optimization: Strict type checking was implemented to ensure code integrity, resolving unused variable and function errors during the production build.

SSR Integration: Successfully integrated Thymeleaf-based Admin and Info pages within a React Single Page Application (SPA) environment using specific route handling.

<img width="1903" height="946" alt="image" src="https://github.com/user-attachments/assets/05d97ea6-71d7-4606-b413-ee0a83bd544d" />
<img width="1900" height="943" alt="image" src="https://github.com/user-attachments/assets/2b87292b-ac8c-4981-b296-cf87d5fe6ba4" />
<img width="1901" height="944" alt="image" src="https://github.com/user-attachments/assets/ba6293b5-9a8a-42fd-9462-8a547424b7ca" />
<img width="1912" height="942" alt="image" src="https://github.com/user-attachments/assets/e60dcb64-9cad-4402-b53b-6c4d2ce83db1" />
<img width="1907" height="945" alt="image" src="https://github.com/user-attachments/assets/0bcac3b1-0723-4240-9568-b43aedb42ed8" />





