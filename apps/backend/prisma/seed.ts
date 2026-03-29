import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = "admin@esharq.com";
  const password = "Admin123!";

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    // Agar mavjud bo'lsa — faqat rolini ADMIN ga o'tkazamiz
    const updated = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });
    console.log(`✅ Mavjud foydalanuvchi ADMIN ga yangilandi: ${updated.email}`);
    return;
  }

  const hashed = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      email,
      password: hashed,
      firstName: "Admin",
      lastName: "Esharq",
      role: "ADMIN",
    },
  });

  console.log("✅ Admin yaratildi:");
  console.log(`   Email   : ${admin.email}`);
  console.log(`   Parol   : ${password}`);
  console.log(`   Role    : ${admin.role}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
