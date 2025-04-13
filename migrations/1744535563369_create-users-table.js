exports.up = (pgm) => {
    // Drop the existing 'users' table if it exists
    pgm.dropTable('users', { ifExists: true });
  
    // Create the new 'users' table
    pgm.createTable('users', {
      id: 'id',                             // Auto-incrementing primary key
      name: { type: 'varchar(100)', notNull: true },  // User's name
      email: { type: 'varchar(100)', notNull: true, unique: true }, // User's email (unique)
      password_hash: { type: 'text' },       // Hashed password (nullable for OAuth users)
      oauth_provider: { type: 'varchar(50)' },   // OAuth provider name (nullable)
      oauth_id: { type: 'varchar(255)' },    // OAuth user ID (nullable)
      created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },  // Creation timestamp
      updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }   // Last update timestamp
    });
  };
  
  exports.down = (pgm) => {
    // Drop the 'users' table in case of a rollback
    pgm.dropTable('users');
  };
  