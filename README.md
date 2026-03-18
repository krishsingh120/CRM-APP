# CRM Application - Frontend Architecture Guide

## Table of Contents

1. [Project Overview](#project-overview)
2. [Frontend Architecture (HLD)](#frontend-architecture-hld)
3. [Component Structure](#component-structure)
4. [Folder Structure Explanation](#folder-structure-explanation)
5. [Key Code Walkthrough](#key-code-walkthrough)
6. [Important React Concepts Used](#important-react-concepts-used)
7. [Interview Questions & Answers](#interview-questions--answers)
8. [Performance Considerations](#performance-considerations)
9. [Improvements & Future Scope](#improvements--future-scope)

---

## Project Overview

**Project Name**: Vishnu CRM Application

**Purpose**: A Customer Relationship Management (CRM) application built with React for managing tickets, users, and their statistics. The application provides role-based access control where admin users can view all system users, while regular users can view their assigned tickets.

**Key Features**:

- User Authentication (Login/SignUp with role-based registration)
- Ticket Management & Status Tracking
- Dashboard with Real-time Statistics (Pie, Line, and Bar Charts)
- Role-Based Access Control (Admin, Engineer, Customer)
- PDF Export Functionality for Reports
- Responsive UI using Bootstrap 5

**Tech Stack**:

```
Frontend Framework: React 18.2.0
State Management: Redux Toolkit 1.9.5
Routing: React Router DOM v6.15.0
HTTP Client: Axios 1.5.0
UI Framework: Bootstrap 5.3.1 + React Bootstrap 2.8.0
Form Management: React Hook Form 7.46.1
Charts: Chart.js 4.4.0 + react-chartjs-2 5.2.0
Notifications: React Hot Toast 2.4.1
Build Tool: Vite 4.4.5
```

---

## Frontend Architecture (HLD)

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    React Application Entry                      │
│                      (main.jsx)                                 │
└────────────────────┬────────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
   [Redux Store]          [BrowserRouter]
   (Provider)             (Context)
        │                         │
        ├─ Auth Slice            │
        │  • login()             │
        │  • signup()            │
        │  • logout()            │
        │                         │
        ├─ Ticket Slice          │
        │  • getAllTickets()     │
        │  • filterTickets()     │
        │                         │
        └─ Middleware            │
           (SerializableCheck)   │
                                 │
                    ┌────────────▼────────────┐
                    │   MainRoutes.jsx        │
                    │   (Route Config)        │
                    └────────────┬────────────┘
                                 │
        ┌────────────┬───────────┼───────────┬────────────┐
        │            │           │           │            │
   [Home Page]  [Auth Routes]  [Dashboard]  [Users]   [Auth Pages]
   (Charts)     (Protected)    (Tickets)    (Admin)   (Login/Signup)
```

### Data Flow

```
User Interaction → Component Event Handler
                        ↓
                   Dispatch Redux Action (Async Thunk)
                        ↓
                   API Call via Axios
                        ↓
                   Redux Store Updated
                        ↓
                   Connected Components Re-render (useSelector)
                        ↓
                   UI Updated with New Data
```

### State Management Strategy

**Redux Store Structure**:

```javascript
store = {
  auth: {
    role: string, // 'admin', 'engineer', 'customer'
    data: object, // User profile data
    token: string, // JWT token for API calls
    isLoggedIn: boolean, // Authentication status
  },
  tickets: {
    downloadedTickets: array, // All tickets fetched from API
    ticketList: array, // Filtered tickets based on status
    ticketDistribution: {
      // Count by status
      open: number,
      onHold: number,
      inProgress: number,
      canceled: number,
      resolved: number,
    },
  },
};
```

### API Integration Flow

```
Axios Instance (axiosInstance.js)
           ↓
  Base URL from Environment (.env)
           ↓
  HTTP Methods (GET, POST)
           ↓
  Redux Async Thunk (createAsyncThunk)
           ↓
  Error Handling + Toast Notifications
           ↓
  State Update → Component Re-render
```

---

## Component Structure

### Component Hierarchy Tree

```
App.jsx (Root Component)
    │
    └── MainRoutes.jsx (Route Configuration)
            │
            ├── Home.jsx (Home Page)
            │   ├── HomeLayout.jsx (Navigation & Layout)
            │   │   └── Offcanvas Menu
            │   │
            │   ├── Card.jsx (Reusable Ticket Stats Cards)
            │   │   ├── onClick → Navigate to Dashboard
            │   │   └── Props: {titleText, quantity, children}
            │   │
            │   ├── Pie Chart (from react-chartjs-2)
            │   ├── Line Chart (from react-chartjs-2)
            │   └── Bar Chart (from react-chartjs-2)
            │
            ├── Login.jsx (Authentication Page)
            │   └── Form Inputs: {email, password}
            │       └── Dispatch: login() action
            │
            ├── SignUp.jsx (Registration Page)
            │   └── React Hook Form Validation
            │       └── Inputs: {name, email, password, userType, clientName}
            │           └── Dispatch: signup() action
            │
            ├── AuthRoutes.jsx (Protected Route Wrapper)
            │   └── Role-based Access Control
            │       └── Outlet (Render Protected Content)
            │
            ├── ListAllUsers.jsx (Admin-only Page)
            │   └── Fetch all users from API
            │       └── PDF Export Functionality
            │
            └── Dashboard.jsx (Ticket Management Page)
                ├── HomeLayout.jsx (Navigation)
                ├── Table (Ticket Details)
                └── PDF Export Button
```

### Component Responsibilities

| Component            | Purpose                               | Key Props                           | State            |
| -------------------- | ------------------------------------- | ----------------------------------- | ---------------- |
| **App.jsx**          | Root wrapper                          | None                                | None             |
| **Home.jsx**         | Display dashboard with stats & charts | None                                | Uses Redux hooks |
| **Card.jsx**         | Reusable card showing ticket count    | `titleText`, `quantity`, `children` | None             |
| **Login.jsx**        | User authentication                   | None                                | `loginDetails`   |
| **SignUp.jsx**       | User registration with role selection | None                                | `signupDetails`  |
| **Dashboard.jsx**    | Display all user tickets in table     | None                                | Uses Redux hooks |
| **ListAllUsers.jsx** | Admin user list display               | None                                | `allUserList`    |
| **HomeLayout.jsx**   | Navigation sidebar & layout           | `children`                          | None             |
| **AuthRoutes.jsx**   | Protected route wrapper               | `allowListedRoles`                  | None             |

---

## Folder Structure Explanation

### Directory Overview

```
crm_app/
├── src/
│   ├── App.jsx                          # Root component rendering MainRoutes
│   ├── main.jsx                         # Entry point (Redux Provider + Router)
│   ├── index.css                        # Global styles
│   ├── App.css                          # App-level styles
│   │
│   ├── component/                       # Reusable UI Components
│   │   ├── Card/
│   │   │   ├── Card.jsx                 # Ticket stats card component
│   │   │   └── Card.css                 # Card styling
│   │   └── DemoPage/
│   │       └── DemoPage.jsx             # Demo/placeholder component
│   │
│   ├── pages/                           # Page Components (Routes)
│   │   ├── Home/
│   │   │   ├── Home.jsx                 # Dashboard main page with charts
│   │   │   └── Home.css                 # Home page styling
│   │   │
│   │   ├── auth/
│   │   │   ├── Login.jsx                # Login form page
│   │   │   └── SignUp.jsx               # Registration form page
│   │   │
│   │   ├── Dashboard/
│   │   │   └── Dashboard.jsx            # Ticket table display page
│   │   │
│   │   └── users/
│   │       └── ListAllUsers.jsx         # Admin users list page
│   │
│   ├── Layouts/
│   │   └── HomeLayout.jsx               # Reusable navigation & layout wrapper
│   │
│   ├── hooks/                           # Custom React Hooks
│   │   ├── useTickets.js                # Fetch & filter tickets
│   │   └── useChart.js                  # Process data for charts
│   │
│   ├── Redux/                           # Redux Configuration
│   │   ├── store.js                     # Redux store configuration
│   │   └── Slices/
│   │       ├── AuthSlice.js             # Authentication state & async thunks
│   │       └── TicketSlice.js           # Ticket management state & thunks
│   │
│   ├── config/
│   │   └── axiosInstance.js             # Axios configuration & base setup
│   │
│   ├── routing/                         # Route Configuration
│   │   ├── MainRoutes.jsx               # Main route definitions
│   │   └── AuthRoutes.jsx               # Protected route wrapper
│   │
│   └── assets/                          # Static assets (images, fonts, etc.)
│
├── public/                              # Public assets (favicon, etc.)
├── index.html                           # HTML entry point
├── package.json                         # Dependencies & scripts
├── vite.config.js                       # Vite configuration
└── README.md                            # This file
```

### Folder Purposes

| Folder         | Purpose                      | Contains                                               |
| -------------- | ---------------------------- | ------------------------------------------------------ |
| **component/** | Reusable UI components       | Card, DemoPage                                         |
| **pages/**     | Route-mapped page components | Home, Login, SignUp, Dashboard, ListAllUsers           |
| **Layouts/**   | Layout wrapper components    | HomeLayout (navigation sidebar)                        |
| **hooks/**     | Custom React hooks           | useTickets (data fetching), useChart (data processing) |
| **Redux/**     | State management             | Store config, Auth & Ticket slices                     |
| **config/**    | Configuration files          | Axios instance setup                                   |
| **routing/**   | Route configuration          | MainRoutes, AuthRoutes (protected routes)              |
| **assets/**    | Static resources             | Images, fonts, etc.                                    |

---

## Key Code Walkthrough

### 1. Redux Store Setup (Redux/store.js)

```javascript
import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "../Redux/Slices/AuthSlice";
import ticketSliceReducer from "../Redux/Slices/TicketSlice";

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    tickets: ticketSliceReducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable for non-serializable values
    }),
});

export default store;
```

**Key Concepts**:

- `configureStore` wraps Redux setup with good defaults
- Two reducers: auth & tickets manage separate state domains
- `devTools: true` enables Redux DevTools browser extension
- `serializableCheck: false` allows non-serializable data in store

### 2. Authentication Async Thunk (Redux/Slices/AuthSlice.js)

```javascript
export const login = createAsyncThunk("/auth/login", async (data) => {
  try {
    const response = axiosInstance.post("auth/signin", data);
    // Show toast notification while promise resolves
    toast.promise(response, {
      loading: "Logining form",
      success: "Successfull loged in",
      error: "Something went wrong, Try again",
    });
    return await response;
  } catch (error) {
    console.log("error Handled by loging", error);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    role: localStorage.getItem("role") || "",
    data: JSON.parse(localStorage.getItem("data")) || undefined,
    token: localStorage.getItem("token") | "",
    isLoggedIn: localStorage.getItem("isLoggedIn") || false,
  },
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.data = undefined;
      state.token = "";
      state.role = "";
      // Should clear localStorage too
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      if (!action.payload) return;
      state.isLoggedIn = action.payload?.data.token != undefined;
      state.data = action.payload?.data.userData;
      state.token = action.payload?.data.token;
      state.role = action.payload?.data.userData?.userType;
      // Persist to localStorage
      localStorage.setItem("role", action.payload?.data.userData?.userType);
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem(
        "data",
        JSON.stringify(action.payload?.data.userData),
      );
      localStorage.setItem("token", action.payload?.data.token);
    });
  },
});
```

**Key Concepts**:

- `createAsyncThunk` generates async action with pending/fulfilled/rejected states
- `extraReducers` handles async thunk results
- State persisted to localStorage for app restart resilience
- Toast notifications provide user feedback

### 3. Ticket Management Async Thunk (Redux/Slices/TicketSlice.js)

```javascript
export const getAllTicketsforTheUser = createAsyncThunk(
  "tickets/getAllTicketsforTheUser",
  async () => {
    try {
      const response = axiosInstance.get("getMyAssignedTickets", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      });
      toast.promise(response, {
        success: "Successfully loaded all the tickets",
        loading: "Fetching tickets belonging to you",
        error: "Something went wrong",
      });
      return await response;
    } catch (error) {
      console.log("error handled by ticket slice", error);
    }
  },
);

const ticketSlice = createSlice({
  name: "tickets",
  initialState: {
    downloadedTickets: [],
    ticketList: [],
    ticketDistribution: {
      open: 0,
      onHold: 0,
      inProgress: 0,
      canceled: 0,
      resolved: 0,
    },
  },
  reducers: {
    filterTickets: (state, action) => {
      let status = action.payload.status.toLowerCase();
      if (status == "in progress") status = "inProgress";
      if (status == "on hold") status = "onHold";
      // Filter the downloaded tickets list based on status
      state.ticketList = state.downloadedTickets.filter(
        (ticket) => ticket.status == status,
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllTicketsforTheUser.fulfilled, (state, action) => {
      if (!action?.payload?.data) return;
      state.ticketList = action?.payload?.data?.result;
      state.downloadedTickets = action?.payload?.data?.result;

      // Calculate ticket distribution by status
      const tickets = action?.payload?.data?.result;
      state.ticketDistribution = {
        open: 0,
        onHold: 0,
        inProgress: 0,
        canceled: 0,
        resolved: 0,
      };
      tickets.forEach((ticket) => {
        state.ticketDistribution[ticket.status]++;
      });
    });
  },
});
```

**Key Concepts**:

- Filters stored separately in two lists (original vs filtered)
- Calculates statistics by iterating through tickets
- Status normalization (handle both "in progress" and "inProgress")

### 4. Custom Hook - useTickets (hooks/useTickets.js)

```javascript
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  filterTickets,
  getAllTicketsforTheUser,
} from "../Redux/Slices/TicketSlice";

function useTickets() {
  const authState = useSelector((state) => state.auth);
  const ticketsState = useSelector((state) => state.tickets);
  const [searchParams] = useSearchParams(); // Get URL query params
  const dispatch = useDispatch();

  async function loadTickets() {
    // Fetch all tickets
    await dispatch(getAllTicketsforTheUser());
    // If URL has status filter, apply it
    if (searchParams.get("status")) {
      dispatch(filterTickets({ status: searchParams.get("status") }));
    }
  }

  // Load tickets when auth token changes
  useEffect(() => {
    loadTickets();
  }, [authState.token]);

  return [ticketsState];
}

export default useTickets;
```

**Key Concepts**:

- Custom hook encapsulates ticket-related logic
- `useSelector` subscribes to Redux state
- `useSearchParams` enables URL-based filtering
- `useEffect` triggers data fetch on auth token change

### 5. Custom Hook - useChart (hooks/useChart.js)

```javascript
function useChart() {
  const [ticketsState] = useTickets();
  const [ticketCharData, setTicketChartData] = useState({
    /* ... */
  });

  // Prepare Pie Chart Data
  const pieChartData = {
    labels: Object.keys(ticketsState.ticketDistribution),
    datasets: [
      {
        data: Object.values(ticketsState.ticketDistribution),
        backgroundColor: ["yellow", "red", "green", "blue", "purple"],
      },
    ],
  };

  // Process ticket data for charts (calculates last 10 days + monthly stats)
  function processOpenTickets() {
    const currentDate = new Date();
    const tenthDayFromToday = new Date();
    tenthDayFromToday.setDate(currentDate.getDate() - 10);

    let opentTicketsData = {};
    let openTicketsByMonth = {
      January: 0,
      February: 0 /* ... months */,
    };

    // Initialize frequency maps for last 10 days
    for (let i = 0; i < 10; i++) {
      const dateObject = new Date();
      dateObject.setDate(currentDate.getDate() - i);
      const dateStr = dateObject
        .toLocaleDateString()
        .split("/")
        .reverse()
        .join("-");
      opentTicketsData[dateStr] = 0;
    }

    // Process each ticket
    ticketsState.ticketList.forEach((ticket) => {
      let date = ticket.createdAt.split("T")[0];
      let ticketDate = new Date(ticket.createdAt);

      // Count by date (if in last 10 days)
      if (ticket.status == "open" && ticketDate > tenthDayFromToday) {
        opentTicketsData[date] = (opentTicketsData[date] || 0) + 1;
      }

      // Count by month
      if (ticket.status == "open") {
        let month = ticketDate.toLocaleString("default", { month: "long" });
        openTicketsByMonth[month] += 1;
      }
    });

    setTicketChartData({
      openTickets: opentTicketsData,
      inProgressTickets: {
        /* ... */
      },
      resolveTicketts: {
        /* ... */
      },
      openTicketsByMonth: openTicketsByMonth,
      // ... more data
    });
  }

  useEffect(() => {
    processOpenTickets();
  }, [ticketsState.ticketList]);

  return [pieChartData, lineChartData, barChartData];
}
```

**Key Concepts**:

- Transforms raw ticket data into chart-ready format
- Aggregates data by date and month
- Calculates statistics for visualization

### 6. Protected Routing (routing/AuthRoutes.jsx)

```javascript
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

function AuthRoutes({ allowListedRoles }) {
  const { role } = useSelector((state) => state.auth);

  return (
    <>
      {allowListedRoles.find((givenRole) => givenRole == role) ? (
        <Outlet />
      ) : (
        <h1>User Not Defined</h1>
      )}
    </>
  );
}

export default AuthRoutes;

// Usage in MainRoutes.jsx:
<Route element={<AuthRoutes allowListedRoles={["admin"]} />}>
  <Route path="/users" element={<ListAllUsers />} />
</Route>;
```

**Key Concepts**:

- `Outlet` renders child routes if authorization passes
- Role-based access control
- Compound component pattern

### 7. Login Form Handling (pages/auth/Login.jsx)

```javascript
function Login() {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  async function onSubmit() {
    if (!loginDetails.email || !loginDetails.password) return;
    // Dispatch async thunk (returns action result)
    const response = await dispatch(login(loginDetails));
    if (response.payload)
      navigator("/"); // Success: redirect
    else resetLoginState(); // Failure: reset form
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setLoginDetails({ ...loginDetails, [name]: value });
  }

  return (
    <div className="container">
      {/* Form inputs */}
      <input
        type="text"
        placeholder="Email.."
        onChange={handleInputChange}
        name="email"
        value={loginDetails.email}
      />
      <button className="btn btn-success" onClick={onSubmit}>
        Submit
      </button>
    </div>
  );
}
```

**Key Concepts**:

- Controlled components (state-driven inputs)
- Async dispatch returns promise
- Conditional navigation based on response

### 8. Signup with React Hook Form (pages/auth/SignUp.jsx)

```javascript
import { useForm } from "react-hook-form";

function SignUp () {
    const { register, formState: { errors }, handleSubmit } = useForm();
    const [signupDetails, setSignupDetails] = useState({ /* ... */ })

    async function handleFormSubmission (data) {
        // React Hook Form provides validated data
        setSignupDetails({
            ...signupDetails,
            name: data.name,
            password: data.password,
            clientName: data.clientName
        })
        if(/* all fields valid */) {
            const response = await dispatch(signup(signupDetails))
            if (response.payload) navigator('/login')
        }
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmission)}>
            {/* Register input with validation */}
            <input
                type="text"
                className="form-control"
                placeholder="User Name.."
                name="name"
                {...register("name", {
                    required: true,
                    minLength: 4
                })}
            />
            {/* Show error if validation fails */}
            {errors.name && errors.name.type == 'minLength' &&
                <p className="text-danger">
                    Name:- requires min 4 characters
                </p>
            }

            {/* Dropdown for role selection */}
            <div className="dropdown">
                <a className="btn btn-secondary dropdown-toggle"
                   data-bs-toggle="dropdown">
                    {signupDetails.userType || "User Type"}
                </a>
                <ul className="dropdown-menu" onClick={handleUserType}>
                    <li><a className="dropdown-item">customer</a></li>
                    <li><a className="dropdown-item">engineer</a></li>
                    <li><a className="dropdown-item">admin</a></li>
                </ul>
            </div>

            <button className="btn btn-success">Submit</button>
        </form>
    )
}
```

**Key Concepts**:

- `useForm` hook manages form state & validation
- Destructure `register`, `formState.errors`, `handleSubmit`
- `register()` spreads validation rules onto inputs
- Errors object tracks validation failures

### 9. Home Dashboard with Charts (pages/Home/Home.jsx)

```javascript
function Home() {
  const [ticketsState] = useTickets();
  const [pieChartData, lineChartData, barChartData] = useChart();

  return (
    <HomeLayout>
      {/* Stats Cards */}
      <div className="d-flex justify-content-center flex-wrap">
        <Card
          quantity={ticketsState.ticketDistribution.open}
          titleText={"Open"}
        >
          <BsFillPencilFill />
        </Card>
        <Card
          quantity={ticketsState.ticketDistribution.inProgress}
          titleText={"In Progress"}
        >
          <TbProgressBolt />
        </Card>
        {/* More cards... */}
      </div>

      {/* Charts */}
      <div className="pie-chart-data">
        <Pie data={pieChartData} />
      </div>
      <div className="line-chart-data">
        <Line data={lineChartData} />
      </div>
      <div>
        <Bar data={barChartData} />
      </div>
    </HomeLayout>
  );
}
```

### 10. Reusable Card Component (component/Card/Card.jsx)

```javascript
function Card({ children, titleText = "", quantity = "0" }) {
  const navigator = useNavigate();

  function onCardClick() {
    // Navigate to dashboard with status filter
    navigator(`/dashboard?status=${titleText}`);
  }

  return (
    <div className="wrapper" onClick={onCardClick}>
      <div className="card-wrapper">
        <div
          className="card-upper-part d-flex justify-content-center 
                                align-items-center mt-3 gap-3"
        >
          {children} {/* Icon passed as children */}
          <h3>{titleText}</h3> {/* Status label */}
        </div>
        <div className="card-lower-part d-flex justify-content-center mt-3">
          <h1>{quantity}</h1> {/* Ticket count */}
        </div>
      </div>
    </div>
  );
}
```

**Key Concepts**:

- `children` prop for icon composition
- onClick handler with parameterized navigation
- Reusable across all ticket status types

### 11. Dashboard with PDF Export (pages/Dashboard/Dashboard.jsx)

```javascript
import { usePDF } from "react-to-pdf";

