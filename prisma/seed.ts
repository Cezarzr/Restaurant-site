import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Owner",
      passwordHash: await bcrypt.hash(password, 10),
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      businessEmail: email,
      businessPhone: "+1 555-0123",
      defaultTimeSlots: ["10:00-12:00", "12:00-14:00", "18:00-20:00"],
      notificationEmails: [email],
      socials: { instagram: "https://instagram.com/thelocallebanese" },
    },
  });

  await prisma.scheduleEntry.createMany({
    data: [
      { title: "Downtown Lunch Stop", startDateTime: new Date(Date.now() + 86400000), endDateTime: new Date(Date.now() + 90000000), address: "123 Main St", city: "Austin", tags: ["Lunch"], visibility: "PUBLIC", bookingOpen: true },
      { title: "Private Catering", startDateTime: new Date(Date.now() + 172800000), endDateTime: new Date(Date.now() + 180000000), address: "500 Event Ave", city: "Austin", tags: ["Catering"], visibility: "PUBLIC", bookingOpen: false },
    ],
    skipDuplicates: true,
  });

  const lunch = await prisma.menuCategory.upsert({
    where: { id: "seed-lunch" },
    update: {},
    create: { id: "seed-lunch", name: "Lunch", type: "Lunch", sortOrder: 1 },
  });

  await prisma.menuItem.createMany({
    data: [
      { categoryId: lunch.id, name: "Chicken Shawarma Wrap", description: "Garlic toum, pickles, fries", price: 12.5, dietaryTags: ["halal"], sortOrder: 1 },
      { categoryId: lunch.id, name: "Falafel Bowl", description: "Tahini, tabbouleh, hummus", price: 11, dietaryTags: ["vegan"], sortOrder: 2 },
    ],
    skipDuplicates: true,
  });

  await prisma.bookingRequest.create({
    data: {
      type: "TRUCK",
      name: "Sample Client",
      email: "client@example.com",
      phone: "5551234567",
      eventDate: new Date(Date.now() + 604800000),
      timeFrame: "12:00-14:00",
      address: "900 Corporate Dr",
      eventType: "Corporate",
      paymentType: "Invoice",
      numberOfPeople: 80,
      numberOfTrucks: 1,
      message: "Need lunch service",
      conflictFlag: false,
    },
  });
}

main().finally(async () => prisma.$disconnect());
