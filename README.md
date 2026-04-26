# Bakery Management System (BMS) – Complete Documentation

## Overview

The **Bakery Management System (BMS)** is a full-featured web application designed specifically for bakery businesses to manage their entire operations digitally. From product catalog and inventory management to production planning, point of sale, customer management, and reporting, BMS provides a complete solution for bakery owners, branch managers, and staff.

Unlike generic ERP systems, BMS is tailored for bakeries with features like raw material consumption tracking, production batch management, recipe-based inventory deduction, and multi-branch support. The system implements strict role-based access control, ensuring that each user sees only the data and functions relevant to their role.

---

## Complete Feature Breakdown

### 1. Dashboard Module

The dashboard provides real-time business intelligence and key performance indicators (KPIs).

**For Admin:**
- Global Staff Count – Total active users across all branches
- Product Master Count – Total products in catalog
- Total Revenue – Sum of all order amounts across all branches
- Stock Alerts – Number of items below reorder level
- Payment Status Chart – Doughnut chart showing paid vs pending orders
- Critical Inventory Table – Lists low-stock items with branch location

**For Branch Manager:**
- Branch-specific metrics (revenue, transaction count, kitchen activity, stock alerts)
- Local Sales Trend chart (cash vs digital payments)
- Recent counter activity (last 5 orders with details)

**For Staff:**
- Order management interface (not a numeric dashboard)

### 2. Product Management

The products module manages all finished goods sold in the bakery.

**Key Features:**
- Add, edit, view, and block/unblock products
- Upload product images (stored in `/media/products/`)
- Set cost price, base price (selling price), and product code (SKU)
- Define recipe instructions (text description for production)
- Assign unit of measure (PCS, LOAF, KG, etc.)
- Products inherit branch visibility from their category
- Search products by name or code
- Filter products by category

**Business Logic:**
- Only admin and managers can create/edit products
- Products are visible to a branch only if their category is assigned to that branch
- Blocking a product hides it from POS and reports

### 3. Category Management

Categories organize products into logical groups (e.g., Breads, Cookies, Pastries, Cakes).

**Key Features:**
- Add, edit, view categories
- Assign category code (e.g., BRD, COO, PAS)
- Activate categories for specific branches (branch activation)
- Global categories (no branch restriction) appear as "All Branches"

**Business Logic:**
- Only admin can manage categories (managers can view only)
- Products inherit branch mapping from their category
- Deleting a category cascades to its products

### 4. Inventory Management

The inventory module tracks stock levels for both raw materials and finished goods.

**Key Features:**
- Unified view of raw materials and finished goods
- Type filter (All Types / Finished Goods / Raw Materials)
- Category filter based on product categories and raw material categories
- Stock level monitoring with visual LOW indicators
- Reorder level threshold configuration
- REORDER workflow:
  - Manager clicks REORDER → status becomes "Pending"
  - Enter quantity to reorder
  - When goods arrive, click FULFILL → stock increased, status reset
- Edit stock parameters (reorder level, current quantity)

**Business Logic:**
- Inventory is branch-specific (each branch maintains its own stock)
- Low stock alerts trigger when quantity ≤ reorder level
- Raw materials are consumed automatically during production (when recipes are defined)
- Finished goods are decremented during POS sales
- Both raw materials and finished goods are linked through `item_mst` bridge table

### 5. Production Planning

Production planning allows managers to schedule batch production and assign bakers.

**Key Features:**
- Create production plans with product, quantity, start/due dates
- Assign to specific baker or service truck staff
- Auto-route branch based on assigned staff's home branch
- View, edit, and delete plans
- Recipe button shows product's recipe instructions

**Business Logic:**
- Admin sees all plans globally
- Managers see plans for their branch only
- Bakers see only their personal assignments
- Plan statuses: Pending → In Progress → Completed

### 6. Production (Kitchen View)

The production module is the baker's interface for executing production plans.

**Key Features:**
- Bakers see only their assigned active plans
- Start Production button (changes status to "In Progress")
- Finish Production with actual yield quantity
- Live progress view for managers
- Stock validation before completion