function Dashboard() {
  const [ticketState] = useTickets();
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });

  return (
    <HomeLayout>
      <button className="btn btn-primary" onClick={() => toPDF()}>
        Export to Pdf
      </button>

      {/* Content to be converted to PDF */}
      <div ref={targetRef}>
        <table className="table table-bordered text-center">
          <thead className="table-danger">
            <tr>
              <th>Ticket Id</th>
              <th>Title</th>
              <th>Description</th>
              <th>Reporter</th>
              <th>Priority</th>
              <th>Assignee</th>
              <th>Status</th>
            </tr>
          </thead>
          {ticketState &&
            ticketState.ticketList.map((ticket) => (
              <tbody key={ticket._id}>
                <tr>
                  <td>{ticket._id}</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.description}</td>
                  <td>{ticket.assignee}</td>
                  <td>{ticket.ticketPriority}</td>
                  <td>{ticket.assignedTo}</td>
                  <td>{ticket.status}</td>
                </tr>
              </tbody>
            ))}
        </table>
      </div>
    </HomeLayout>
  );
}
```

**Key Concepts**:

- `usePDF` hook with ref to capture DOM element
- `onClick` on button triggers PDF generation & download
- Table rendering via `.map()` over state array

### 12. Axios Configuration (config/axiosInstance.js)

```javascript
import axios from "axios";

