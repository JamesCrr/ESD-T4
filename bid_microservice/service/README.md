# Project Setup Instructions
---

**Run Development Environment:**
If dependencies have been installed and configured, start the development environment:
```bash
make run-dev
```

Follow these steps to set up and run the project:

1. **Setup MongoDB Database :**
   - Run the following command to bring up the database:
     ```bash
     make db-up
     ```

2. **Install Dependencies:**
   - Install project dependencies by executing:
     ```bash
     make install
     ```

3. **Seed Database:**
   - Seed the database with initial data using the following command:
     ```bash
     make db-seed
     ```

4. **Run the Server:**
   - Start the server by running:
     ```bash
     make run
     ```

Now, your project should be set up and running. Access the application at the specified URL or port.
