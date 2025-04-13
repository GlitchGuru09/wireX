# wireX
WireX is a fast, secure, and user-friendly Peer-to-Peer (P2P) transaction platform where users can send and receive money instantly. It features wallet-based transactions, user authentication, transaction history, and security measures to protect funds.

for migration to run 
DATABASE_URL=postgres://postgres@localhost:5432/your_database_name need to declare this in .env file 
npx node-pg-migrate up --migrations-dir migrations
npx node-pg-migrate down --migrations-dir migrations 
up to apply migration and down to undo migration