**Critical Business Logic:**
- When a production batch is marked "Completed":
  - Raw materials are consumed based on `raw_material_recipe`
  - Finished goods inventory increases
  - Production history is recorded
  - If insufficient raw materials, transaction is rolled back with error

### 7. Orders (Point of Sale)

The POS module is the primary interface for cashiers and sales staff to process customer orders.

**Key Features:**
- Product grid with images, prices, and stock status
- Real-time search by product name or code
- Cart management (add/remove items, adjust quantities)
- Customer selection (existing or quick registration)
- Payment mode selection (cash, UPI, card)
- Order summary table for admin/manager (history view)
- Branch filter for admin to see orders from specific branches
- Order cancellation (restores inventory)
- Print receipt functionality

**Business Logic:**
- Only staff (cashier/sales) can access POS mode
- Admin and managers see order history only
- Orders are branch-specific (automatically assigned)
- Order creation reduces finished goods inventory
- Cancellation restores inventory

### 8. Customer Management

Maintain customer profiles for walk-in and repeat customers.

**Key Features:**
- View customer list with branch assignment
- Search by name or phone number
- Branch filter for admin (global view)
- Add new customer (staff only, during POS or via dedicated page)
- Edit customer details (staff only)
- View-only mode for admin/manager

**Business Logic:**
- Admin sees all customers globally
- Branch manager sees only branch customers
- Staff can add/edit customers and assign to their branch
- Bakers have no access
- Customers can be created on the fly during POS

### 9. Supplier Management

Track vendors who supply raw materials and packaging.

**Key Features:**
- Add, edit, view, block/unblock suppliers
- GSTIN validation (Gujarat format: 24 + 5 letters + 4 digits + 1 letter + 1 digit + Z + 1 alphanumeric)
- Phone number validation (10 digits, starts with 6-9)
- Multi-branch assignment via checkboxes (supplier can serve multiple branches)
- Global suppliers (no branch restriction) appear as "All Branches"
- City selection
- Email and address fields

**Business Logic:**
- Admin sees all suppliers globally, can add/edit/block
- Branch manager sees suppliers assigned to their branch PLUS global suppliers (view only)
- Multi-branch assignment via `supplier_branch_map` junction table

### 10. Branch Management

Multi-branch support for bakery chains.

**Key Features:**
- Add, edit, disable/enable branches
- Branch details: name, address, phone, city
- Status indicator (Active/Inactive)

**Business Logic:**
- Only admin can access branch management
- Branch manager cannot access this module
- Inactive branches are filtered from selections
- Every user belongs to a branch

### 11. User Management

Staff administration with role assignment.

**Key Features:**
- Add new staff (admin-only)
- Edit staff profiles, change roles
- Block/unblock staff
- Administrator verification required for sensitive operations
- Temporary OTP generation for new users
- Branch assignment

**Roles Available:**
- **Admin** – Full system access
- **Branch Manager** – Branch-specific operational access
- **Baker** – Production and basic inventory view
- **Service Staff** – POS and customer management

### 12. Issue Management

Track and resolve operational problems.

**Key Features:**
- Report issues with category, severity, description
- Select recipient(s) via checkboxes:
  - Admin only
  - Branch Manager only
  - Both (Admin & Manager)
- Update resolution status (open → in progress → resolved → closed)
- View issue details
- Auto-assign reporter and branch

**Business Logic:**
- Admin sees all issues globally
- Branch manager sees issues from their branch + those assigned to them + issues they reported
- Baker/staff see only issues they reported
- Only admin or designated recipient can update status

### 13. Reports Module

Generate PDF reports for analysis and auditing.

**Report Types:**
- Orders Audit
- Customer Master
- Product Catalog
- Categories Master
- Inventory Analysis
- Production Batches
- Production Schedules
- Incident Log
- Vendor Directory
- Branch Registry
- System User Audit

**Features:**
- Branch scope filter (global or specific branch)
- Date range filters (where applicable)
- Status filters
- Category filters
- Executive summary section
- Key metrics dashboard
- Detailed data tables
- PDF export with print functionality

