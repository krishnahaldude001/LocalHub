-- Add optional Google Drive embed URL for in-article PDF (and similar) viewers
ALTER TABLE "posts" ADD COLUMN "embeddedPdfUrl" TEXT;
