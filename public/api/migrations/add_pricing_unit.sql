-- SpaceMatch: Pricing Unit Migration
-- Run this SQL in phpMyAdmin to add the pricing_unit column to venues table

ALTER TABLE venues 
ADD COLUMN pricing_unit ENUM('daily', 'weekly', 'monthly') DEFAULT 'daily' AFTER price;

-- Verify the change
-- SELECT id, name, price, pricing_unit FROM venues LIMIT 5;
