require("dotenv/config");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false, // Ensure SSL is disabled for the local connection
  });

  try {
    const res = await pool.query('SELECT * FROM "User"');
    console.log(`Found ${res.rows.length} users in the database:\n`);

    const credentialsToCheck = [
      { email: "student@pdp.uz", givenPassword: "student123" },
      { email: "mentor@pdp.uz", givenPassword: "mentor123" },
      { email: "admin@pdp.uz", givenPassword: "admin123" },
    ];

    for (const u of res.rows) {
      console.log(`- Name: ${u.fullName}`);
      console.log(`  Email: ${u.email}`);
      console.log(`  Role: ${u.role}`);
      console.log(`  Password Hash in DB: ${u.passwordHash}`);

      const check = credentialsToCheck.find(c => c.email.toLowerCase() === u.email.toLowerCase());
      if (check) {
        const isMatch = await bcrypt.compare(check.givenPassword, u.passwordHash);
        console.log(`  Verification for "${check.givenPassword}": ${isMatch ? "SUCCESS (Matches)" : "FAILED (Does not match)"}`);
      } else {
        const defaultPasswords = ["admin123", "mentor123", "student123", "tutor123"];
        for (const dp of defaultPasswords) {
          const isMatch = await bcrypt.compare(dp, u.passwordHash);
          if (isMatch) {
            console.log(`  Verified password: "${dp}" matches!`);
            break;
          }
        }
      }
      console.log("");
    }
  } catch (error) {
    console.error("Error executing raw query:", error);
  } finally {
    await pool.end();
  }
}

main();