const axiosInstance = axios.create();

// Set base URL from environment variable
axiosInstance.defaults.baseURL = import.meta.env.VITE_BASE_URL;

// Set request timeout from environment variable
axiosInstance.defaults.timeout = import.meta.env.VITE_TIMEOUT;

export default axiosInstance;
```

**Key Concepts**:

- Centralized axios configuration
- Environment-based API URL
- Reused across all API calls via Redux thunks

### 13. Application Entry Point (main.jsx)

```javascript
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import store from "./Redux/store.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
      <Toaster position="top-right" />
    </Provider>
  </BrowserRouter>,
);
```

**Key Concepts**:

- Redux `Provider` wraps entire app with store
- `BrowserRouter` enables routing
- `Toaster` component provides global toast notifications
- `BrowserRouter` must wrap `Provider` (inverse should not work)

---

## Important React Concepts Used

### 1. **Hooks**

#### `useState`

```javascript
// Controlled components
const [loginDetails, setLoginDetails] = useState({
  email: "",
  password: "",
});

// Update state
setLoginDetails({ ...loginDetails, [name]: value });
```

- Manages local component state
- Immutable updates using spread operator

#### `useEffect`

```javascript
useEffect(() => {
  loadTickets();
}, [authState.token]); // Dependency array
```

- Runs side effects (data fetching, subscriptions)
- Dependency array controls when effect runs

#### `useSelector` (Redux)

```javascript
const { role } = useSelector((state) => state.auth);
const ticketsState = useSelector((state) => state.tickets);
```

- Subscribes to Redux store changes
- Component re-renders when selected state changes

#### `useDispatch` (Redux)

```javascript
const dispatch = useDispatch();
const response = await dispatch(login(loginDetails));
```

- Returns dispatch function to trigger Redux actions
- Async thunks return promises

#### `useNavigate` (React Router)

```javascript
const navigator = useNavigate();
navigator("/"); // Navigate programmatically
```

- Navigate without <Link> component
- Used for post-submission redirects

#### `useSearchParams` (React Router)

```javascript
const [searchParams] = useSearchParams();
if (searchParams.get("status")) {
  /* ... */
}
```

- Access URL query parameters
- Enables bookmarkable filtered views

### 2. **Async Thunks (Redux Toolkit)**

```javascript
export const login = createAsyncThunk("/auth/login", async (data) => {
  try {
    const response = axiosInstance.post("auth/signin", data);
    toast.promise(response, {
      /* ... */
    });
    return await response;
  } catch (error) {
    console.log("error Handled by loging", error);
  }
});
```

**States Generated**:

- `login.pending` - While request executing
- `login.fulfilled` - Request succeeded
- `login.rejected` - Request failed

**Handling in Slice**:

```javascript
extraReducers: (builder) => {
  builder
    .addCase(login.fulfilled, (state, action) => {
      // Handle success
    })
    .addCase(login.rejected, (state, action) => {
      // Handle failure
    });
};
```

### 3. **React Router v6 Concepts**

#### Nested Routes

```javascript
<Routes>
  <Route path="/" element={<Home />} />
  <Route element={<AuthRoutes allowListedRoles={["admin"]} />}>
    <Route path="/users" element={<ListAllUsers />} />
  </Route>
