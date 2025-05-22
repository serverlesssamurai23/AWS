# Database Schema (PostgreSQL)

This document outlines the initial database schema for the OptiCart e-commerce platform.

## Table: `Users`

Stores information about registered users.

| Column          | Data Type      | Constraints                        | Description                                   |
|-----------------|----------------|------------------------------------|-----------------------------------------------|
| `id`            | `UUID`         | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier for the user              |
| `email`         | `VARCHAR(255)` | `UNIQUE`, `NOT NULL`               | User's email address (used for login)       |
| `password_hash` | `VARCHAR(255)` | `NOT NULL`                         | Hashed password                               |
| `first_name`    | `VARCHAR(100)` |                                    | User's first name                             |
| `last_name`     | `VARCHAR(100)` |                                    | User's last name                              |
| `phone_number`  | `VARCHAR(20)`  |                                    | User's phone number (optional)                |
| `created_at`    | `TIMESTAMPZ`   | `DEFAULT CURRENT_TIMESTAMP`        | Timestamp of user creation                    |
| `updated_at`    | `TIMESTAMPZ`   | `DEFAULT CURRENT_TIMESTAMP`        | Timestamp of last user update                 |

## Table: `Products`

Stores information about all types of products (glasses, sunglasses, contact lenses, accessories).

| Column             | Data Type      | Constraints                        | Description                                     |
|--------------------|----------------|------------------------------------|-------------------------------------------------|
| `id`               | `UUID`         | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier for the product             |
| `name`             | `VARCHAR(255)` | `NOT NULL`                         | Product name                                    |
| `description`      | `TEXT`         |                                    | Detailed product description                    |
| `price`            | `DECIMAL(10,2)`| `NOT NULL`                         | Product price                                   |
| `sku`              | `VARCHAR(100)` | `UNIQUE`, `NOT NULL`               | Stock Keeping Unit                            |
| `stock_quantity`   | `INTEGER`      | `NOT NULL`, `DEFAULT 0`            | Available quantity in stock                   |
| `category`         | `VARCHAR(50)`  | `NOT NULL`                         | Main category (e.g., 'Prescription Glasses', 'Contact Lenses', 'Sunglasses', 'Accessories') |
| `brand_id`         | `UUID`         | `REFERENCES Brands(id)` (Optional) | Foreign key to a potential `Brands` table     |
| `main_image_url`   | `VARCHAR(255)` |                                    | URL for the primary product image               |
| `created_at`       | `TIMESTAMPZ`   | `DEFAULT CURRENT_TIMESTAMP`        | Timestamp of product creation                   |
| `updated_at`       | `TIMESTAMPZ`   | `DEFAULT CURRENT_TIMESTAMP`        | Timestamp of last product update                |
| `is_active`        | `BOOLEAN`      | `DEFAULT TRUE`                     | Whether the product is currently active/visible |

## Table: `ProductVariants` (Example for products with options like color/size)

Stores different variations of a product (e.g., frame color and size for glasses).

| Column             | Data Type      | Constraints                        | Description                                     |
|--------------------|----------------|------------------------------------|-------------------------------------------------|
| `id`               | `UUID`         | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier for the variant             |
| `product_id`       | `UUID`         | `REFERENCES Products(id) ON DELETE CASCADE`, `NOT NULL` | Foreign key to the `Products` table          |
| `name`             | `VARCHAR(255)` | `NOT NULL`                         | Variant name (e.g., "Matte Black - Medium")     |
| `sku_suffix`       | `VARCHAR(50)`  |                                    | Suffix to append to base product SKU          |
| `price_modifier`   | `DECIMAL(10,2)`| `DEFAULT 0.00`                     | Price difference from the base product        |
| `stock_quantity`   | `INTEGER`      | `DEFAULT 0`                        | Stock for this specific variant                 |
| `image_url`        | `VARCHAR(255)` |                                    | Image URL specific to this variant (optional) |
| `attributes`       | `JSONB`        |                                    | Key-value pairs for variant attributes (e.g., `{"color": "Matte Black", "size": "Medium"}`) |

## Table: `ProductCategories`

Stores product categories for organization.

| Column          | Data Type      | Constraints                        | Description                                   |
|-----------------|----------------|------------------------------------|-----------------------------------------------|
| `id`            | `UUID`         | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier for the category            |
| `name`          | `VARCHAR(100)` | `UNIQUE`, `NOT NULL`               | Category name (e.g., "Men's Glasses", "Daily Contact Lenses") |
| `description`   | `TEXT`         |                                    | Optional category description                 |
| `parent_id`     | `UUID`         | `REFERENCES ProductCategories(id)`   | For subcategories (self-referencing)          |
| `slug`          | `VARCHAR(100)` | `UNIQUE`, `NOT NULL`               | URL-friendly category slug                    |

**Note:** More tables will be added for `Orders`, `OrderItems`, `Addresses`, `Prescriptions`, `EducationalContent`, `Reviews`, `Brands`, etc., as development progresses. This is an initial structure.
Specifically, `Products.category` might be replaced by a foreign key to `ProductCategories(id)`.
The `ProductVariants.attributes` JSONB field allows flexibility for different types of products having different variant properties.