### 14. Profile Management

Staff can manage their own profile and password.

**Key Features:**
- View personal details (read-only)
- Edit profile (name, phone, address, etc.)
- Change password
- Identity verification required (current password + security key)

**Business Logic:**
- Security key is provided during account activation
- Both old password and security key must match to update profile
- Password change requires old password + new password + security key

---

## Role-Based Access Control (Detailed)

### Admin
| Module | Access Level |
|--------|--------------|
| Dashboard | Full global view |
| Branches | Full CRUD |
| Users | Full CRUD, role assignment |
| Suppliers | Full CRUD, branch assignment, block/unblock |
| Categories | Full CRUD, branch activation |
| Products | Full CRUD, block/unblock |
| Production Planning | Full CRUD |
| Production | View all |
| Inventory | Full CRUD, reorder management |
| Orders | History view, cancel |
| Customers | Global view (read-only) |
| Issues | Full CRUD, status update |
| Reports | Generate all reports |
| Profile | Self-management |

### Branch Manager
| Module | Access Level |
|--------|--------------|
| Dashboard | Branch-specific view |
| Suppliers | View branch + global suppliers (read-only) |
| Categories | View branch categories (read-only) |
| Products | View branch products (read-only) |
| Production Planning | Create, edit, delete (branch only) |
| Production | View all (branch only) |
| Inventory | Full CRUD, reorder management (branch only) |
| Orders | History view, cancel (branch only) |
| Customers | View branch customers (read-only) |
| Issues | Report, view branch issues, update status of assigned issues |
| Reports | Generate branch reports |
| Profile | Self-management |

### Baker
| Module | Access Level |
|--------|--------------|
| Production Planning | View personal assignments |
| Production | View, start, finish personal batches |
| Inventory | View (branch only) |
| Issues | Report, view own reports |
| Profile | Self-management |

### Staff (Cashier/Sales)
| Module | Access Level |
|--------|--------------|
| Orders | POS, history view, cancel |
| Customers | Add, edit, view (branch only) |
| Issues | Report, view own reports |
| Profile | Self-management |

---

## Technical Architecture

### Backend Architecture (Django REST Framework)

```
bms_backend/
├── manage.py
├── bms_backend/
│   ├── settings.py          # Django configuration
│   ├── urls.py              # Main URL routing
│   └── wsgi.py
└── api/
    ├── models.py            # Unmanaged models (mirror MySQL)
    ├── views.py             # API views and viewsets
    ├── serializers.py       # DRF serializers
    ├── urls.py              # API endpoint routing
    ├── backends.py          # Custom authentication backend
    └── admin.py
```

### Frontend Architecture

```
js/
├── app.js                   # Main application entry, sidebar rendering
├── state.js                 # Global state management, data fetching
├── router.js                # Navigation logic, view routing
├── api.js                   # HTTP client with authentication
├── auth.js                  # Login, activation, password reset
└── views/
    ├── dashboard/           # Admin and manager dashboards
    ├── products.js          # Product management
    ├── categories.js        # Category management
    ├── inventory.js         # Inventory management
    ├── orders.js            # POS and order history
    ├── customers.js         # Customer management
    ├── suppliers.js         # Supplier management
    ├── branches.js          # Branch management
    ├── users.js             # User management
    ├── issues.js            # Issue reporting and tracking
    ├── production.js        # Kitchen production view
    ├── productionPlanning.js # Production scheduling
    ├── reports.js           # Report generation
    └── profile.js           # User profile management
```

### Database Schema Highlights

**Core Tables:**
- `user_mst` – Users with role, branch, security key
- `branch_mst` – Branches with contact details
- `category_mst` – Product categories with branch activation via `category_branch_map`
- `product_mst` – Finished goods with category FK, pricing, images
- `raw_material_mst` – Raw materials with unit and category
- `raw_material_recipe` – Maps finished goods to required raw materials and quantities
- `item_mst` – Bridge table unifying raw materials and products for inventory
- `inventory_mst` – Branch-level stock quantities and reorder levels
- `order_mst` / `order_items` – Sales transactions
- `production_plan` – Scheduled production batches
- `production_mst` – Completed production records
- `supplier_mst` / `supplier_branch_map` – Suppliers with multi-branch assignment
- `issue_mst` – Operational issues with reporter, recipient, status
- `customer_mst` – Customer profiles linked to branch