</Routes>
```

#### Protected Routes with Outlet

```javascript
function AuthRoutes({ allowListedRoles }) {
  const { role } = useSelector((state) => state.auth);
  return allowListedRoles.find((r) => r == role) ? (
    <Outlet />
  ) : (
    <h1>Access Denied</h1>
  );
}
```

- `Outlet` renders child routes if auth passes
- Parent route acts as middleware/guard

### 4. **Controlled Components**

```javascript
// Form input controlled by state
<input
  value={loginDetails.email}
  onChange={(e) =>
    setLoginDetails({
      ...loginDetails,
      email: e.target.value,
    })
  }
/>
```

- React state is "single source of truth"
- onChange handler updates state
- Component re-renders when state changes

### 5. **Conditional Rendering**

```javascript
// Ternary operator
{
  authState.isLoggedIn ? <LogoutBtn /> : <LoginBtn />;
}

// Logical AND
{
  allUserList && allUserList.map((user) => <UserRow key={user._id} />);
}

// Array.find()
{
  allowListedRoles.find((role) => role == userRole) ? (
    <Outlet />
  ) : (
    <AccessDenied />
  );
}
```

### 6. **Array Methods for Data Transformation**

```javascript
// .map() for rendering lists & transforming data
const pieChartData = {
  labels: Object.keys(ticketsState.ticketDistribution),
  data: Object.values(ticketsState.ticketDistribution),
};

