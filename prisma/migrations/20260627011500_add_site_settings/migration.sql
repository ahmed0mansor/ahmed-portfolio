-- Add basic site settings table for admin-controlled website options.
CREATE TABLE "SiteSetting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("key")
);

-- Default: CV download is enabled after deployment.
INSERT INTO "SiteSetting" ("key", "value", "updatedAt")
VALUES ('cvDownloadEnabled', 'true', CURRENT_TIMESTAMP)
ON CONFLICT ("key") DO NOTHING;
