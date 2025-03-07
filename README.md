# Project Setup

This project is built using **Vue 3** and **Vite**. Follow the steps below to set up your development environment and get started.

---

## Database Setup
Before setting up the database, you must create an `.env` file inside the `E3G/` directory with the following content:

```sh
MODEL=
OPENAI_API_BASE=
OPENAI_API_KEY=
OPENAI_ORGANIZATION=
API_VERSION=
EMBEDDING_MODEL=

To set up the database, follow these steps:

**Navigate to the `E3G/` directory**:

```sh
cd E3G
```

**Create and activate a Python virtual environment**:

```sh
python -m venv env
source env/bin/activate  # macOS/Linux
env\Scripts\activate     # Windows (Command Prompt)
```

**Install dependencies**:

```sh
pip install -r requirements.txt
```

**Give execute permission to the database script**:

```sh
chmod +x run.sh
```

5️⃣ **Run the database script**:

```sh
./run.sh
```

6️⃣ **Move the generated `example.db` file to `public/`**:

```sh
mv example.db ../public/
```

Now the database is successfully set up. We can start to build the web application.

---

## 1️⃣ Install Dependencies
Before running the project, install the required dependencies using npm:

```sh
npm install
```

This will download all necessary packages specified in `package.json`.

## 2️⃣ Start the Development Server
To start the development server with **hot module replacement (HMR)**, use the following command:

```sh
npm run dev
```

By default, this will launch the app on `http://localhost:5173/`. If you want to specify a different port, run:

```sh
npm run dev -- --port=3000
```

## 3️⃣ Build for Production
To create an optimized production build, run:

```sh
npm run build
```

This will generate the production-ready files inside the `dist/` directory. These files can be deployed to a static web server.

## To deploy the built files to the **UMich server**, use the following `scp` command:

```sh
scp -r dist/* uruniqname@umpire.dsc.umich.edu:/afs/umich.edu/group/e/elementdata/Public/html
```

Replace `uruniqname` with your actual UMich username.

## 5️⃣ Lint the Code (Optional)
To check for code formatting and potential errors, use ESLint:

```sh
npm run lint
```

Fix auto-fixable issues by running:

```sh
npm run lint --fix
```

This ensures code consistency and best practices are followed.

---

Now you're all set!


## Adding a New Dataset

Currently, no new datasets need to be added. However, if you need to add a new dataset, follow these steps:

**Organize files into a folder**:
   - Group files based on their names.
   - Example: `MLM_BONE_Accelerometer.csv` and `MLM_BONE_Accelerometer.pdf` should be placed inside a folder named `MLM_BONE_Accelerometer/`.

**Run the folder processing script**:
   - Navigate to the `E3G/` directory and execute:
   
   ```sh
   ./process_folders.sh
   ```

**Check the processed files**:
   - After execution, go to the `processed/` directory.
   - You may need to manually adjust `age.py`, `classify.py`, and `classify_visit.py` before running them.

**Run the necessary scripts**:
   - Execute the adjusted scripts one by one.

**Note about embeddings**:
   - If new files are added, `run.sh` may take longer than usual because it will generate new embeddings.
