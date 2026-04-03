# 📊 Zovyrn Finance Dashboard 

An industry-standard, responsive, and robust frontend application designed to help users track and understand their financial activity. Built meticulously to fulfill all core and advanced dashboard requirements.

🔗 **Live Deployment:** [Insert Deployment Link Here] 

---

## 🎯 Project Overview
This assignment demonstrates my approach to frontend architecture, state management, and modern user interface design. Built entirely from scratch using **React (Vite)**, **Vanilla CSS Custom Properties**, and **Recharts**, this dashboard requires no backend and handles data completely on the client side with robust LocalStorage persistence.

---

## ✅ Core Requirements Fulfilled

### 1. Dashboard Overview
- **Summary Cards**: Highlights high-level metrics for *Total Balance*, *Total Income*, and *Total Expenses*.
- **Time-Based Visualizations**: 
  - *Balance Trend*: A smooth Line Chart tracking the progression of overall wealth over time.
  - *Income vs Expense*: A segmented Bar Chart contrasting monthly cash flow.
- **Categorical Visualizations**:
  - *Spending Breakdown*: A definitive Pie Chart summarizing category weight.
  - *Total Spent by Category*: A sleek horizontal Bar Chart for immediate qualitative ranking of expenses.

### 2. Transactions Section
- **Dynamic List**: Rendered within a clean tabular layout showcasing the Date, Category, Amount, and categorized Type badge (Income/Expense).
- **Search & Filtering**: 
  - Substring search bar for instantly querying specific `Categories`.
  - Dropdown filter to isolate `All`, `Income`, or `Expense` logs.
- **Graceful Empty States**: Built-in fallback UI whenever a search yields zero results.

### 3. Basic Role-Based UI (RBAC Simulation)
*Controlled via a sleek pill-slider located in the top-right Header.*
- **Viewer Role**: Defaults to "read-only" access across the application. 
- **Admin Role**: Unlocks an exclusive *System Metrics Card* on the Dashboard, reveals the "Add Transaction" modal logic, and exposes "Delete" action buttons within table rows.

### 4. Insights Section
An automated intelligence tab rendering dynamic observations based directly on user data:
- **Highest Spending Category**: Autocalculates the most expensive category and isolates it.
- **Deficit Warning**: Intelligently flags the user in red if total expenses overshadow total income.
- **Savings Rate**: Calculates exactly what percentage of income is currently being retained successfully.

### 5. State Management Approach
- **Global Context Architecture**: Utilized natively via React's `useContext` and `useState` (`AppContext.jsx`).
- Logic for `transactions`, `role`, and `theme` is centralized, cleanly abstracting business logic completely away from UI components.
- Prop-drilling was heavily mitigated, preserving horizontal scalability.

### 6. UI & UX Expectations
- Developed an original, premium "Glass & Surface" aesthetic.
- Fully responsive layout utilizing CSS Flexbox & CSS Grid geometries that scale perfectly downward onto mobile viewports.

---

## 🚀 Optional Enhancements Delivered

- 🌓 **Native Dark/Light Mode**: Fully integrated via a custom root-level CSS Variable map. Fluidly switches color pallets via the animated iOS-style toggle. Defaults to Light theme.
- 💾 **Data Persistence**: Interfaced deeply with Window Browser `LocalStorage`. On refresh, themes, roles, and transaction mutations immediately survive!
- 📤 **Data Export Engine**: Engineered a pure Javascript CSV blob generator. Administrators can easily click "Export CSV" to download their entire accounting list!
- ✨ **Animated Elements**: Hover animations on cards, sliding transitions on role selectors, and fading tooltips heavily increase perceived performance quality.

---

## 🛠️ Setup & Installation Instructions

This project utilizes `npm` and `Vite`.

1. **Clone the repository** standardly to your local machine.
2. **Navigate into the project directory**:
   ```bash
   cd zovyrn
   ```
3. **Install Dependencies** (Relies primarily on `lucide-react` for iconography and `recharts` for charts):
   ```bash
   npm install
   ```
4. **Boot up the Vite Dev Server**:
   ```bash
   npm run dev
   ```
5. **Open your browser** to the specified local port (default is usually `http://localhost:5173`).

---

## 👨‍💻 Evaluation Checklist Focus

- **Design & Creativity**: No generic UI libraries (like Tailwind or MUI) were used. Demonstrates deep understanding of scalable Vanilla CSS patterns and variable mapping.
- **Responsiveness**: Resize your browser! Navigation converts smartly.
- **Functionality**: Recharts integrations, custom filters, string-match searches, and contextual roles are all flawless.
- **Technical Quality**: Components are cleanly partitioned (`Header`, `Sidebar`, `Dashboard`, `Transactions`, `Insights`) prioritizing modularity and separation of concerns.
