
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
│  │  │  ├─ config.json
│  │  │  ├─ swc
│  │  │  │  └─ plugins
│  │  │  │     ├─ v7_linux_x86_64_17.0.0
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
│  │  │     │  ├─ index.pack.gz
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
│  │  │        ├─ index.pack.gz
│  │  │        └─ index.pack.gz.old
│  │  ├─ package.json
│  │  ├─ prerender-manifest.json
│  │  ├─ react-loadable-manifest.json
│  │  ├─ routes-manifest.json
│  │  ├─ server
│  │  │  ├─ app
│  │  │  │  ├─ page.js
│  │  │  │  ├─ page_client-reference-manifest.js
│  │  │  │  ├─ users
│  │  │  │  │  └─ auth
│  │  │  │  │     ├─ login
│  │  │  │  │     │  ├─ page.js
│  │  │  │  │     │  └─ page_client-reference-manifest.js
│  │  │  │  │     └─ register
│  │  │  │  │        ├─ page.js
│  │  │  │  │        └─ page_client-reference-manifest.js
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
│  │  │  ├─ pages-manifest.json
│  │  │  ├─ server-reference-manifest.js
│  │  │  ├─ server-reference-manifest.json
│  │  │  ├─ vendor-chunks
│  │  │  │  ├─ @swc.js
│  │  │  │  ├─ goober.js
│  │  │  │  ├─ next.js
│  │  │  │  ├─ react-hot-toast.js
│  │  │  │  └─ zustand.js
│  │  │  └─ webpack-runtime.js
│  │  ├─ static
│  │  │  ├─ chunks
│  │  │  │  ├─ app
│  │  │  │  │  ├─ layout.js
│  │  │  │  │  ├─ page.js
│  │  │  │  │  ├─ users
│  │  │  │  │  │  └─ auth
│  │  │  │  │  │     ├─ login
│  │  │  │  │  │     │  └─ page.js
│  │  │  │  │  │     └─ register
│  │  │  │  │  │        └─ page.js
│  │  │  │  │  └─ _not-found
│  │  │  │  │     └─ page.js
│  │  │  │  ├─ app-pages-internals.js
│  │  │  │  ├─ main-app.js
│  │  │  │  ├─ polyfills.js
│  │  │  │  └─ webpack.js
│  │  │  ├─ css
│  │  │  │  └─ app
│  │  │  │     └─ layout.css
│  │  │  ├─ development
│  │  │  │  ├─ _buildManifest.js
│  │  │  │  └─ _ssgManifest.js
│  │  │  ├─ media
│  │  │  │  ├─ 10dadb2e82d03733-s.woff2
│  │  │  │  ├─ 200388358b398524-s.woff2
│  │  │  │  ├─ 34900c74a84112b6-s.woff2
│  │  │  │  ├─ 630c17af355fa44e-s.p.woff2
│  │  │  │  └─ 95d1875af7c44e92-s.woff2
│  │  │  └─ webpack
│  │  │     ├─ 051609238a719843.webpack.hot-update.json
│  │  │     ├─ 3437037929b2339c.webpack.hot-update.json
│  │  │     ├─ 4bce66dee4c0069e.webpack.hot-update.json
│  │  │     ├─ 633457081244afec._.hot-update.json
│  │  │     ├─ d3fda58ae9ecd814.webpack.hot-update.json
│  │  │     ├─ webpack.051609238a719843.hot-update.js
│  │  │     ├─ webpack.3437037929b2339c.hot-update.js
│  │  │     ├─ webpack.4bce66dee4c0069e.hot-update.js
│  │  │     └─ webpack.d3fda58ae9ecd814.hot-update.js
│  │  ├─ trace
│  │  └─ types
│  │     ├─ app
│  │     │  ├─ layout.ts
│  │     │  ├─ page.ts
│  │     │  └─ users
│  │     │     └─ auth
│  │     │        ├─ login
│  │     │        │  └─ page.ts
│  │     │        └─ register
│  │     │           └─ page.ts
│  │     ├─ cache-life.d.ts
│  │     └─ package.json
│  ├─ app
│  │  ├─ ClientNav.tsx
│  │  ├─ dashboard
│  │  │  └─ page.tsx
│  │  ├─ globals.css
│  │  ├─ jobs
│  │  │  ├─ create
│  │  │  │  └─ page.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ queue
│  │  │     └─ [printer_id]
│  │  │        └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ materials
│  │  │  ├─ create
│  │  │  │  └─ page.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ [id]
│  │  │     └─ edit
│  │  │        └─ page.tsx
│  │  ├─ page.tsx
│  │  ├─ printers
│  │  │  ├─ create
│  │  │  │  └─ page.tsx
│  │  │  └─ page.tsx
│  │  ├─ Sidebar.tsx
│  │  └─ users
│  │     └─ auth
│  │        ├─ login
│  │        │  └─ page.tsx
│  │        └─ register
│  │           └─ page.tsx
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
│  │  └─ img
│  │     ├─ add.svg
│  │     ├─ add2.svg
│  │     ├─ arrow.svg
│  │     ├─ flask.svg
│  │     ├─ flask2.svg
│  │     ├─ list.svg
│  │     ├─ list2.svg
│  │     ├─ material.svg
│  │     ├─ material2.svg
│  │     ├─ printer.svg
│  │     ├─ printer2.svg
│  │     ├─ queue.svg
│  │     ├─ queue2.svg
│  │     ├─ star.svg
│  │     └─ star2.svg
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