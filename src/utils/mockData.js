// Mock Users
export const users = [
    {
        id: 1,
        username: "john_doe",
        email: "john@example.com",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        reputation: 1250,
        joinedAt: "2023-01-15T10:30:00Z"
    },
    {
        id: 2,
        username: "sarah_dev",
        email: "sarah@example.com",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        reputation: 890,
        joinedAt: "2023-03-20T14:15:00Z"
    },
    {
        id: 3,
        username: "mike_coder",
        email: "mike@example.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        reputation: 2100,
        joinedAt: "2022-11-10T09:45:00Z"
    },
    {
        id: 4,
        username: "alex_tech",
        email: "alex@example.com",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        reputation: 750,
        joinedAt: "2023-05-12T16:20:00Z"
    }
];

// Mock Questions
export const questions = [
    {
        id: 1,
        title: "How to optimize React performance with useMemo and useCallback?",
        description: "I'm building a large React application and experiencing performance issues. I've heard about useMemo and useCallback hooks but I'm not sure when to use them. Can someone explain the best practices for optimizing React components? I'm particularly interested in preventing unnecessary re-renders and optimizing expensive calculations.",
        tags: ["React", "Performance", "JavaScript", "Hooks"],
        author: users[0],
        votes: 15,
        answers: [1, 2],
        views: 245,
        isAnswered: true,
        acceptedAnswerId: 1,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-16T14:20:00Z"
    },
    {
        id: 2,
        title: "What's the difference between TypeScript interfaces and types?",
        description: "I'm learning TypeScript and I'm confused about when to use interfaces vs types. They seem to do similar things but I'm sure there are important differences. Can someone explain the key differences and when to use each one?",
        tags: ["TypeScript", "JavaScript", "Programming"],
        author: users[1],
        votes: 8,
        answers: [3],
        views: 120,
        isAnswered: false,
        acceptedAnswerId: null,
        createdAt: "2024-01-14T16:45:00Z",
        updatedAt: "2024-01-14T16:45:00Z"
    },
    {
        id: 3,
        title: "Best practices for API error handling in Node.js",
        description: "I'm building a REST API with Node.js and Express, and I want to implement proper error handling. What are the best practices for handling different types of errors (validation, authentication, database, etc.) and returning appropriate HTTP status codes?",
        tags: ["Node.js", "Express", "API", "Error Handling"],
        author: users[2],
        votes: 23,
        answers: [4, 5, 6],
        views: 389,
        isAnswered: true,
        acceptedAnswerId: 4,
        createdAt: "2024-01-13T09:15:00Z",
        updatedAt: "2024-01-15T11:30:00Z"
    },
    {
        id: 4,
        title: "How to implement dark mode in a React app with Tailwind CSS?",
        description: "I want to add dark mode functionality to my React application that uses Tailwind CSS. What's the best way to implement this? Should I use CSS variables, localStorage, or a state management solution?",
        tags: ["React", "Tailwind CSS", "Dark Mode", "CSS"],
        author: users[3],
        votes: 12,
        answers: [7],
        views: 167,
        isAnswered: false,
        acceptedAnswerId: null,
        createdAt: "2024-01-12T13:20:00Z",
        updatedAt: "2024-01-12T13:20:00Z"
    },
    {
        id: 5,
        title: "Understanding async/await vs Promises in JavaScript",
        description: "I'm trying to understand the difference between async/await and Promises. When should I use one over the other? Are there performance implications? Can someone provide some practical examples?",
        tags: ["JavaScript", "Async", "Promises", "ES6"],
        author: users[0],
        votes: 19,
        answers: [8, 9],
        views: 298,
        isAnswered: true,
        acceptedAnswerId: 8,
        createdAt: "2024-01-11T08:30:00Z",
        updatedAt: "2024-01-13T15:45:00Z"
    }
];