// .filter() for data filtering
state.ticketList = state.downloadedTickets.filter(
  (ticket) => ticket.status == status,
);

// .forEach() for mutation/aggregation
tickets.forEach((ticket) => {
  state.ticketDistribution[ticket.status]++;
});
```

### 7. **Composition Pattern**

```javascript
// Components accept children for flexibility
<Card quantity={count} titleText="Open">
  <BsFillPencilFill /> {/* Icon passed as child */}
</Card>;

// Component implementation
function Card({ children, titleText = "", quantity = "0" }) {
  return (
    <div>
      {children}
      <h3>{titleText}</h3>
    </div>
  );
}
```

### 8. **Key Prop in Lists**

```javascript
{
  ticketState.ticketList.map((ticket) => (
    <tbody key={ticket._id}>
      {" "}
      {/* Unique identifier */}
      <tr>
        <td>{ticket.title}</td>
        {/* ... */}
      </tr>
    </tbody>
  ));
}
```

- Helps React identify which items changed/added/removed
- Always use unique, stable identifiers
- Never use array index as key

### 9. **Destructuring Assignment**

```javascript
// Object destructuring
const {
  register,
  formState: { errors },
  handleSubmit,
} = useForm();
const { role } = useSelector((state) => state.auth);
const { name, value } = e.target;

