# Transaction Dashboard

This project is a full-stack web application designed to provide a comprehensive dashboard for managing and visualizing transaction data. It consists of a Node.js/Express backend and a React frontend, allowing users to search, filter, and analyze transaction information.

## Features

-   **Transaction Listing:** Displays a paginated list of transactions with details like ID, title, description, price, category, sold status, and image.
-   **Search Functionality:** Enables users to search transactions by title, description, category, or price.
-   **Month Filtering:** Allows users to filter transactions by month.
-   **Statistics:** Provides key statistics such as total sales amount, total sold items, and total not sold items for the selected month.
-   **Bar Chart:** Visualizes the price range distribution of transactions for the selected month.
-   **Pie Chart:** Displays the category distribution of transactions for the selected month.
-   **Responsive Design:** Ensures the application is usable on various screen sizes.
-   **Sidebar:** Displays key information such as selected month, sales, and page information.

## Technologies Used

-   **Frontend:**
    -   React
    -   Chart.js (for charts)
    -   Axios (for API requests)
    -   CSS
-   **Backend:**
    -   Node.js
    -   Express.js
    -   Axios (for fetching external data)

## Getting Started

### Prerequisites

-   Node.js and npm (or yarn) installed.
-   Git installed.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/pujith20/internship.git
    ```

2.  **Install backend dependencies:**

    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**

    ```bash
    cd ../frontend
    npm install
    ```

4.  **Set up environment variables:**

    -   Create `.env` files in both the `backend` and `frontend` directories if you have any environment variables.

5.  **Run the backend:**

    ```bash
    cd ../backend
    node index.js
    ```

    The backend should now be running on `http://localhost:5000`.

6.  **Run the frontend:**

    ```bash
    cd ../frontend
    npm start
    ```

    The frontend should now be running on `http://localhost:3000`.

## Deployment

### Backend

1.  Choose a hosting platform (e.g., Heroku, Render, AWS, Google Cloud).
2.  Follow the platform's deployment instructions.
3.  Set up environment variables on the hosting platform.

### Frontend

1.  Build the frontend:

    ```bash
    npm run build
    ```

2.  Choose a hosting platform (e.g., Netlify, Vercel, GitHub Pages, AWS S3).
3.  Follow the platform's deployment instructions.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.
