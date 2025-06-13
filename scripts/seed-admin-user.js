const bcrypt = require('bcrypt');
const { Client } = require('pg');

async function createAdminUser() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'infinure',
    user: 'postgres',
    password: 'postgres'
  });

  try {
    await client.connect();
    console.log('Conectado a la base de datos');

    // Crear organización de prueba
    const orgResult = await client.query(`
      INSERT INTO organizations (name, slug, industry_type, subscription_tier, settings)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `, ['Test Organization', 'test-org', 'saas', 'starter', '{}']);

    const organizationId = orgResult.rows[0].id;
    console.log('Organización creada/actualizada:', organizationId);

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash('admin123', 12);

    // Crear usuario administrador
    await client.query(`
      INSERT INTO users (
        organization_id, email, password_hash, first_name, last_name, 
        role, department, permissions, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (email) 
      DO UPDATE SET 
        password_hash = EXCLUDED.password_hash,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        role = EXCLUDED.role,
        organization_id = EXCLUDED.organization_id
    `, [
      organizationId,
      'admin@test.com',
      passwordHash,
      'Admin',
      'User',
      'ceo',
      'IT',
      '{}',
      true
    ]);

    console.log('✅ Usuario administrador creado/actualizado exitosamente');
    console.log('📧 Email: admin@test.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: CEO');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

createAdminUser(); 