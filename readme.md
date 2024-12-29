# Skin Care Analysis

This project provides an analysis of skin care [mention the specific focus of your analysis here - e.g., ingredients, routines, product effectiveness].

## Frontend Setup

Follow these steps to set up the frontend development environment:

1.  **Navigate to the Frontend Directory:**
    ```bash
    cd ./Skincare
    ```

2.  **Ensure Correct Node.js and npm Version:**
    This project requires Node.js version `18.17.0` for the frontend.
    You can use a Node version manager like NVM or ASDF.

3.  **Install Dependencies:**
    ```bash
    npm i
    ```

4.  **Run in Development Mode:**
    ```bash
    npm run dev
    ```
    This will start the development server, and you can typically access the application in your browser at `http://localhost:3000` or `http://localhost:5173` (the port might vary).

## Backend Setup

Follow these steps to set up the backend environment:

1.  **Navigate to the Backend Directory:**
    ```bash
    cd backend
    ```

2.  **Ensure Correct Node.js Version:**
    The backend requires Node.js version `18.8.0`. Use a version manager like NVM or ASDF to switch versions if necessary.

3.  **Install Dependencies:**
    ```bash
    npm i
    ```

4.  **Build the Backend:**
    ```bash
    npm run build
    ```

5.  **Start the Server:**
    ```bash
    npm start
    ```
    This will start the backend server.

### Redis Setup

This project uses Redis. You'll need to install and run Redis locally:

*   **Installation:**
    *   **macOS:** `brew install redis`
    *   **Ubuntu/Debian:** `sudo apt-get install redis-server`
    *   **Windows:** You can use the Windows Subsystem for Linux (WSL) and follow the Linux instructions, or download a Windows build of Redis from the official Redis website or a trusted source.

*   **Start Redis Server:**
    *   **macOS:** `brew services start redis`
    *   **Linux:** `sudo service redis-server start` (or `sudo systemctl start redis`)
    *   **Windows (WSL):**  Follow the Linux instructions within your WSL environment.

## YOLO Skin Detection Setup

The project utilizes a YOLO model for skin detection. Here's how to set it up:

1.  **Navigate to the YOLO Directory:**
    Open a new terminal and navigate to the directory:
    ```bash
    cd yolo-skin-detection
    ```

2.  **Install Python Dependencies:**
    ```bash
    pip install -r requirements.txt
    pip install -r requirements_withtorch.txt
    ```

3.  **Download the YOLO Model:**
    Download the required `best.pt` model file by running:
    ```bash
    python getmodel.py
    ```

4.  **Start the Detection Server:**
    ```bash
    python local_detection_server.py
    ```
    This will start the local server for skin detection using the YOLO model.

## Project Structure
skin-care-analysis/
├── Skincare/        # Frontend directory (e.g., React, Vue.js)
│   ├── public/
│   ├── src/
│   ├── ...
├── backend/         # Backend directory (Node.js)
├── yolo-skin-detection/ # YOLO model and detection server
│   ├── requirements.txt
│   ├── getmodel.py
│   ├── local_detection_server.py
│   ├── ...
├── ...
├── README.md