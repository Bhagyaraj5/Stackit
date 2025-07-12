# StackIt - Q&A Forum Frontend

A modern, responsive Q&A forum built with React, Tailwind CSS, and Supabase. StackIt provides a clean, developer-friendly interface for asking questions, providing answers, and building a knowledge-sharing community with real backend integration.

## 🚀 Features

### Core Functionality
- **Question Management**: Ask, view, and search questions
- **Answer System**: Provide answers with voting and acceptance
- **User Authentication**: Real authentication with Supabase Auth
- **Voting System**: Upvote/downvote questions and answers
- **Tag System**: Categorize questions with tags
- **Search & Filter**: Find questions by title, content, or tags
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **File Upload**: Profile picture uploads with Supabase Storage
- **Real-time Data**: Live updates with Supabase real-time subscriptions

### User Experience
- **Real-time Search**: Instant search results as you type
- **Smart Filtering**: Filter by tags, sort by various criteria
- **Notification System**: Stay updated with activity notifications
- **Loading States**: Smooth loading animations and skeleton screens
- **Form Validation**: Comprehensive client-side validation
- **Toast Notifications**: Success/error feedback messages
- **Profile Management**: Edit profile with avatar uploads

### Design System
- **Modern UI**: Clean, minimal design with subtle animations
- **Consistent Colors**: Professional color palette with semantic meaning
- **Typography**: Inter font family for excellent readability
- **Component Library**: Reusable UI components with variants
- **Mobile-First**: Responsive design that works on all devices

## 🛠 Tech Stack

- **React 18+** - Modern React with hooks and functional components
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Lucide React** - Beautiful, customizable icons
- **Vite** - Fast build tool and development server
- **Supabase** - Backend-as-a-Service with PostgreSQL database and authentication

## 📁 Project Structure

```
src/
├── App.jsx                 # Main app component with routing
├── main.jsx               # React entry point
├── index.css              # Global styles and Tailwind imports
├── lib/
│   └── supabase.js        # Supabase client configuration
├── services/
│   └── authService.js     # Authentication service with Supabase
├── components/
│   ├── Layout/
│   │   ├── Navbar.jsx     # Navigation bar with search and user menu
│   │   └── Layout.jsx     # Main layout wrapper
│   ├── Questions/
│   │   ├── QuestionCard.jsx    # Individual question display
│   │   ├── QuestionList.jsx    # List of questions with loading states
│   │   └── FilterBar.jsx       # Search and filter controls
│   ├── Answers/
│   │   ├── AnswerCard.jsx      # Individual answer display
│   │   └── AnswerForm.jsx      # Form for submitting answers
│   ├── UI/
│   │   ├── Button.jsx          # Reusable button component
│   │   ├── Input.jsx           # Form input component
│   │   └── Toast.jsx           # Notification toast system
│   └── Common/
│       ├── NotificationPanel.jsx # User notifications dropdown
│       ├── LoadingSpinner.jsx    # Loading states and skeletons
│       └── EditProfileModal.jsx  # Profile editing modal
├── pages/
│   ├── Home.jsx           # Question list with search and filters
│   ├── QuestionDetail.jsx # Individual question with answers
│   ├── AskQuestion.jsx    # Form for asking new questions
│   ├── Auth.jsx           # Login/signup forms
│   └── Dashboard.jsx      # User profile and activity
├── context/
│   └── AuthContext.jsx    # Global authentication state with Supabase
└── utils/
    └── mockData.js        # Sample data for development
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) - Main actions and links
- **Secondary**: Gray (#6B7280) - Text and borders
- **Success**: Green (#10B981) - Positive actions and accepted answers
- **Warning**: Orange (#F59E0B) - Caution and notifications
- **Danger**: Red (#EF4444) - Errors and destructive actions

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold weights with proper hierarchy
- **Body Text**: Normal weight with comfortable line height

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Multiple variants (primary, secondary, outline, etc.)
- **Inputs**: Clean borders with focus states
- **Tags**: Colorful pills for categorization

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Supabase account (free tier available)

### Supabase Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Sign up and create a new project
   - Wait for the project to be ready

2. **Get Your Project Credentials**
   - Go to Settings → API in your Supabase dashboard
   - Copy your Project URL and anon/public key

3. **Set Up Environment Variables**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env with your Supabase credentials
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set Up Database Schema**
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase-schema.sql`
   - Run the SQL to create all tables, policies, and sample data

