# element-data-sharing

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

# database setup

Create python env
```sh
python -m venv env
```

install
```sh
pip install -r requirements.txt
```
go to database folder
```sh
cd database
```
create db file
```sh
python create.py
```

move example.db to public file, then database prepared successfully.

# To run the website

We need to run it on HTML file instead of 
```sh
npm run dev
```
To do that, we will do:

```sh
npm run build
```
go to extension in visual studio code, download Live Server by Ritwick Dey
(I will try to look at more general ways to do it)
Then browse dist/, right click the index.html and open in live server.