// Nested destructuring
const [ticketsState] = useTickets();

// Function parameters
function Card({ children, titleText = "", quantity = "0" }) {
  /* ... */
}
```

### 10. **ES6+ Features Used**

```javascript
// Spread operator
{...loginDetails, [name]: value}
{...signupDetails, name: data.name}

// Template literals
navigator(`/dashboard?status=${titleText}`)

// Computed property names
{[name]: value}

// Default parameters
function Card ({ children, titleText = "", quantity= "0" }) { /* ... */ }

// Arrow functions
const onCardClick = () => { /* ... */ }

// Optional chaining
action.payload?.data?.token
```

---

## Interview Questions & Answers

### 1. **Architecture & Design**

**Q: How would you describe this application's architecture?**

A: This is a multi-tier React SPA with:

- **Presentation Layer**: React components (functional with hooks)
- **State Management Layer**: Redux Toolkit for global state
- **API Layer**: Axios instance with environment configuration
- **Routing Layer**: React Router v6 with protected routes
- **Custom Logic Layer**: Custom hooks (useTickets, useChart)

The flow is: User Action → Component Event → Redux Dispatch → Async Thunk → API Call → State Update → Re-render.

---

**Q: Why use Redux Toolkit over Context API or MobX?**

A:

- Redux Toolkit handles complex state: Scalable for large apps
- Async thunks: Built-in async handling (vs Context needing middleware)
- DevTools integration: Excellent debugging capabilities
- Separation of concerns: Actions, reducers, selectors are distinct
- Performance: Selective subscriptions prevent unnecessary re-renders

However, for this small app, Context API might suffice, but Redux is more enterprise-ready.

---

**Q: Explain the data flow from login to dashboard display.**

A:

1. User enters email/password → Click Submit
2. `onSubmit()` dispatches `login(loginDetails)` action
3. Redux Thunk calls `axiosInstance.post('auth/signin', data)`
4. Server returns token + user data
5. `login.fulfilled` reducer updates auth state (token, isLoggedIn, role)
6. State persisted to localStorage
7. Navigation to "/" (Home page)
8. Home component mounts
9. `useTickets()` hook detects auth token change via useEffect
10. Dispatches `getAllTicketsforTheUser()`
11. Thunk calls API with auth header using stored token
12. `getAllTicketsforTheUser.fulfilled` updates ticket state
13. `useChart()` processes ticket data into chart format
14. Component re-renders with charts and stats

---

**Q: Why persist auth state to localStorage?**

A:

- **Resilience**: User stays logged in after page refresh
- **Seamless UX**: No re-login after browser restart
- **Token accessibility**: Token available to all API calls without Redux dependency initially

Trade-off: Security - localStorage is XSS vulnerable. Better approach: Use secure HTTP-only cookies for tokens.

---

### 2. **React Hooks & State Management**

**Q: What's the difference between useState and useReducer, and when use each?**

A:

- `useState`: Simple, single state values. Used in forms (loginDetails), UI toggles.
  ```javascript
  const [count, setCount] = useState(0);
  ```
- `useReducer`: Complex state with multiple interdependent values. Perfect for auth slices.
  ```javascript
  const [state, dispatch] = useReducer(reducer, initialState);
  ```

In this app: Redux Toolkit replaces useReducer (better for global state).

---

**Q: How does useEffect dependency array work?**

A:

- Empty `[]`: Runs once on mount only

```javascript
useEffect(() => {
  loadTickets();
}, []);
```

- With dependencies `[authState.token]`: Runs whenever dependency changes

```javascript
useEffect(() => {
  loadTickets();
}, [authState.token]);
```

- No array: Runs after every render (dangerous - infinite loops possible)

```javascript
useEffect(() => {
  loadTickets();
}); // ⚠️ Runs every render!
```

In `useTickets`, we depend on `authState.token` so tickets reload when user logs in.

---

**Q: What's the difference between useSelector and mapStateToProps?**

A:

- `useSelector`: Modern, functional, returns selected state
  ```javascript
  const { role } = useSelector((state) => state.auth);
  ```
- `mapStateToProps`: Older Redux (class components), creates props from state
  ```javascript
  const mapStateToProps = (state) => ({
    role: state.auth.role,
  });
  ```

`useSelector` is preferred in modern React. Simpler, less boilerplate.

---

**Q: Why disable serializableCheck in Redux middleware?**

A:

```javascript
middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
  });
```

Because we store:

- Dates (Date objects)
- Functions (API response promises)
- Complex objects (nested data)

These aren't serializable to JSON. Disabling this check allows flexibility but reduces Redux's error catching.

Better approach: Store serializable data, convert Date to ISO strings in reducers.

---

### 3. **React Router**

**Q: How does role-based routing work in this app?**

A:

```javascript
<Route element={<AuthRoutes allowListedRoles={["admin"]} />}>
  <Route path="/users" element={<ListAllUsers />} />