### Data Flow

1. **Product Creation:**
   - Admin creates product → assigned to category
   - Category determines branch visibility → product inherits branch mapping
   - Product is automatically added to `item_mst` for inventory tracking

2. **Production:**
   - Manager creates plan → assigned to baker
   - Baker starts plan → status "In Progress"
   - Baker finishes with actual quantity → system checks `raw_material_recipe`
   - Raw material inventory decreased, finished goods inventory increased
   - Production history recorded

3. **Sales (POS):**
   - Staff selects products → added to cart
   - Customer selected/created → order finalized
   - Finished goods inventory decreased
   - Order saved with branch and user reference

4. **Inventory Reorder:**
   - Manager triggers REORDER → status "Pending"
   - Supplier delivers → FULFILL → stock increased
   - Reorder status reset

---

## Installation Guide

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Python | 3.14+ |
| MySQL | 8.0+ |
| pip | Latest |
| Git | Latest |

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bakery-management-system.git
   cd bakery-management-system
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install django djangorestframework django-cors-headers mysqlclient pillow
   ```

4. **Configure database**
   - Create MySQL database
   - Import your existing schema (or run provided SQL scripts)
   - Update `bms_backend/settings.py` with database credentials

5. **Create media directory**
   ```bash
   mkdir media
   mkdir media/products
   ```

6. **Run migrations (only if using Django migrations)**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
   *Note: If using `managed = False`, this may not be needed.*

7. **Start the backend server**
   ```bash
   python manage.py runserver
   ```

8. **Serve frontend**
   - Open frontend files using Live Server (VS Code extension) or any static server
   - Ensure frontend runs on port 5502 (or update CORS settings)

### Configuration Files

**`bms_backend/settings.py` - Key Settings:**
```python
# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'testbms',
        'USER': 'root',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}

# CORS
CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:5502",
    "http://localhost:5502",
]

# Media
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

---

## API Documentation

### Authentication