// Mock Answers
export const answers = [
    {
        id: 1,
        questionId: 1,
        content: "Great question! Here's when to use each:\n\n**useMemo**: Use when you have expensive calculations that you want to cache. For example:\n\n```javascript\nconst expensiveValue = useMemo(() => {\n  return heavyCalculation(data);\n}, [data]);\n```\n\n**useCallback**: Use when you want to prevent child components from re-rendering unnecessarily. It's especially useful when passing functions as props:\n\n```javascript\nconst handleClick = useCallback(() => {\n  setCount(prev => prev + 1);\n}, []);\n```\n\nRemember: Don't over-optimize! Only use these when you actually have performance issues.",
        author: users[2],
        votes: 25,
        isAccepted: true,
        createdAt: "2024-01-15T11:30:00Z",
        updatedAt: "2024-01-16T14:20:00Z"
    },
    {
        id: 2,
        questionId: 1,
        content: "I'd also add that you should use React DevTools Profiler to identify actual performance bottlenecks before optimizing. Sometimes the issue isn't re-renders but something else entirely.",
        author: users[1],
        votes: 8,
        isAccepted: false,
        createdAt: "2024-01-15T14:20:00Z",
        updatedAt: "2024-01-15T14:20:00Z"
    },
    {
        id: 3,
        questionId: 2,
        content: "Here are the key differences:\n\n**Interfaces**:\n- Can be extended and merged\n- Better for object shapes\n- More flexible for API contracts\n\n**Types**:\n- Can represent unions, primitives, and more complex types\n- Cannot be changed after creation\n- Better for utility types\n\nIn general, use interfaces for object shapes and types for everything else.",
        author: users[2],
        votes: 15,
        isAccepted: false,
        createdAt: "2024-01-14T17:30:00Z",
        updatedAt: "2024-01-14T17:30:00Z"
    },
    {
        id: 4,
        questionId: 3,
        content: "Here's a comprehensive approach to error handling:\n\n1. **Create custom error classes**\n2. **Use middleware for error handling**\n3. **Return consistent error responses**\n4. **Log errors properly**\n\nExample implementation:\n\n```javascript\nclass AppError extends Error {\n  constructor(message, statusCode) {\n    super(message);\n    this.statusCode = statusCode;\n  }\n}\n\napp.use((err, req, res, next) => {\n  res.status(err.statusCode || 500).json({\n    error: err.message\n  });\n});\n```",
        author: users[0],
        votes: 32,
        isAccepted: true,
        createdAt: "2024-01-13T10:45:00Z",
        updatedAt: "2024-01-15T11:30:00Z"
    },
    {
        id: 5,
        questionId: 3,
        content: "Don't forget to handle async errors properly with try-catch blocks and next(error) in Express middleware!",
        author: users[3],
        votes: 5,
        isAccepted: false,
        createdAt: "2024-01-13T12:15:00Z",
        updatedAt: "2024-01-13T12:15:00Z"
    },
    {
        id: 6,
        questionId: 3,
        content: "I'd also recommend using a validation library like Joi or Yup for input validation errors.",
        author: users[1],
        votes: 7,
        isAccepted: false,
        createdAt: "2024-01-13T15:20:00Z",
        updatedAt: "2024-01-13T15:20:00Z"
    },
    {
        id: 7,
        questionId: 4,
        content: "Here's a simple implementation using Tailwind's dark mode feature:\n\n1. **Enable dark mode in tailwind.config.js**\n2. **Use CSS variables for colors**\n3. **Toggle with JavaScript**\n\n```javascript\n// Toggle function\nconst toggleDarkMode = () => {\n  document.documentElement.classList.toggle('dark');\n  localStorage.setItem('darkMode', \n    document.documentElement.classList.contains('dark'));\n};\n```\n\nThen use `dark:` classes in your Tailwind CSS.",
        author: users[2],
        votes: 18,
        isAccepted: false,
        createdAt: "2024-01-12T14:30:00Z",
        updatedAt: "2024-01-12T14:30:00Z"
    },
    {
        id: 8,
        questionId: 5,
        content: "Async/await is syntactic sugar over Promises. Here's the comparison:\n\n**Promise approach**:\n```javascript\nfetch('/api/data')\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error(error));\n```\n\n**Async/await approach**:\n```javascript\ntry {\n  const response = await fetch('/api/data');\n  const data = await response.json();\n  console.log(data);\n} catch (error) {\n  console.error(error);\n}\n```\n\nAsync/await is generally more readable and easier to debug.",
        author: users[1],
        votes: 28,
        isAccepted: true,
        createdAt: "2024-01-11T09:45:00Z",
        updatedAt: "2024-01-13T15:45:00Z"
    },
    {
        id: 9,
        questionId: 5,
        content: "One important note: async/await doesn't make your code faster - it just makes it more readable. Under the hood, it's still using Promises.",
        author: users[3],
        votes: 12,
        isAccepted: false,
        createdAt: "2024-01-11T11:20:00Z",
        updatedAt: "2024-01-11T11:20:00Z"
    }
];

// Mock Notifications
export const notifications = [
    {
        id: 1,
        type: "answer",
        message: "@sarah_dev answered your question about React performance",
        read: false,
        timestamp: "2024-01-15T11:30:00Z",
        questionId: 1,
        answerId: 1
    },
    {
        id: 2,
        type: "vote",
        message: "Your answer about TypeScript interfaces received 5 upvotes",
        read: false,
        timestamp: "2024-01-15T10:15:00Z",
        questionId: 2,
        answerId: 3
    },
    {
        id: 3,
        type: "mention",
        message: "@mike_coder mentioned you in a comment",
        read: true,
        timestamp: "2024-01-14T16:30:00Z",
        questionId: 3,
        answerId: 4
    },
    {
        id: 4,
        type: "accept",
        message: "Your answer was accepted as the best answer",
        read: false,
        timestamp: "2024-01-13T15:45:00Z",
        questionId: 5,
        answerId: 8
    }
];

// Available tags for filtering
export const availableTags = [
    "React", "JavaScript", "TypeScript", "Node.js", "Express", "API",
    "Performance", "CSS", "Tailwind CSS", "Dark Mode", "Async",
    "Promises", "ES6", "Error Handling", "Programming", "Hooks"
];

// Filter options
export const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "most-votes", label: "Most Votes" },
    { value: "most-answers", label: "Most Answers" },
    { value: "unanswered", label: "Unanswered" }
];

// Helper functions
export const getQuestionById = (id) => {
    return questions.find(q => q.id === id);
};

export const getAnswersByQuestionId = (questionId) => {
    return answers.filter(a => a.questionId === questionId);
};

export const getUserById = (id) => {
    return users.find(u => u.id === id);
};

export const getUnreadNotificationsCount = () => {
    return notifications.filter(n => !n.read).length;
}; 