</Route>
```

`AuthRoutes` component:

- Gets user role from Redux
- Checks if role is in `allowListedRoles`
- If yes: Renders `<Outlet />` (displays child route)
- If no: Renders error message

This protects `/users` route to admins only.

---

**Q: What's the difference between `<Outlet />` and `{children}`?**

A:

- `<Outlet />`: React Router specific, renders nested routes

  ```javascript
  <Route element={<Layout />}>
    <Route path="/users" element={<Users />} />
  </Route>
  // Layout component must have <Outlet /> to display <Users />
  ```

- `{children}`: Regular React prop, manually passed component content
  ```javascript
  <Layout>
    <Users /> {/* Passed as children prop */}
  </Layout>
  ```

`Outlet` is Router-aware; `children` is generic composition.

---

**Q: How do URL parameters work vs query strings?**

A:

- **URL Parameters** (part of route): `/dashboard/:id`

  ```javascript
  // Accessed with useParams()
  const { id } = useParams();
  ```

- **Query Strings** (after `?`): `/dashboard?status=open`
  ```javascript
  // Accessed with useSearchParams()
  const [searchParams] = useSearchParams();
  searchParams.get("status"); // "open"
  ```

In this app: Status filtering uses query strings `?status=open`.

---

### 4. **Async Redux & API Integration**

**Q: How do async thunks work?**

A:

```javascript
export const login = createAsyncThunk("/auth/login", async (data) => {
  const response = await axiosInstance.post("auth/signin", data);
  return await response;
});
```

Lifecycle:

1. **Dispatch**: `dispatch(login({email, password}))`
2. **Pending**: `login.pending` action fired automatically
3. **Async**: Thunk function executes, API call made
4. **Fulfilled**: `login.fulfilled` if response received
5. **Rejected**: `login.rejected` if error thrown

Handle in reducer via `extraReducers`:

```javascript
builder.addCase(login.fulfilled, (state, action) => {
  state.token = action.payload.data.token;
});
```

---

**Q: Why convert response to action.payload?**

A:
The thunk function's `return` value becomes `action.payload` in the reducer.

```javascript
export const login = createAsyncThunk("...", async (data) => {
  return await axiosInstance.post("auth/signin", data);
  //     ↓ This becomes action.payload in reducer
});

extraReducers: (builder) => {
  builder.addCase(login.fulfilled, (state, action) => {
    // action.payload = response from API
    state.token = action.payload.data.token;
  });
};
```

This allows structured data passing from async operation to reducer.

---

**Q: What's the purpose of toast.promise?**

A:

```javascript
const response = axiosInstance.post("auth/signin", data);
toast.promise(response, {
  loading: "Logining form",
  success: "Successfull loged in",
  error: "Something went wrong",
});
```

Shows toast notifications:

- While promise pending: Shows "Logining form"
- On success: Shows "Successful logged in"
- On error: Shows "Something went wrong"

Improves UX by providing immediate feedback.

---

**Q: Should token be stored in localStorage?**

A:
**Not ideal. Trade-offs:**

- ✅ Accessible across tabs/windows
- ✅ Persists across browser restart
- ❌ Vulnerable to XSS (JavaScript can access)
- ❌ Vulnerable to CSRF

Better approaches:

1. **HTTP-only cookies**: Server-side secure, JavaScript cant access
2. **Session storage**: Clears on tab close (more secure)
3. **Memory + refresh token**: In-memory token + server refresh

Current approach is convenient but has security risks. For production, use HTTP-only cookies.

---

### 5. **Forms & Validation**

**Q: What's react-hook-form and why not just useState?**

A:

```javascript
// useState approach (lots of boilerplate)
const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [errors, setErrors] = useState({})

// react-hook-form approach (cleaner)
const { register, formState: { errors }, handleSubmit } = useForm()
<input {...register("name", { required: true, minLength: 4 })} />
```

Benefits of react-hook-form:

- Less re-renders (form changes don't re-render whole component)
- Built-in validation rules
- Error handling built-in
- Simpler code for complex forms

---

**Q: How does register() work?**

A:

```javascript
<input
  {...register("email", {
    required: true,
    minLength: 5,
  })}
/>
```

`register` returns object:

```javascript
{
    name: "email",
    onChange: handleInputChange,
    onBlur: handleBlur,
    ref: connectRef,
    // ...
}
```

Spread with `...` applies these handlers to input, enabling:

- Change tracking
- Validation rules
- Error collection

---

**Q: How are validation errors accessed?**

A:

```javascript
const {
  formState: { errors },
} = useForm();

