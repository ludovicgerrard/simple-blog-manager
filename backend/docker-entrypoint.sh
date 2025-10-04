#!/bin/sh
set -e

# Optional: Wait for DB (for non-SQLite setups)
# echo "⏳ Waiting for database..."
# sleep 3

if [ ! -f /app/.migrated ]; then
  echo "🏗️ Running database migrations..."
  node ace migration:run --force && touch /app/.migrated
else
  echo "✅ Migrations already applied, skipping."
fi

echo "🚀 Starting AdonisJS server..."
exec node ./bin/server.js