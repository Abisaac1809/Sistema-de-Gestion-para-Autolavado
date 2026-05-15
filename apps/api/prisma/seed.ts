import { PrismaClient } from "../src/generated/prisma/client.js";

const prisma = new PrismaClient();

const DOLLAR_RATE = 36.5;
const BASE_DATE = new Date("2026-05-13T23:59:59.000Z");

function daysAgo(days: number): Date {
  const d = new Date(BASE_DATE);
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d;
}

function randomTime(base: Date, startHour = 8, endHour = 18): Date {
  const d = new Date(base);
  d.setHours(
    startHour + Math.floor(Math.random() * (endHour - startHour)),
    Math.floor(Math.random() * 60),
    Math.floor(Math.random() * 60),
    0,
  );
  return d;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickWeighted<T>(items: Array<{ item: T; weight: number }>): T {
  const total = items.reduce((s, i) => s + i.weight, 0);
  let r = Math.random() * total;
  for (const { item, weight } of items) {
    r -= weight;
    if (r <= 0) return item;
  }
  return items[items.length - 1].item;
}

async function clean() {
  await prisma.payment.deleteMany();
  await prisma.inventoryAdjustment.deleteMany();
  await prisma.saleDetail.deleteMany();
  await prisma.purchaseDetail.deleteMany();
  await prisma.orderDetail.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.order.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.service.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.paymentMethod.deleteMany();
  await prisma.notificationContact.deleteMany();
  await prisma.exchangeRateConfig.deleteMany();
  await prisma.storeInfo.deleteMany();
  console.log("🗑️  Cleaned existing data");
}

async function main() {
  console.log("🌱 Starting database seed...\n");

  await clean();

  // ─── Store Info ──────────────────────────────────────────────────────────────
  await prisma.storeInfo.create({
    data: {
      name: "AutoWash Pro",
      rif: "J-40123456-7",
      address: "Av. Francisco de Miranda, C.C. Las Mercedes, Local 12, Caracas",
      phone: "+58-212-9876543",
      logoUrl: null,
    },
  });
  console.log("✅ StoreInfo");

  // ─── Exchange Rate ────────────────────────────────────────────────────────────
  await prisma.exchangeRateConfig.create({
    data: {
      activeSource: "BCV_USD",
      customRate: 0,
      bcvUsdRate: DOLLAR_RATE,
      bcvEurRate: 39.8,
      autoUpdate: true,
      lastSync: new Date(),
    },
  });
  console.log("✅ ExchangeRateConfig");

  // ─── Notification Contacts ────────────────────────────────────────────────────
  await prisma.notificationContact.createMany({
    data: [
      { fullName: "Carlos Mendoza", email: "carlos.mendoza@autowashpro.com", receiveReports: true, isActive: true },
      { fullName: "María Rodríguez", email: "maria.rodriguez@autowashpro.com", receiveReports: true, isActive: true },
      { fullName: "Gerencia General", email: "gerencia@autowashpro.com", receiveReports: false, isActive: true },
    ],
  });
  console.log("✅ NotificationContacts");

  // ─── Product Categories ───────────────────────────────────────────────────────
  const [catLimpieza, catProteccion, catAccesorios, catQuimicos] = await Promise.all([
    prisma.productCategory.create({ data: { name: "Limpieza", description: "Shampoos y jabones para vehículos" } }),
    prisma.productCategory.create({ data: { name: "Protección y Brillo", description: "Ceras, selladores y protectores" } }),
    prisma.productCategory.create({ data: { name: "Accesorios", description: "Accesorios para el cuidado del vehículo" } }),
    prisma.productCategory.create({ data: { name: "Químicos Industriales", description: "Desengrasantes y productos de uso interno" } }),
  ]);
  console.log("✅ ProductCategories");

  // ─── Products ─────────────────────────────────────────────────────────────────
  // For sale
  const [prodAmbientador, prodCeraLiquida, prodToalla] = await Promise.all([
    prisma.product.create({
      data: { categoryId: catAccesorios.id, name: "Ambientador para Vehículo", stock: 45, minStock: 20, unitType: "UNITS", costPrice: 0.8, isForSale: true },
    }),
    prisma.product.create({
      data: { categoryId: catProteccion.id, name: "Cera Líquida Premium", stock: 12, minStock: 10, unitType: "UNITS", costPrice: 6.5, isForSale: true },
    }),
    prisma.product.create({
      data: { categoryId: catAccesorios.id, name: "Toalla de Microfibra", stock: 30, minStock: 15, unitType: "UNITS", costPrice: 2.5, isForSale: true },
    }),
  ]);

  // Internal use only (some below minStock to trigger alerts)
  const [prodShampoo, prodDesengrasante, prodCeraCarnauba, prodSilicona, prodMicrofibra] = await Promise.all([
    prisma.product.create({
      data: { categoryId: catLimpieza.id, name: "Shampoo para Autos (Galón)", stock: 8, minStock: 15, unitType: "LITERS", costPrice: 5.0, isForSale: false },
    }),
    prisma.product.create({
      data: { categoryId: catQuimicos.id, name: "Desengrasante Industrial", stock: 4, minStock: 10, unitType: "LITERS", costPrice: 8.0, isForSale: false },
    }),
    prisma.product.create({
      data: { categoryId: catProteccion.id, name: "Cera de Carnauba (kg)", stock: 3, minStock: 5, unitType: "KILOGRAMS", costPrice: 12.0, isForSale: false },
    }),
    prisma.product.create({
      data: { categoryId: catProteccion.id, name: "Silicona para Tablero", stock: 18, minStock: 10, unitType: "UNITS", costPrice: 3.5, isForSale: false },
    }),
    prisma.product.create({
      data: { categoryId: catAccesorios.id, name: "Paños de Microfibra (Caja)", stock: 6, minStock: 4, unitType: "BOXES", costPrice: 18.0, isForSale: false },
    }),
  ]);
  console.log("✅ Products");

  // ─── Services ─────────────────────────────────────────────────────────────────
  const [svcBasico, svcCompleto, svcInterior, svcPremium, svcEncerado, svcPulido, svcMotor] = await Promise.all([
    prisma.service.create({ data: { name: "Lavado Básico", description: "Lavado exterior con agua y shampoo", price: 5.0 } }),
    prisma.service.create({ data: { name: "Lavado Completo", description: "Lavado exterior e interior básico", price: 10.0 } }),
    prisma.service.create({ data: { name: "Limpieza Interior", description: "Aspirado, tablero y asientos", price: 15.0 } }),
    prisma.service.create({ data: { name: "Lavado Premium", description: "Lavado completo + encerado + silicona", price: 25.0 } }),
    prisma.service.create({ data: { name: "Encerado", description: "Aplicación de cera para protección y brillo", price: 20.0 } }),
    prisma.service.create({ data: { name: "Pulido y Abrillantado", description: "Pulido profesional para rayaduras superficiales", price: 35.0 } }),
    prisma.service.create({ data: { name: "Lavado de Motor", description: "Limpieza del compartimiento del motor", price: 15.0 } }),
  ]);
  console.log("✅ Services");

  // ─── Customers ────────────────────────────────────────────────────────────────
  const customers = await Promise.all([
    prisma.customer.create({ data: { fullName: "Juan Carlos Pérez", idNumber: "V-12345678", phone: "+58-414-1234567" } }),
    prisma.customer.create({ data: { fullName: "María González", idNumber: "V-20456789", phone: "+58-424-2345678" } }),
    prisma.customer.create({ data: { fullName: "Luis Martínez", idNumber: "V-15678901", phone: "+58-412-3456789" } }),
    prisma.customer.create({ data: { fullName: "Ana Rodríguez", idNumber: "V-18901234", phone: "+58-416-4567890" } }),
    prisma.customer.create({ data: { fullName: "Carlos Hernández", idNumber: "V-22345678", phone: "+58-426-5678901" } }),
    prisma.customer.create({ data: { fullName: "Sofía López", idNumber: "V-14567890", phone: "+58-414-6789012" } }),
    prisma.customer.create({ data: { fullName: "Miguel Torres", idNumber: "V-17890123", phone: "+58-424-7890123" } }),
    prisma.customer.create({ data: { fullName: "Valentina Flores", idNumber: "V-21234567", phone: "+58-412-8901234" } }),
    prisma.customer.create({ data: { fullName: "Roberto Díaz", idNumber: "V-13456789", phone: "+58-416-9012345" } }),
    prisma.customer.create({ data: { fullName: "Isabella Moreno", idNumber: "V-19012345", phone: "+58-426-0123456" } }),
    prisma.customer.create({ data: { fullName: "Alejandro Jiménez", idNumber: "V-16789012", phone: "+58-414-1234568" } }),
    prisma.customer.create({ data: { fullName: "Gabriela Vargas", idNumber: "V-23456789", phone: "+58-424-2345679" } }),
    prisma.customer.create({ data: { fullName: "Fernando Castillo", idNumber: "V-11234567", phone: "+58-412-3456780" } }),
    prisma.customer.create({ data: { fullName: "Daniela Romero", idNumber: "V-24567890", phone: "+58-416-4567891" } }),
    prisma.customer.create({ data: { fullName: "Eduardo Sánchez", idNumber: "V-10123456", phone: "+58-426-5678902" } }),
    prisma.customer.create({ data: { fullName: "Patricia Núñez", idNumber: "V-25678901", phone: "+58-414-5678903" } }),
    prisma.customer.create({ data: { fullName: "Ricardo Medina", idNumber: "V-09876543", phone: "+58-424-6789014" } }),
    prisma.customer.create({ data: { fullName: "Carmen Suárez", idNumber: "V-26789012", phone: "+58-412-7890125" } }),
  ]);
  console.log("✅ Customers");

  // ─── Payment Methods ──────────────────────────────────────────────────────────
  const [pmCashUsd, pmCashVes, pmZelle, pmPagoMovil, pmTransferencia] = await Promise.all([
    prisma.paymentMethod.create({ data: { name: "Efectivo USD", currency: "USD", isActive: true } }),
    prisma.paymentMethod.create({ data: { name: "Efectivo Bolívares", currency: "VES", isActive: true } }),
    prisma.paymentMethod.create({ data: { name: "Zelle", currency: "USD", email: "pagos@autowashpro.com", isActive: true } }),
    prisma.paymentMethod.create({
      data: {
        name: "Pago Móvil",
        currency: "VES",
        bankName: "Banco de Venezuela",
        accountHolder: "AutoWash Pro C.A.",
        phoneNumber: "0412-9876543",
        idCard: "J-40123456-7",
        isActive: true,
      },
    }),
    prisma.paymentMethod.create({
      data: {
        name: "Transferencia Bancaria",
        currency: "VES",
        bankName: "Banesco",
        accountHolder: "AutoWash Pro C.A.",
        accountNumber: "0134-0123-45-6789012345",
        isActive: true,
      },
    }),
  ]);
  console.log("✅ PaymentMethods");

  const paymentMethods = [pmCashUsd, pmCashVes, pmZelle, pmPagoMovil, pmTransferencia];

  // ─── Purchases ────────────────────────────────────────────────────────────────
  const purchaseData = [
    {
      daysAgoN: 28,
      provider: "Distribuidora Química del Centro",
      pmId: pmCashUsd.id,
      items: [
        { productId: prodShampoo.id, qty: 20, unitCost: 4.5 },
        { productId: prodDesengrasante.id, qty: 15, unitCost: 7.5 },
      ],
    },
    {
      daysAgoN: 18,
      provider: "Suministros AutoCare C.A.",
      pmId: pmZelle.id,
      items: [
        { productId: prodCeraCarnauba.id, qty: 5, unitCost: 11.0 },
        { productId: prodSilicona.id, qty: 24, unitCost: 3.2 },
        { productId: prodMicrofibra.id, qty: 4, unitCost: 17.0 },
      ],
    },
    {
      daysAgoN: 8,
      provider: "Distribuidora Química del Centro",
      pmId: pmTransferencia.id,
      items: [
        { productId: prodShampoo.id, qty: 10, unitCost: 4.5 },
        { productId: prodDesengrasante.id, qty: 8, unitCost: 7.5 },
        { productId: prodCeraLiquida.id, qty: 6, unitCost: 6.5 },
      ],
    },
  ];

  for (const p of purchaseData) {
    const totalUsd = p.items.reduce((s, i) => s + i.qty * i.unitCost, 0);
    await prisma.purchase.create({
      data: {
        providerName: p.provider,
        purchaseDate: daysAgo(p.daysAgoN),
        dollarRate: DOLLAR_RATE,
        totalUsd,
        paymentMethodId: p.pmId,
        purchaseDetails: {
          create: p.items.map((i) => ({
            productId: i.productId,
            quantity: i.qty,
            unitCostUsd: i.unitCost,
            subtotalUsd: i.qty * i.unitCost,
          })),
        },
      },
    });
  }
  console.log("✅ Purchases");

  // ─── Inventory Adjustments ────────────────────────────────────────────────────
  const adjustments = [
    { productId: prodShampoo.id, type: "OUT" as const, reason: "SPILLED" as const, qty: 2, stockBefore: 28, daysAgoN: 25 },
    { productId: prodDesengrasante.id, type: "OUT" as const, reason: "DAMAGED" as const, qty: 1, stockBefore: 15, daysAgoN: 20 },
    { productId: prodCeraCarnauba.id, type: "OUT" as const, reason: "AUDIT_CORRECTION" as const, qty: 0.5, stockBefore: 5, daysAgoN: 14 },
    { productId: prodSilicona.id, type: "OUT" as const, reason: "DAMAGED" as const, qty: 3, stockBefore: 21, daysAgoN: 10 },
    { productId: prodShampoo.id, type: "OUT" as const, reason: "SPILLED" as const, qty: 1.5, stockBefore: 18, daysAgoN: 6 },
    { productId: prodMicrofibra.id, type: "IN" as const, reason: "AUDIT_CORRECTION" as const, qty: 2, stockBefore: 4, daysAgoN: 3 },
  ];

  for (const adj of adjustments) {
    const stockAfter = adj.type === "IN" ? adj.stockBefore + adj.qty : Math.max(0, adj.stockBefore - adj.qty);
    await prisma.inventoryAdjustment.create({
      data: {
        productId: adj.productId,
        adjustmentType: adj.type,
        quantity: adj.qty,
        stockBefore: adj.stockBefore,
        stockAfter,
        reason: adj.reason,
        createdAt: daysAgo(adj.daysAgoN),
      },
    });
  }
  console.log("✅ InventoryAdjustments");

  // ─── Orders & Sales ───────────────────────────────────────────────────────────
  const vehiclePlates = ["ABC123","XYZ456","DEF789","GHI012","JKL345","MNO678","PQR901","STU234","VWX567","YZA890","BCB111","CDC222","EFE444","FGF555","ZZZ999"];
  const vehicleModels = ["Toyota Corolla","Chevrolet Aveo","Ford Fiesta","Hyundai Tucson","Kia Sportage","Toyota Fortuner","Chevrolet Spark","Mitsubishi Lancer","Honda Civic","Nissan Sentra","Toyota Hilux","Jeep Grand Cherokee","Renault Duster","Mazda CX-5"];

  const servicePool = [
    { item: { svc: svcBasico, price: 5.0 }, weight: 32 },
    { item: { svc: svcCompleto, price: 10.0 }, weight: 26 },
    { item: { svc: svcInterior, price: 15.0 }, weight: 14 },
    { item: { svc: svcPremium, price: 25.0 }, weight: 12 },
    { item: { svc: svcEncerado, price: 20.0 }, weight: 8 },
    { item: { svc: svcPulido, price: 35.0 }, weight: 4 },
    { item: { svc: svcMotor, price: 15.0 }, weight: 4 },
  ];

  const saleableProducts = [
    { product: prodAmbientador, price: 2.0 },
    { product: prodCeraLiquida, price: 15.0 },
    { product: prodToalla, price: 5.0 },
  ];

  // Payment method weights (cash USD most common, then pago móvil)
  const pmPool = [
    { item: pmCashUsd, weight: 35 },
    { item: pmPagoMovil, weight: 25 },
    { item: pmCashVes, weight: 15 },
    { item: pmZelle, weight: 15 },
    { item: pmTransferencia, weight: 10 },
  ];

  let ordersCreated = 0;
  let salesCreated = 0;

  for (let day = 29; day >= 0; day--) {
    const baseDate = daysAgo(day);
    const dow = baseDate.getDay(); // 0=sun, 6=sat
    const isWeekend = dow === 0 || dow === 6;
    const ordersPerDay = isWeekend ? randInt(9, 14) : randInt(4, 8);

    for (let i = 0; i < ordersPerDay; i++) {
      const customer = pick(customers);
      const createdAt = randomTime(baseDate, 8, 17);

      // Status distribution: older days are mostly completed
      let status: "COMPLETED" | "CANCELLED" | "IN_PROGRESS" | "PENDING";
      if (day === 0) {
        const r = Math.random();
        status = r < 0.45 ? "COMPLETED" : r < 0.72 ? "IN_PROGRESS" : "PENDING";
      } else {
        status = Math.random() < 0.88 ? "COMPLETED" : "CANCELLED";
      }

      // Pick 1–2 services (no duplicates)
      const numServices = Math.random() < 0.25 ? 2 : 1;
      const usedSvcIds = new Set<string>();
      const selectedServices: Array<{ id: string; price: number }> = [];
      for (let s = 0; s < numServices; s++) {
        const { svc, price } = pickWeighted(servicePool);
        if (!usedSvcIds.has(svc.id)) {
          selectedServices.push({ id: svc.id, price });
          usedSvcIds.add(svc.id);
        }
      }

      // Occasionally sell a product alongside the service
      const selectedProducts: Array<{ id: string; price: number; qty: number }> = [];
      if (status === "COMPLETED" && Math.random() < 0.18) {
        const sp = pick(saleableProducts);
        selectedProducts.push({ id: sp.product.id, price: sp.price, qty: randInt(1, 2) });
      }

      const totalUsd =
        selectedServices.reduce((s, x) => s + x.price, 0) +
        selectedProducts.reduce((s, x) => s + x.price * x.qty, 0);
      const totalVes = totalUsd * DOLLAR_RATE;

      const startedAt =
        status !== "PENDING"
          ? new Date(createdAt.getTime() + randInt(2, 8) * 60_000)
          : null;
      const completedAt =
        status === "COMPLETED"
          ? new Date((startedAt ?? createdAt).getTime() + randInt(20, 65) * 60_000)
          : null;

      const order = await prisma.order.create({
        data: {
          customerId: customer.id,
          vehiclePlate: pick(vehiclePlates),
          vehicleModel: pick(vehicleModels),
          status,
          paymentStatus: status === "COMPLETED" ? "PAID" : "PENDING",
          startedAt,
          completedAt,
          dollarRate: DOLLAR_RATE,
          totalUsd,
          totalVes,
          totalPaidUsd: status === "COMPLETED" ? totalUsd : 0,
          totalPaidVes: status === "COMPLETED" ? totalVes : 0,
          createdAt,
          updatedAt: completedAt ?? createdAt,
          orderDetails: {
            create: [
              ...selectedServices.map((s) => ({
                serviceId: s.id,
                quantity: 1,
                priceAtTime: s.price,
                createdAt,
                updatedAt: createdAt,
              })),
              ...selectedProducts.map((p) => ({
                productId: p.id,
                quantity: p.qty,
                priceAtTime: p.price,
                createdAt,
                updatedAt: createdAt,
              })),
            ],
          },
        },
      });
      ordersCreated++;

      if (status === "COMPLETED") {
        const saleDate = completedAt ?? createdAt;
        const pm = pickWeighted(pmPool);

        const sale = await prisma.sale.create({
          data: {
            customerId: customer.id,
            orderId: order.id,
            totalUsd,
            totalVes,
            dollarRate: DOLLAR_RATE,
            status: "COMPLETED",
            createdAt: saleDate,
            updatedAt: saleDate,
            saleDetails: {
              create: [
                ...selectedServices.map((s) => ({
                  serviceId: s.id,
                  quantity: 1,
                  unitPrice: s.price,
                  subtotal: s.price,
                  createdAt: saleDate,
                  updatedAt: saleDate,
                })),
                ...selectedProducts.map((p) => ({
                  productId: p.id,
                  quantity: p.qty,
                  unitPrice: p.price,
                  subtotal: p.price * p.qty,
                  createdAt: saleDate,
                  updatedAt: saleDate,
                })),
              ],
            },
          },
        });
        salesCreated++;

        await prisma.payment.create({
          data: {
            orderId: order.id,
            saleId: sale.id,
            paymentMethodId: pm.id,
            amountUsd: totalUsd,
            exchangeRate: DOLLAR_RATE,
            amountVes: totalVes,
            originalCurrency: pm.currency === "VES" ? "VES" : "USD",
            paymentDate: saleDate,
            createdAt: saleDate,
            updatedAt: saleDate,
          },
        });
      }
    }
  }

  // ─── Quick Sales (no order) ───────────────────────────────────────────────────
  // Counter sales of products only, spread across the month
  const quickSaleDays = [27, 24, 20, 17, 13, 10, 6, 3, 1];
  for (const day of quickSaleDays) {
    const customer = pick(customers);
    const sp = pick(saleableProducts);
    const qty = randInt(1, 3);
    const totalUsd = sp.price * qty;
    const totalVes = totalUsd * DOLLAR_RATE;
    const saleDate = randomTime(daysAgo(day), 9, 16);
    const pm = pickWeighted(pmPool);

    const sale = await prisma.sale.create({
      data: {
        customerId: customer.id,
        orderId: null,
        totalUsd,
        totalVes,
        dollarRate: DOLLAR_RATE,
        status: "COMPLETED",
        createdAt: saleDate,
        updatedAt: saleDate,
        saleDetails: {
          create: [{
            productId: sp.product.id,
            quantity: qty,
            unitPrice: sp.price,
            subtotal: totalUsd,
            createdAt: saleDate,
            updatedAt: saleDate,
          }],
        },
      },
    });
    salesCreated++;

    await prisma.payment.create({
      data: {
        saleId: sale.id,
        paymentMethodId: pm.id,
        amountUsd: totalUsd,
        exchangeRate: DOLLAR_RATE,
        amountVes: totalVes,
        originalCurrency: pm.currency === "VES" ? "VES" : "USD",
        paymentDate: saleDate,
        createdAt: saleDate,
        updatedAt: saleDate,
      },
    });
  }

  console.log(`✅ Orders: ${ordersCreated}`);
  console.log(`✅ Sales:  ${salesCreated} (includes ${quickSaleDays.length} quick sales)`);
  console.log("\n🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
