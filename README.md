# rest-api

Rest API for a Backend Service

```bash
├── src                           # Source utama aplikasi
│   ├── infrastructure            # Lapisan paling luar (adaptor) - untuk komunikasi dengan dunia luar
│   │   ├── controller            # Tempat controller Express (HTTP handler) tinggal
│   │   ├── repositories          # Implementasi konkret dari interface repositori di domain
│   │   └── routes                # Konfigurasi routing Express (menghubungkan route ke controller)
│   ├── application               # Lapisan use case (application business logic)
│   │   └── usecase               # Folder untuk semua use case (misalnya RegisterUser, LoginUser, dll)
│   ├── domain                    # Lapisan domain (inti bisnis)
│   │   ├── entity                # Entitas domain (misalnya User, Product, dll)
│   │   ├── repositories          # Interface/kontrak repository yang akan diimplementasikan di infrastructure
│   │   └── value-object          # Nilai objek (misalnya Email, Password, dll) yang punya validasi & aturan sendiri
│   └── index.ts                  # Entry point aplikasi (misalnya buat dan jalankan server Express)
│
├── .gitattributes                # Pengaturan atribut git (biasanya untuk normalisasi line endings, dll)
├── .gitignore                    # File/folder yang tidak akan ditrack oleh Git
├── README.md                     # Dokumentasi atau penjelasan proyek
├── babel.config.js               # Konfigurasi untuk transpiler Babel (jika digunakan, meskipun TypeScript biasanya pakai tsconfig)
├── package-lock.json             # Hasil lock dependency otomatis (untuk menjaga versi konsisten)
├── package.json                  # File utama konfigurasi NPM (dependencies, script, dll)
├── test                          # Folder untuk testing
├── tsconfig.build.json           # Konfigurasi TypeScript khusus untuk proses build
└── tsconfig.json                 # Konfigurasi utama TypeScript
```
