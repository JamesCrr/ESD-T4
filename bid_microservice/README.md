# Prerequisites
---
Before proceeding with the installation, ensure that you have Chocolatey installed on your Windows machine. If you don't have Chocolatey installed, follow the instructions on the [Chocolatey website](https://chocolatey.org/install) to install it.

## Installation Steps

### Step 1: Open a Command Prompt with Administrator Privileges
Right-click on the Command Prompt and select "Run as Administrator" to open a command prompt with administrator privileges.

### Step 2: Install Make using Chocolatey
Run the following command to install Make using Chocolatey:

```bash
choco install make
```

# Project Setup Instructions
---
Follow these steps to set up and run the project (make sure when running make, the makefile is in that directory):

1. **Setup flask server container:**
   - Run the following command to bring up the database:
     ```bash
     make build
     ```

2. **Access API documentation locally:**
    - Access this route: 
      ``` bash
      http://127.0.0.1:3012/apidocs/
      ```
  

Now, your project should be set up and running. Access the application at the specified URL or port.
