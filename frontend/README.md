1. ipconfig → find your IPv4 address e.g. 192.168.1.8

2. .env
   SANCTUM_STATEFUL_DOMAINS=localhost,localhost:5173,192.168.1.8,192.168.1.8:5173
   SESSION_DOMAIN=

3. sanctum.php — add both to stateful array
   'localhost,localhost:5173,192.168.1.8,192.168.1.8:5173'

4. React axios
   const isLocal = window.location.hostname === "localhost";
   baseURL: isLocal ? "http://localhost:8000" : "http://192.168.1.8:8000"

5. Run Laravel on all interfaces
   php artisan serve --host=0.0.0.0 --port=8000

6. Clear Laravel cache
   php artisan config:clear
   php artisan cache:clear
