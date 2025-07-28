-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "frags" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "killerId" TEXT,
    "victimId" TEXT NOT NULL,
    "weapon" TEXT NOT NULL,
    "killedAt" TIMESTAMP(3) NOT NULL,
    "isFriendlyFire" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "frags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_participations" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "frags" INTEGER NOT NULL DEFAULT 0,
    "deaths" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "awards" TEXT NOT NULL DEFAULT '[]',
    "joinedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "match_participations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "players_name_key" ON "players"("name");

-- CreateIndex
CREATE UNIQUE INDEX "match_participations_matchId_playerId_key" ON "match_participations"("matchId", "playerId");

-- AddForeignKey
ALTER TABLE "frags" ADD CONSTRAINT "frags_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frags" ADD CONSTRAINT "frags_killerId_fkey" FOREIGN KEY ("killerId") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frags" ADD CONSTRAINT "frags_victimId_fkey" FOREIGN KEY ("victimId") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_participations" ADD CONSTRAINT "match_participations_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_participations" ADD CONSTRAINT "match_participations_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
