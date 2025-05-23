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

| Column                      | Data Type      | Constraints                        | Description                                     |
|-----------------------------|----------------|------------------------------------|-------------------------------------------------|
| `id`                        | `UUID`         | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier for the product             |
| `name`                      | `VARCHAR(255)` | `NOT NULL`                         | Product name                                    |
| `description`               | `TEXT`         |                                    | Detailed product description                    |
| `price`                     | `DECIMAL(10,2)`| `NOT NULL`                         | Product price                                   |
| `sku`                       | `VARCHAR(100)` | `UNIQUE`, `NOT NULL`               | Stock Keeping Unit                            |
| `stock_quantity`            | `INTEGER`      | `NOT NULL`, `DEFAULT 0`            | Available quantity in stock                   |
| `category_id`               | `UUID`         | `REFERENCES ProductCategories(id)`, `NOT NULL` | Foreign key to the `ProductCategories` table |
| `main_image_url`            | `VARCHAR(255)` |                                    | URL for the primary product image               |
| `requires_prescription`     | `BOOLEAN`      | `DEFAULT FALSE`                    | Does this product require a prescription?       |
| `accepted_prescription_types`| `VARCHAR(100)`|                                    | Comma-separated list of accepted prescription types (e.g., "eyeglass", "contact_lens_spherical") |
| `created_at`                | `TIMESTAMPZ`   | `DEFAULT CURRENT_TIMESTAMP`        | Timestamp of product creation                   |
| `updated_at`                | `TIMESTAMPZ`   | `DEFAULT CURRENT_TIMESTAMP`        | Timestamp of last product update                |
| `is_active`                 | `BOOLEAN`      | `DEFAULT TRUE`                     | Whether the product is currently active/visible |

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
The `ProductVariants.attributes` JSONB field allows flexibility for different types of products having different variant properties.

---
## Table: `UserPrescriptions`

Stores user's saved prescriptions, primarily for eyeglasses. Contact lens prescriptions might require a more specialized structure or additional fields.

| Column                   | Data Type       | Constraints                        | Description                                       |
|--------------------------|-----------------|------------------------------------|---------------------------------------------------|
| `id`                     | `UUID`          | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier for the prescription          |
| `user_id`                | `UUID`          | `REFERENCES Users(id) ON DELETE CASCADE`, `NOT NULL` | Foreign key to the `Users` table                |
| `prescription_name`      | `VARCHAR(100)`  |                                    | User-defined name for the prescription (e.g., "My Reading Glasses") |
| `prescription_type`      | `VARCHAR(50)`   | `NOT NULL`                         | Type of prescription (e.g., "eyeglass_single_vision", "eyeglass_progressive") |
| `patient_name`           | `VARCHAR(255)`  | `NOT NULL`                         | Name of the patient on the prescription         |
| `prescriber_name`        | `VARCHAR(255)`  |                                    | Name of the prescribing doctor/clinic           |
| `prescription_date`      | `DATE`          | `NOT NULL`                         | Date the prescription was issued                |
| `expiry_date`            | `DATE`          |                                    | Expiry date of the prescription (optional)      |
| `pd_right`               | `DECIMAL(4,2)`  |                                    | Pupillary Distance for right eye (if single PD) |
| `pd_left`                | `DECIMAL(4,2)`  |                                    | Pupillary Distance for left eye (if single PD)  |
| `pd_both`                | `DECIMAL(4,2)`  |                                    | Pupillary Distance if measured for both eyes together |
| `sphere_right`           | `DECIMAL(4,2)`  | `NOT NULL`                         | Right eye sphere value                          |
| `cylinder_right`         | `DECIMAL(4,2)`  |                                    | Right eye cylinder value                        |
| `axis_right`             | `INTEGER`       |                                    | Right eye axis value (degrees)                  |
| `add_right`              | `DECIMAL(4,2)`  |                                    | Right eye add value (for bifocal/progressive)   |
| `prism_diopters_right`   | `DECIMAL(4,2)`  |                                    | Right eye prism diopters (optional)             |
| `prism_base_direction_right`| `VARCHAR(20)`|                                    | Right eye prism base direction (optional)       |
| `sphere_left`            | `DECIMAL(4,2)`  | `NOT NULL`                         | Left eye sphere value                           |
| `cylinder_left`          | `DECIMAL(4,2)`  |                                    | Left eye cylinder value                         |
| `axis_left`              | `INTEGER`       |                                    | Left eye axis value (degrees)                   |
| `add_left`               | `DECIMAL(4,2)`  |                                    | Left eye add value (for bifocal/progressive)    |
| `prism_diopters_left`    | `DECIMAL(4,2)`  |                                    | Left eye prism diopters (optional)              |
| `prism_base_direction_left`| `VARCHAR(20)`|                                    | Left eye prism base direction (optional)        |
| `notes`                  | `TEXT`          |                                    | Any additional notes or optometrist instructions|
| `uploaded_file_url`      | `VARCHAR(255)`  |                                    | URL to an uploaded prescription file (optional) |
| `created_at`             | `TIMESTAMPZ`    | `DEFAULT CURRENT_TIMESTAMP`        | Timestamp of prescription creation              |
| `updated_at`             | `TIMESTAMPZ`    | `DEFAULT CURRENT_TIMESTAMP`        | Timestamp of last prescription update           |