{
  errors.name && errors.name.type == "minLength" && (
    <p>Name requires min 4 characters</p>
  );
}
```

`errors` object contains error details:

- `errors.fieldName exist` if validation failed
- `errors.fieldName.type` = rule that failed ('required', 'minLength')
- Show/hide errors conditionally

---

### 6. **Performance & Optimization**

**Q: When would this component re-render?**

A:

```javascript
function Home () {
    const [ticketsState] = useTickets();     // Subscribes to Redux
    const [pieChartData, ...] = useChart()   // Subscribes to useTickets
    // ...
}
```

Re-renders when:

1. `ticketsState` changes in Redux
2. `lineChartData` changes
3. Any parent re-renders

---

**Q: How to prevent unnecessary re-renders?**

A:

1. **Memoization**: `React.memo()` prevents props-based re-renders

   ```javascript
   export default React.memo(Card);
   ```

2. **useMemo**: Memoize computed values

   ```javascript
   const pieChartData = useMemo(() => {
     return {
       /* expensive computation */
     };
   }, [ticketsState.ticketDistribution]);
   ```

3. **useCallback**: Memoize functions

   ```javascript
   const onCardClick = useCallback(() => {
     navigator(`/dashboard?status=${titleText}`);
   }, [titleText, navigator]);
   ```

4. **Selective Redux subscription**: Only select needed state
   ```javascript
   const count = useSelector((state) => state.tickets.ticketDistribution.open);
   // Not: useSelector((state) => state.tickets) // Whole object
   ```

---

**Q: Is useChart properly optimized?**

A:

```javascript
useEffect(() => {
  processOpenTickets();
}, [ticketsState.ticketList]); // Recalculates when tickets change
```

Potential optimization:

```javascript
const chartData = useMemo(() => {
  // Expensive calculation
  return {
    /* processed data */
  };
}, [ticketsState.ticketList]);
```

But for this small dataset, premature optimization isn't necessary.

---

### 7. **Code Quality & Best Practices**

**Q: What issues do you see in this code?**

A:

1. **localStorage not cleared on logout**

   ```javascript
   // AuthSlice logout reducer missing:
   localStorage.clear();
   ```

2. **Token in localStorage (security)**
   - Should use HTTP-only cookies

3. **Magic strings**

   ```javascript
   // Bad:
   if (status == "in progress") status = "inProgress";
   // Good:
   const STATUS_MAPPING = { "in progress": "inProgress" };
   ```

4. **No error handling in async thunks**
   - Catch blocks don't reject promise
   - Component has no error state

5. **Debugging flag in useChart**

   ```javascript
   // console.log("ticket state is", ticketsState)
   // Should remove for production
   ```

6. **Password in plain text not hashed**
   - Password fields should be `type="password"`

---

**Q: How would you improve error handling?**

A:

```javascript
export const login = createAsyncThunk(
  "/auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("auth/signin", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

extraReducers: (builder) => {
  builder.addCase(login.rejected, (state, action) => {
    state.error = action.payload;
    toast.error(action.payload);
  });
};
```

---

### 8. **Testing**

**Q: How would you test this component?**

A:

```javascript
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import store from "./Redux/store";
import Login from "./pages/auth/Login";

test("login form submission dispatches login action", async () => {
  render(
    <Provider store={store}>
      <Login />
    </Provider>,
  );

  await userEvent.type(screen.getByPlaceholderText("Email.."), "test@test.com");
  await userEvent.type(
    screen.getByPlaceholderText("Password.."),
    "password123",
  );
  await userEvent.click(screen.getByText("Submit"));

  await waitFor(() => {
    expect(store.getState().auth.isLoggedIn).toBe(true);
  });
});
```

---

## Performance Considerations

### 1. **Bundle Size Optimization**

- Currently using full Bootstrap (123KB) - could use CSS modules
- Chart.js + react-chartjs-2 adds 180KB - large for small feature
- Recommendation: Tree-shake unused dependencies

### 2. **Re-render Optimization**

- `HomeLayout` wraps many components - could cause cascading re-renders
- Card component not memoized - re-renders with parent
- `useChart` recalculates on every ticket change (consider useMemo)

### 3. **API Performance**

- No pagination for user list - loads all users
- Dashboard table renders all tickets - needs virtual scrolling for 1000+ items
- No caching mechanism - refetches tickets on component mount

### 4. **Memory Leaks**

- Async thunks not cancelled on component unmount
- Event listeners in offcanvas not cleaned up

---

## Improvements & Future Scope

### 1. **Short-term Improvements**

**Security**:

- [ ] Move token from localStorage to HTTP-only cookies
- [ ] Add CSRF protection
- [ ] Validate all inputs on backend
- [ ] Implement password reset flow

**UX/Code Quality**:

- [ ] Add loading skeletons while fetching
- [ ] Error boundaries for graceful error handling
- [ ] Form validation feedback (green/red borders)
- [ ] Disable submit button while loading
- [ ] Add logout functionality (currently broken)
- [ ] Clear localStorage in logout reducer

**Performance**:

- [ ] Memoize Card component with React.memo
- [ ] Add useMemo to useChart to prevent recalculations
- [ ] Lazy load routes with React.lazy()
- [ ] Implement pagination for ListAllUsers

### 2. **Medium-term Features**

- [ ] Advanced search/filtering (by date, priority, assignee)
- [ ] Real-time notifications (WebSocket/Server-Sent Events)
- [ ] Ticket creation/editing form
- [ ] User profile page with preferences
- [ ] Email notifications
- [ ] Export to Excel (currently only PDF)
- [ ] Dark mode support
- [ ] Accessibility (a11y) improvements

### 3. **Long-term Architecture**

```
Refactor to Modular Structure:
- Feature-based folder structure (auth/, tickets/, users/)
- Separate presentational & container components
- Custom hooks for business logic
- Service layer for API calls
- Constants file for magic strings
- Tests for all components (Jest + React Testing Library)
- Storybook for component documentation
- Pre-commit hooks (Husky + Prettier + ESLint)
```

### 4. **Backend Integration**

- [ ] API documentation (OpenAPI/Swagger)
- [ ] Authentication refresh token rotation
- [ ] Real-time ticket updates (WebSocket)
- [ ] Database indexing for queries
- [ ] API rate limiting
- [ ] Audit logging

### 5. **Deployment & DevOps**

- [ ] CI/CD pipeline (GitHub Actions / GitLab CI)
- [ ] Automated testing in pipeline
- [ ] Environment-based builds (dev/staging/prod)
- [ ] Docker containerization
- [ ] S3/CDN for static assets
- [ ] Sentry for error tracking

---

## How to Further Prepare for Interviews

### 1. **Practice Questions**

Review these core React concepts:

- useState vs useReducer vs Context vs Redux
- Hooks dependency array pitfalls
- Controlled vs uncontrolled components
- Key prop in lists
- Error boundaries and error handling
- React.memo, useMemo, useCallback tradeoffs

### 2. **Deep Dive Topics**

- Reconciliation algorithm (Virtual DOM diffing)
- Event delegation and event bubbling
- Closure patterns in React
- Higher-Order Components vs Render Props vs Hooks
- React Suspense and code splitting

### 3. **System Design Questions**

- How would you scale this to 1M users?
- How would you implement real-time updates?
- How to optimize bundle size?
- State management for large apps

### 4. **Practical Coding**

- Build a similar app from scratch
- Implement custom hooks
- Optimize existing code
- Write thorough tests
- Refactor for readability

### 5. **Soft Skills**

- Articulate design decisions
- Explain trade-offs clearly
- Ask clarifying questions
- Discuss best practices
- Show ownership mentality

---

## Conclusion

This CRM application demonstrates:
✅ Redux Toolkit for scalable state management  
✅ Modern React hooks for functional components  
✅ React Router for complex routing with protection  
✅ Async operations with async thunks  
✅ Form validation with React Hook Form  
✅ Data visualization with Chart.js  
✅ API integration with Axios  
✅ Component composition and reusability

**Key strengths**: Clean architecture, separation of concerns, reusable hooks  
**Areas for improvement**: Error handling, performance optimization, testing, security

This codebase is a great learning resource for understanding real-world React application patterns!

---

_Last Updated: March 2026_
_For Backend API Details: See API Documentation (if available)_
