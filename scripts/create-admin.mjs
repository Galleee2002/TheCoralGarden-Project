import { createClient } from "@supabase/supabase-js";
import * as readline from "readline/promises";

const SUPABASE_URL = "https://phgavozknsdtsycyxlri.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoZ2F2b3prbnNkdHN5Y3l4bHJpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTg1NjM3MywiZXhwIjoyMDg3NDMyMzczfQ.XvDojY2CGBbx4PIYdGDAl4PStQkos1wUqx72FGa4Hn8";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const email = await rl.question("Email del admin: ");
const password = await rl.question("Contraseña (min 6 caracteres): ");
rl.close();

if (password.length < 6) {
  console.error("La contraseña debe tener al menos 6 caracteres.");
  process.exit(1);
}

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (error) {
  console.error("Error al crear usuario:", error.message);
  process.exit(1);
}

console.log(`Usuario creado exitosamente: ${data.user.email}`);
console.log("Ya podés iniciar sesión en http://localhost:3000/admin/login");
