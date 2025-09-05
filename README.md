# Social Media App 

A modern full-stack social media platform built with Next.js, enabling users to connect, share posts, engage in real time chats, receive notifications and explore content. With a  UI and robust backend, this app delivers a seamless and engaging experience for posting updates, liking content messaging friends, and more!

## Features

- **Authentication**: Secure user registration, login, password reset, and JWT-based authentication with bcrypt for password hashing.
- **Dynamic Feed**: Personalized "For You" and "Following" tabs with infinite scrolling and real-time post updates.
- **Posts**: Create posts with text and media, support for liking/unliking, commenting, and sharing.
- **Messaging**: Private conversations with dynamic chat windows and message history.
- **Notifications**: Instant alerts for likes, comments, follows, and messages with grouped display.
- **Search**: Discover users and posts with dynamic, query-based filtering.
- **User Profiles**: View user details, bios, and personal posts with a clean interface.
- **Responsive Design**: Mobile-friendly with bottom navigation and desktop sidebar for intuitive navigation.
## Tech Stack

### Frontend

- **Next.js** & **React**: Server-side rendering and interactive UI components.
- **Tailwind CSS**: Utility-first styling for responsive and modern design.
- **Lucide Icons**: Lightweight, customizable SVG icons.
- **Custom Hooks**: `useUser` and state management for dynamic user context.

### Backend

- **Next.js API Routes**: RESTful endpoints for handling app logic.
- **Prisma**: ORM for PostgreSQL database management and migrations.
- **Zod**: Schema validation for secure API requests.
- **JWT & Bcrypt**: Secure authentication and password hashing.
- **PostgreSQL**: Robust database for users, posts, messages, and notifications.

### Other Tools

- **TypeScript**: Type-safe code for better maintainability.
- **REST Client**: API testing with `Testforauth.rest` for endpoint validation.
- **ESLint & Prettier**: Code linting and formatting for consistency.

##  Installation

1. **Clone the Repository**:
    
    ```
    git clone https://github.com/birhadaniel/Social_Media.git
    cd social-media-app
    ```
    
2. **Install Dependencies**:
    
    ```
    npm install
    ```
    
3. **Set Up Environment Variables**:  
    Create a `.env` file in the root directory:
    
    ```
    DATABASE_URL=postgresql://user:password@localhost:5432/socialapp
    JWT_SECRET=your_jwt_secret_here
    ```
    
4. **Set Up Database**:
    
    ```
    npx prisma migrate dev
    npx prisma db push
    ```
    
5. **Run the Development Server**:
    
    ```
    npm run dev
    ```
    
    Open [http://localhost:3000](http://localhost:3000/) in your browser.
    

## Usage

- **Register/Login**: Access `/auth/register` or `/auth/login` to create or sign into an account.
- **Create Posts**: Use the "Post" button in the sidebar or navbar to share content.
- **Engage**: Like, comment, or share posts in the `/feed`.
- **Chat**: Start conversations at `/messages` with real-time messaging.
- **Notifications**: View real-time updates at `/notifications`.
- **Search**: Find users or posts at `/search` with dynamic results.
- **Profile**: Check your profile and posts at `/profile`.
- **Test APIs**: Use `Testforauth.rest` with VS Code's REST Client for endpoint testing.

## Contributors

This project was brought to life by a dedicated team of developers, each contributing unique expertise to create a robust and user-friendly platform:


 - **Kalkidan Tadesse**- **Frontend Developer**
	Role: Focused on state management, custom hooks (e.g., `useUser`), and frontend integrations with backend APIs. Optimized client-side performance, handled modal interactions, and enhanced user flows for features like messaging and search. Ensured consistent UI/UX and tested frontend responsiveness.
	
- **Eyerusalem Rufael**-  **Frontend Developer** 
	Role: Spearheaded the frontend architecture, designing responsive UI components with Next.js and Tailwind CSS. Implemented dynamic features like the feed, post modals, and notifications. Ensured cross-device compatibility, smooth animations, and accessibility compliance for an engaging user experience. 

- **Folikia Nigussie** - **Backend Developer**  
	Role: Architected the backend infrastructure, including Next.js API routes and Prisma ORM integration. Designed and implemented secure authentication with JWT and bcrypt, and developed services for posts, messages, notifications, and follows. Ensured API scalability, handled error validation with Zod, and optimized server-side performance.
    
- **Daniel Birhanu** - **Backend Developer**   
	Role: Managed database schema design, migrations, and optimizations using Prisma and PostgreSQL. Implemented efficient queries for real-time data retrieval and ensured data consistency across users, posts, and messages. Developed search functionality and validated API inputs with Zod to enhance security and reliability.
    

##  Contributing

We welcome contributions! To get started:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Commit changes (`git commit -m 'Add YourFeature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.
