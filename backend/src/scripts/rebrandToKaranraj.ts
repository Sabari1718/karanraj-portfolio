import pool from '../config/database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

async function rebrandToKaranraj() {
  console.log('\n🚀 Starting Karanraj rebrand script...\n');

  try {
    // ── 1. Update profile name ──────────────────────────────────────
    const [profileResult]: any = await pool.query(
      `UPDATE profile 
       SET name = REPLACE(name, 'Udhayachandran', 'Karanraj'),
           display_name = REPLACE(COALESCE(display_name, ''), 'Udhaya', 'Karanraj')
       WHERE name LIKE '%Udhayachandran%' OR display_name LIKE '%Udhaya%'`
    );
    console.log(`✅ Profile name updated — rows affected: ${profileResult.affectedRows}`);

    // ── 1b. Force set name to Karanraj if any profile exists ────────
    const [profileForce]: any = await pool.query(
      `UPDATE profile SET name = 'Karanraj', display_name = 'Karanraj' LIMIT 1`
    );
    console.log(`✅ Profile name force-set to Karanraj — rows affected: ${profileForce.affectedRows}`);

    // ── 2. Update navbar logo_name ──────────────────────────────────
    const [navbarResult]: any = await pool.query(
      `UPDATE navbar_settings 
       SET logo_name = REPLACE(logo_name, 'Udhayachandran', 'Karanraj')
       WHERE logo_name LIKE '%Udhayachandran%'`
    );
    console.log(`✅ Navbar logo_name updated — rows affected: ${navbarResult.affectedRows}`);

    // ── 2b. Force set navbar logo if any row exists ──────────────────
    const [navForce]: any = await pool.query(
      `UPDATE navbar_settings SET logo_name = 'Karanraj Portfolio' LIMIT 1`
    );
    console.log(`✅ Navbar logo forced to 'Karanraj Portfolio' — rows affected: ${navForce.affectedRows}`);

    // ── 3. Update admin credentials ─────────────────────────────────
    const newEmail = 'karan@gmail.com';
    const newPassword = 'karan@123';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    const [adminResult]: any = await pool.query(
      `UPDATE users SET email = ?, password_hash = ? WHERE role = 'admin'`,
      [newEmail, passwordHash]
    );

    if (adminResult.affectedRows === 0) {
      // No admin row exists — insert one
      await pool.query(
        `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
        ['Karanraj', newEmail, passwordHash, 'admin']
      );
      console.log(`✅ Admin user inserted: ${newEmail}`);
    } else {
      console.log(`✅ Admin credentials updated: ${newEmail} / karan@123`);
    }

    // ── 4. Summary ──────────────────────────────────────────────────
    console.log('\n🎉 Rebrand complete!\n');
    console.log('   Portfolio name  : Karanraj');
    console.log('   Navbar logo     : Karanraj Portfolio');
    console.log('   Admin email     : karan@gmail.com');
    console.log('   Admin password  : karan@123');
    console.log('\n   Restart backend & refresh frontend to see changes.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during rebrand:', error);
    process.exit(1);
  }
}

rebrandToKaranraj();
