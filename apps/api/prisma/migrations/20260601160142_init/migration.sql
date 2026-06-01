-- CreateTable
CREATE TABLE "encounters" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "round" INTEGER NOT NULL DEFAULT 0,
    "activeCombatantId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "encounters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combatants" (
    "id" TEXT NOT NULL,
    "encounterId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "initiative" INTEGER NOT NULL DEFAULT 0,
    "hpCurrent" INTEGER NOT NULL,
    "hpMax" INTEGER NOT NULL,
    "hpTemp" INTEGER NOT NULL DEFAULT 0,
    "ac" INTEGER NOT NULL,
    "exhaustionLevel" INTEGER NOT NULL DEFAULT 0,
    "conditions" TEXT[],
    "isPlayer" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "combatants_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "combatants" ADD CONSTRAINT "combatants_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "encounters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