**Notes on `UserPrescriptions`:**
*   This table is quite detailed for eyeglasses. A `prescription_data JSONB` field could be an alternative for more flexibility, but explicit columns offer better type safety and querying for common values.
*   For PD (Pupillary Distance), providing fields for Right, Left, and Both allows for different measurement methods. Typically only one set would be filled.
*   Prism values are optional and less common.
*   Contact lens prescriptions often include `Base Curve (BC)`, `Diameter (DIA)`, `Brand/Material`, and are per-eye. If supporting saved contact lens prescriptions, a separate table `UserContactLensPrescriptions` or a very flexible structure (e.g., using JSONB) would be better. For now, `accepted_prescription_types` on the product can guide what's expected.
---
## Table: `EducationalArticles`

Stores educational articles and guides.

| Column             | Data Type      | Constraints                        | Description                                     |
|--------------------|----------------|------------------------------------|-------------------------------------------------|
| `id`               | `UUID`         | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier for the article               |
| `title`            | `VARCHAR(255)` | `NOT NULL`                         | Article title                                   |
| `slug`             | `VARCHAR(255)` | `UNIQUE`, `NOT NULL`               | URL-friendly slug for the article               |
| `content_summary`  | `TEXT`         |                                    | A short summary or excerpt of the article       |
| `content_full`     | `TEXT`         | `NOT NULL`                         | Full content of the article (e.g., Markdown, HTML) |
| `category_id`      | `UUID`         | `REFERENCES EducationalArticleCategories(id)` (Optional) | Foreign key to an article categories table |
| `author_name`      | `VARCHAR(100)` |                                    | Name of the article author                      |
| `image_url`        | `VARCHAR(255)` |                                    | URL for a feature image for the article         |
| `published_at`     | `TIMESTAMPZ`   | `DEFAULT CURRENT_TIMESTAMP`        | Timestamp when the article was published        |
| `is_featured`      | `BOOLEAN`      | `DEFAULT FALSE`                    | Whether the article is featured                 |
| `created_at`       | `TIMESTAMPZ`   | `DEFAULT CURRENT_TIMESTAMP`        | Timestamp of article creation                   |
| `updated_at`       | `TIMESTAMPZ`   | `DEFAULT CURRENT_TIMESTAMP`        | Timestamp of last article update                |

## Table: `EducationalArticleCategories` (Optional - for categorizing articles)

| Column          | Data Type      | Constraints                        | Description                                   |
|-----------------|----------------|------------------------------------|-----------------------------------------------|
| `id`            | `UUID`         | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier for the category            |
| `name`          | `VARCHAR(100)` | `UNIQUE`, `NOT NULL`               | Category name (e.g., "Eye Conditions", "Lens Guide") |
| `slug`          | `VARCHAR(100)` | `UNIQUE`, `NOT NULL`               | URL-friendly category slug                    |
| `description`   | `TEXT`         |                                    | Optional category description                 |

---
