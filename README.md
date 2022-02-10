# **Getting Started**

## **Development Quick Start**

### **Starting the backend server:**
  1. Open a new terminal and navigate to the `web-server` folder.
      ```sh
      cd web-server
      ```

  2. Start the server from `App.java`. If using vscode (and you have the Java development extension), you can use the play button to launch the app from App.java.

### **Starting the Excel add-in server:**
  1. Open a new terminal and navigate to the `add-in` folder.
      ```sh
      cd add-in
      ```
  2. Run the following command to start the add in.
      ```sh
      npm run dev-server
      ```
  3. A new Excel workbook should open automatically and you should be able to access the task plane for the add-in.

  4. Please refer to the [official documentation](https://docs.microsoft.com/en-us/office/dev/add-ins/quickstarts/excel-quickstart-react) if you receive errors.

## **Running the Project with Docker**

To run the project with docker, use the following command:
  ```sh
  docker-compose up -d
  ```

Currently, only the backend API is started with docker.