5. **Configure Storage**
   - Go to Storage in your Supabase dashboard
   - The SQL script will create the necessary buckets
   - Verify that `avatars` and `question-images` buckets exist

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stackit-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy and edit the environment file
   cp env.example .env
   # Add your Supabase credentials to .env
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Usage

### For Users

1. **Sign Up/Login**: Create an account or sign in with existing credentials
2. **Browse Questions**: Visit the home page to see all questions
3. **Search**: Use the search bar to find specific questions
4. **Filter**: Use tags and sort options to narrow results
5. **Ask Questions**: Click "Ask Question" to create a new post
6. **Answer Questions**: Provide helpful answers to questions
7. **Vote**: Upvote good content and downvote poor content
8. **Accept Answers**: Mark the best answer for your questions
9. **Edit Profile**: Update your profile and upload avatar pictures

### For Developers

1. **Authentication**: Real Supabase authentication system
2. **Database**: PostgreSQL database with Row Level Security
3. **File Storage**: Supabase Storage for avatar uploads
4. **Real-time**: Live updates with Supabase subscriptions
5. **API**: RESTful API with automatic type generation

## 🔧 Customization

### Adding New Features

1. **New Pages**: Add routes in `App.jsx` and create page components
2. **New Components**: Create reusable components in `src/components/`
3. **Styling**: Use Tailwind classes or extend the design system
4. **Database**: Add new tables and policies in Supabase

### Theming

1. **Colors**: Modify the color palette in `tailwind.config.js`
2. **Typography**: Update font settings in `tailwind.config.js`
3. **Components**: Customize component styles in `src/index.css`

## 🎯 Key Features Explained

### Authentication System
- Real user registration and login with Supabase Auth
- Email/password authentication
- Automatic session management
- Profile data stored in PostgreSQL

### File Upload System
- Profile picture uploads to Supabase Storage
- Automatic file validation and size limits
- Public URLs for easy access
- Secure storage with user-based permissions

### Search & Filter System
- Real-time search across question titles, descriptions, and tags
- Multi-tag filtering with visual feedback
- Sort by newest, oldest, most votes, most answers, or unanswered
- URL-based search state for sharing and bookmarking

### Voting System
- Upvote/downvote questions and answers
- Visual feedback with color changes
- Optimistic updates for better UX
- Vote counts update immediately

### Notification System
- Real-time notification panel
- Different notification types (answers, votes, mentions)
- Unread count badge
- Mark as read functionality

### Responsive Design
- Mobile-first approach
- Hamburger menu for mobile navigation
- Responsive grid layouts
- Touch-friendly interactions

## 🔮 Future Enhancements

### Planned Features
- **Dark Mode**: Toggle between light and dark themes
- **Real-time Updates**: WebSocket integration for live updates
- **Rich Text Editor**: Enhanced markdown editor for questions/answers
- **User Profiles**: Detailed user profiles with activity history
- **Moderation Tools**: Admin panel for content moderation
- **Email Notifications**: Email alerts for important activities

### Technical Improvements
- **Performance**: Implement virtual scrolling for large lists
- **Accessibility**: Enhanced ARIA labels and keyboard navigation
- **Testing**: Add comprehensive unit and integration tests
- **PWA**: Progressive Web App features
- **SEO**: Server-side rendering for better SEO

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Tailwind CSS** for the amazing utility-first CSS framework
- **Lucide React** for the beautiful icon set
- **React Router** for seamless client-side routing
- **Vite** for the fast development experience
- **Supabase** for the powerful backend-as-a-service platform

---

**StackIt** - Building a better Q&A community, one question at a time! 🚀 

## 👤 Hackathon Reviewer Access

This project was submitted as part of the Odoo Hackathon 2025.

The following reviewer has been added as a collaborator for judging purposes:

- **Name**: Akash Parmar  
- **Email**: akap@odoo.com  
- **GitHub Role**: Collaborator (read access)  
- **Purpose**: Evaluation, code review, and testing

Please contact us if any access issues occur.

---