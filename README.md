
```
project_3d-main
├─ .env
├─ app
│  ├─ database.py
│  ├─ dependencies.py
│  ├─ main.py
│  ├─ models
│  │  ├─ job.py
│  │  ├─ material.py
│  │  ├─ printer.py
│  │  ├─ user.py
│  │  ├─ __init__.py
│  │  └─ __pycache__
│  │     ├─ job.cpython-312.pyc
│  │     ├─ job.cpython-313.pyc
│  │     ├─ material.cpython-312.pyc
│  │     ├─ printer.cpython-312.pyc
│  │     ├─ printer.cpython-313.pyc
│  │     ├─ user.cpython-312.pyc
│  │     ├─ user.cpython-313.pyc
│  │     ├─ __init__.cpython-312.pyc
│  │     └─ __init__.cpython-313.pyc
│  ├─ routes
│  │  ├─ auth.py
│  │  ├─ job.py
│  │  ├─ material.py
│  │  ├─ printer.py
│  │  ├─ __init__.py
│  │  └─ __pycache__
│  │     ├─ auth.cpython-312.pyc
│  │     ├─ auth.cpython-313.pyc
│  │     ├─ job.cpython-312.pyc
│  │     ├─ job.cpython-313.pyc
│  │     ├─ material.cpython-312.pyc
│  │     ├─ printer.cpython-312.pyc
│  │     ├─ printer.cpython-313.pyc
│  │     ├─ __init__.cpython-312.pyc
│  │     └─ __init__.cpython-313.pyc
│  ├─ schemas
│  │  ├─ job.py
│  │  ├─ material.py
│  │  ├─ printer.py
│  │  ├─ user.py
│  │  ├─ __init__.py
│  │  └─ __pycache__
│  │     ├─ job.cpython-312.pyc
│  │     ├─ job.cpython-313.pyc
│  │     ├─ material.cpython-312.pyc
│  │     ├─ printer.cpython-312.pyc
│  │     ├─ printer.cpython-313.pyc
│  │     ├─ user.cpython-312.pyc
│  │     ├─ user.cpython-313.pyc
│  │     ├─ __init__.cpython-312.pyc
│  │     └─ __init__.cpython-313.pyc
│  ├─ static
│  │  ├─ index.html
│  │  ├─ script.js
│  │  └─ styles.css
│  ├─ utils
│  │  ├─ auth.py
│  │  ├─ sort_jobs.py
│  │  ├─ __init__.py
│  │  └─ __pycache__
│  │     ├─ auth.cpython-312.pyc
│  │     ├─ sort_jobs.cpython-312.pyc
│  │     └─ __init__.cpython-312.pyc
│  ├─ __init__.py
│  └─ __pycache__
│     ├─ database.cpython-312.pyc
│     ├─ database.cpython-313.pyc
│     ├─ dependencies.cpython-312.pyc
│     ├─ dependencies.cpython-313.pyc
│     ├─ main.cpython-312.pyc
│     ├─ main.cpython-313.pyc
│     ├─ __init__.cpython-312.pyc
│     └─ __init__.cpython-313.pyc
├─ docker-compose.yml
├─ Dockerfile
├─ Dockerfile-frontend
├─ my
│  ├─ .next
│  │  ├─ app-build-manifest.json
│  │  ├─ build-manifest.json
│  │  ├─ cache
│  │  │  ├─ .rscinfo
│  │  │  ├─ swc
│  │  │  │  └─ plugins
│  │  │  │     └─ v7_windows_x86_64_17.0.0
│  │  │  └─ webpack
│  │  │     ├─ client-development
│  │  │     │  ├─ 0.pack.gz
│  │  │     │  ├─ 1.pack.gz
│  │  │     │  ├─ 10.pack.gz
│  │  │     │  ├─ 11.pack.gz
│  │  │     │  ├─ 12.pack.gz
│  │  │     │  ├─ 13.pack.gz
│  │  │     │  ├─ 2.pack.gz
│  │  │     │  ├─ 3.pack.gz
│  │  │     │  ├─ 4.pack.gz
│  │  │     │  ├─ 5.pack.gz
│  │  │     │  ├─ 6.pack.gz
│  │  │     │  ├─ 7.pack.gz
│  │  │     │  ├─ 8.pack.gz
│  │  │     │  ├─ 9.pack.gz
│  │  │     │  └─ index.pack.gz.old
│  │  │     ├─ client-development-fallback
│  │  │     │  ├─ 0.pack.gz
│  │  │     │  ├─ 1.pack.gz
│  │  │     │  ├─ 2.pack.gz
│  │  │     │  ├─ index.pack.gz
│  │  │     │  └─ index.pack.gz.old
│  │  │     └─ server-development
│  │  │        ├─ 0.pack.gz
│  │  │        ├─ 1.pack.gz
│  │  │        ├─ 10.pack.gz
│  │  │        ├─ 11.pack.gz
│  │  │        ├─ 12.pack.gz
│  │  │        ├─ 13.pack.gz
│  │  │        ├─ 2.pack.gz
│  │  │        ├─ 3.pack.gz
│  │  │        ├─ 4.pack.gz
│  │  │        ├─ 5.pack.gz
│  │  │        ├─ 6.pack.gz
│  │  │        ├─ 7.pack.gz
│  │  │        ├─ 8.pack.gz
│  │  │        ├─ 9.pack.gz
│  │  │        └─ index.pack.gz.old
│  │  ├─ fallback-build-manifest.json
│  │  ├─ package.json
│  │  ├─ prerender-manifest.json
│  │  ├─ react-loadable-manifest.json
│  │  ├─ routes-manifest.json
│  │  ├─ server
│  │  │  ├─ app
│  │  │  │  ├─ page.js
│  │  │  │  ├─ page_client-reference-manifest.js
│  │  │  │  └─ _not-found
│  │  │  │     ├─ page.js
│  │  │  │     └─ page_client-reference-manifest.js
│  │  │  ├─ app-paths-manifest.json
│  │  │  ├─ interception-route-rewrite-manifest.js
│  │  │  ├─ middleware-build-manifest.js
│  │  │  ├─ middleware-manifest.json
│  │  │  ├─ middleware-react-loadable-manifest.js
│  │  │  ├─ next-font-manifest.js
│  │  │  ├─ next-font-manifest.json
│  │  │  ├─ pages
│  │  │  │  ├─ _app.js
│  │  │  │  ├─ _document.js
│  │  │  │  └─ _error.js
│  │  │  ├─ pages-manifest.json
│  │  │  ├─ server-reference-manifest.js
│  │  │  ├─ server-reference-manifest.json
│  │  │  ├─ vendor-chunks
│  │  │  │  ├─ @swc.js
│  │  │  │  ├─ next.js
│  │  │  │  └─ zustand.js
│  │  │  ├─ webpack-runtime.js
│  │  │  └─ _error.js
│  │  ├─ static
│  │  │  ├─ chunks
│  │  │  │  ├─ app
│  │  │  │  │  ├─ layout.js
│  │  │  │  │  ├─ page.js
│  │  │  │  │  └─ _not-found
│  │  │  │  │     └─ page.js
│  │  │  │  ├─ app-pages-internals.js
│  │  │  │  ├─ fallback
│  │  │  │  │  ├─ amp.js
│  │  │  │  │  ├─ main-app.js
│  │  │  │  │  ├─ main.js
│  │  │  │  │  ├─ pages
│  │  │  │  │  │  ├─ _app.js
│  │  │  │  │  │  └─ _error.js
│  │  │  │  │  ├─ react-refresh.js
│  │  │  │  │  └─ webpack.js
│  │  │  │  ├─ main-app.js
│  │  │  │  ├─ main.js
│  │  │  │  ├─ pages
│  │  │  │  │  ├─ _app.js
│  │  │  │  │  └─ _error.js
│  │  │  │  ├─ polyfills.js
│  │  │  │  ├─ react-refresh.js
│  │  │  │  ├─ webpack.js
│  │  │  │  └─ _error.js
│  │  │  ├─ css
│  │  │  │  └─ app
│  │  │  │     └─ layout.css
│  │  │  ├─ development
│  │  │  │  ├─ _buildManifest.js
│  │  │  │  └─ _ssgManifest.js
│  │  │  ├─ media
│  │  │  │  ├─ 26a46d62cd723877-s.woff2
│  │  │  │  ├─ 55c55f0601d81cf3-s.woff2
│  │  │  │  ├─ 581909926a08bbc8-s.woff2
│  │  │  │  ├─ 8e9860b6e62d6359-s.woff2
│  │  │  │  ├─ 97e0cb1ae144a2a9-s.woff2
│  │  │  │  ├─ df0a9ae256c0569c-s.woff2
│  │  │  │  └─ e4af272ccee01ff0-s.p.woff2
│  │  │  └─ webpack
│  │  │     ├─ 1a52dc0413e5dab2.webpack.hot-update.json
│  │  │     ├─ 1b1641643bf86fca.webpack.hot-update.json
│  │  │     ├─ 633457081244afec._.hot-update.json
│  │  │     ├─ 747ff5f193d399d8.webpack.hot-update.json
│  │  │     ├─ 98d589c791422e3b.webpack.hot-update.json
│  │  │     ├─ 9a7d8c9a666d141b.webpack.hot-update.json
│  │  │     ├─ 9e45d90af6b35c0f.webpack.hot-update.json
│  │  │     ├─ app
│  │  │     │  ├─ layout.1b1641643bf86fca.hot-update.js
│  │  │     │  ├─ layout.747ff5f193d399d8.hot-update.js
│  │  │     │  ├─ layout.98d589c791422e3b.hot-update.js
│  │  │     │  └─ layout.9e45d90af6b35c0f.hot-update.js
│  │  │     ├─ main.98d589c791422e3b.hot-update.js
│  │  │     ├─ webpack.1a52dc0413e5dab2.hot-update.js
│  │  │     ├─ webpack.1b1641643bf86fca.hot-update.js
│  │  │     ├─ webpack.747ff5f193d399d8.hot-update.js
│  │  │     ├─ webpack.98d589c791422e3b.hot-update.js
│  │  │     ├─ webpack.9a7d8c9a666d141b.hot-update.js
│  │  │     └─ webpack.9e45d90af6b35c0f.hot-update.js
│  │  ├─ trace
│  │  └─ types
│  │     ├─ app
│  │     │  ├─ layout.ts
│  │     │  └─ page.ts
│  │     ├─ cache-life.d.ts
│  │     └─ package.json
│  ├─ app
│  │  ├─ globals.css
│  │  ├─ jobs
│  │  │  ├─ create
│  │  │  │  └─ page.tsx
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ login
│  │  │  └─ page.tsx
│  │  ├─ materials
│  │  │  ├─ page.tsx
│  │  │  └─ update
│  │  │     └─ [id]
│  │  │        └─ page.tsx
│  │  ├─ page.tsx
│  │  ├─ printers
│  │  │  ├─ create
│  │  │  │  └─ page.tsx
│  │  │  └─ page.tsx
│  │  └─ register
│  │     └─ page.tsx
│  ├─ eslint.config.mjs
│  ├─ lib
│  │  ├─ api.ts
│  │  └─ store.ts
│  ├─ next-env.d.ts
│  ├─ next.config.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.mjs
│  ├─ public
│  │  ├─ file.svg
│  │  ├─ globe.svg
│  │  ├─ next.svg
│  │  ├─ vercel.svg
│  │  └─ window.svg
│  ├─ README.md
│  └─ tsconfig.json
├─ poetry.lock
├─ pyproject.toml
├─ README.md
├─ requirements.txt
├─ static
└─ __pycache__
   └─ main.cpython-312.pyc

```