**POST /api/login/**
```json
Request:
{
    "username": "admin",
    "password": "Admin@123#"
}

Response:
{
    "id": 1,
    "user_name": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"
}
```

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/` | List all products (branch-filtered) |
| POST | `/api/products/` | Create new product (admin/manager) |
| PATCH | `/api/products/{id}/` | Update product |
| GET | `/api/categories/` | List categories (branch-filtered) |
| POST | `/api/categories/` | Create category (admin) |
| GET | `/api/inventory/` | List inventory (branch-filtered) |
| POST | `/api/inventory/` | Add inventory item |
| PATCH | `/api/inventory/{id}/` | Update inventory (reorder, stock adjustment) |
| GET | `/api/orders/` | List orders (branch-filtered) |
| POST | `/api/orders/` | Create order (POS) |
| DELETE | `/api/orders/{id}/` | Cancel order |
| GET | `/api/customers/` | List customers (branch-filtered) |
| POST | `/api/customers/` | Create customer |
| GET | `/api/suppliers/` | List suppliers (branch-filtered) |
| POST | `/api/suppliers/` | Create supplier |
| GET | `/api/production-plan/` | List production plans |
| POST | `/api/production-plan/` | Create production plan |
| PATCH | `/api/production-plan/{id}/` | Update plan status |
| GET | `/api/production/` | List production history |
| POST | `/api/production/` | Record production |
| GET | `/api/issues/` | List issues (role-filtered) |
| POST | `/api/issues/` | Create issue |
| PATCH | `/api/issues/{id}/` | Update issue status |
| GET | `/api/users/` | List users (admin only) |
| POST | `/api/users/` | Create user (admin) |
| PATCH | `/api/users/{id}/` | Update user |
| GET | `/api/branches/` | List branches (admin only) |
| POST | `/api/branches/` | Create branch |
| GET | `/api/reports-data/` | Generate reports |

---

## Frontend Usage Guide

### Login Process
1. Enter username and password
2. Select role (for verification)
3. On first login, system will require password and security key setup
4. Token is stored in localStorage for subsequent requests

### Navigation
- Sidebar menu is dynamically generated based on user role
- Click any menu item to navigate
- Active page is highlighted in sidebar

### POS Workflow
1. Click "NEW SALE (POS)" button (staff only)
2. Browse/search products, click to add to cart
3. Adjust quantities using +/- buttons
4. Select customer (or click "+ REGISTER NEW" to add)
5. Select payment mode
6. Click "FINALIZE & PRINT" to complete order
7. Receipt can be printed (Ctrl+P)

### Production Workflow (Baker)
1. View personal production plans in "Production" page
2. Click "Start Production" to begin batch
3. After completing, enter actual yield quantity
4. Click "Finish" to complete production
5. System automatically consumes raw materials and updates finished goods inventory

### Issue Reporting
1. Click "REPORT NEW ISSUE"
2. Select recipient(s) via checkboxes
3. Choose category and severity
4. Write description
5. Submit – issue is routed to appropriate personnel

---

## Troubleshooting Common Issues

### Issue: Products not showing in POS
**Solution:** Ensure `state.products` is populated. The POS uses `setTimeout` to delay grid population until data is loaded. If still empty, check `refreshGlobalState()` execution.

### Issue: Images not loading
**Solution:** Check that:
- Images are stored in `media/products/` folder
- `image_url` in database starts with `products/filename.png`
- Frontend uses `image_full_url` first, then constructs proper URL

### Issue: Verification failed during profile update
**Solution:** Ensure you are entering:
- Your current password (not the target user's password)
- Your 6-digit security key (provided during account activation)
- Both fields are correct and not empty

### Issue: Raw materials not deducted during production
**Solution:** Check that:
- `raw_material_recipe` table has entries for the product
- Required raw materials have sufficient stock
- Inventory records exist for raw materials

### Issue: Supplier not showing for branch manager
**Solution:** Ensure:
- Supplier has `branch_ids` assigned (or is global with no branches)
- `SupplierViewSet.get_queryset` includes `Q(branches__id=branch_id) | Q(branches__isnull=True)`

### Issue: Manual database changes not reflecting
**Solution:** Either:
- Refresh the page (F5)
- Navigate to a page that triggers `refreshGlobalState()` (dashboard, inventory, orders, etc.)
- Add the module to `modulesRequiringSync` in `router.js`

---

## Performance Considerations

- **State Management:** Global state is stored in JavaScript and updated via `refreshGlobalState()`.
- **API Calls:** Full state refresh makes multiple parallel API calls. For large datasets, consider pagination.
- **Image Loading:** Product images are loaded asynchronously; fallback icon appears if image fails.
- **Inventory Filtering:** Uses client-side filtering after data is loaded.

---

## Security Features

- **Token Authentication:** All API requests require valid token.
- **CSRF Protection:** CSRF token is included in state-changing requests.
- **Password Hashing:** Passwords are stored as Django PBKDF2 hashes.
- **Security Keys:** Users have a security key for sensitive operations.
- **Role-Based Access:** Both frontend and backend enforce RBAC.
- **Branch Isolation:** Data is automatically filtered by branch for non-admin users.

---

## Future Enhancements

- [ ] Purchase order management for raw materials
- [ ] Barcode scanning for POS
- [ ] Customer loyalty program
- [ ] Advanced analytics dashboard with more charts
- [ ] Email notifications for low stock alerts
- [ ] Mobile app for bakers (production updates)
- [ ] Integration with accounting software
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Export reports to Excel

---

## Support

For issues, feature requests, or questions:
- **GitHub Issues:** [repository-url]/issues
- **Email:** support@bakeryms.com

---

## Contributors

- Project Lead & Developer

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-04-13 | Initial release |

---

**© 2026 Bakery Management System. All rights reserved.**