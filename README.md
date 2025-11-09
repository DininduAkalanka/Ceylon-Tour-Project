<div align="center">

# 🌴 Ceylon Tour.com - Sri Lanka Travel Experience Platform

[![PHP Version](https://img.shields.io/badge/PHP-7.4%2B-blue.svg)](https://php.net)
[![MySQL](https://img.shields.io/badge/MySQL-5.7%2B-orange.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**A comprehensive tourism management web application for Sri Lankan tour packages, bookings, and customer engagement.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Screenshots](#-screenshots) • [API Documentation](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#-usage)
- [Screenshots](#-screenshots)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Security](#-security)
- [Performance Optimization](#-performance-optimization)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)
- [Acknowledgments](#-acknowledgments)

---

## 🎯 About The Project

**Ceylon Tour.com** is a full-stack web application designed to showcase Sri Lankan tourism packages, handle bookings, manage customer inquiries, and collect feedback. The platform features a modern, responsive design with enhanced user experience, SEO optimization, and secure backend processing.

- **Live Demo**: https://ceylontour.infinityfreeapp.com/

### 🎨 Design Philosophy

- **User-Centric Design**: Intuitive navigation and mobile-responsive interface
- **Performance First**: Optimized loading times with caching and compression
- **Security by Default**: Input validation, SQL injection protection, and secure configurations
- **SEO Optimized**: Structured data, meta tags, and semantic HTML
- **Accessibility**: ARIA labels, keyboard navigation, and WCAG compliance

---

## ✨ Key Features

### 🏖️ Tour Management
- ✅ Multiple tour package showcases (Beach holidays, Cultural tours, Wildlife safaris)
- ✅ Detailed package information with image galleries
- ✅ Interactive booking system with date selection
- ✅ Real-time availability checking
- ✅ Customizable tour itineraries

### 📞 Customer Engagement
- ✅ Contact form with email notifications
- ✅ Customer feedback and rating system
- ✅ WhatsApp integration for instant messaging
- ✅ Live chat support (Tidio integration)
- ✅ Newsletter subscription

### 🎨 User Experience
- ✅ Dark mode toggle
- ✅ Responsive mobile-first design
- ✅ Image sliders and galleries (Swiper.js)
- ✅ Smooth animations and transitions
- ✅ Package filtering and search functionality
- ✅ FAQ accordion sections

### 🔐 Security Features
- ✅ SQL injection prevention (Prepared statements)
- ✅ XSS protection with input sanitization
- ✅ CSRF protection headers
- ✅ Secure environment variable management
- ✅ Apache security configurations (.htaccess)
- ✅ Rate limiting ready

### 📧 Email System
- ✅ Automated booking confirmations
- ✅ Contact form notifications
- ✅ Feedback acknowledgments
- ✅ HTML email templates
- ✅ SMTP integration (Gmail/Custom)

### 📊 Analytics & Tracking
- ✅ WhatsApp button click tracking
- ✅ Form submission logging
- ✅ User behavior analytics ready
- ✅ IP address and user agent tracking

---

## 🛠️ Tech Stack

### **Backend**
| Technology | Version | Purpose |
|------------|---------|---------|
| ![PHP](https://img.shields.io/badge/PHP-777BB4?logo=php&logoColor=white) | 7.4+ | Server-side logic |
| ![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white) | 5.7+ | Database management |
| ![Apache](https://img.shields.io/badge/Apache-D22128?logo=apache&logoColor=white) | 2.4+ | Web server |
| ![Composer](https://img.shields.io/badge/Composer-885630?logo=composer&logoColor=white) | 2.x | Dependency manager |

**PHP Libraries:**
- **PHPMailer** v6.10.0 - SMTP email sending
- **MySQLi** - Database connectivity

### **Frontend**
| Technology | Purpose |
|------------|---------|
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) | Semantic markup |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) | Styling & animations |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black) | Interactivity (ES6+) |
| **Swiper.js** v12 | Image sliders |
| **Font Awesome** v6.1.1 | Icon library |
| **Google Fonts** | Typography (Poppins) |

### **Database**
```sql
📦 MySQL 5.7+
├── contact_messages      # Customer inquiries
├── bookings              # Tour reservations
└── customer_feedback     # Reviews and ratings
```

### **Development Tools**
- **Git** - Version control
- **Composer** - PHP package management
- **VS Code** - Recommended IDE
- **Apache/XAMPP** - Local development server

---

## 🏗️ Architecture

### **Project Structure**
```
Ceylon-Tour-Project/
│
├── 📁 backend/                    # Server-side logic
│   ├── 📁 api/                   # REST-like API endpoints
│   │   ├── contact-process.php
│   │   ├── process_booking.php
│   │   ├── process_feedback.php
│   │   └── whatsapp_notification.php
│   ├── 📁 includes/              # Shared utilities
│   │   ├── setup_database.php
│   │   ├── contact_table.sql
│   │   └── customer_feedback_table.sql
│   └── 📁 models/                # (Reserved for future ORM)
│
├── 📁 config/                     # Configuration management
│   ├── Config.php                # Environment loader
│   ├── email_config.php          # SMTP settings
│   └── composer.json             # PHP dependencies
│
├── 📁 frontend/                   # Client-side code
│   ├── 📁 assets/
│   │   ├── 📁 css/              # Modular stylesheets (20+ files)
│   │   ├── 📁 js/               # JavaScript modules (18+ files)
│   │   ├── 📁 images/           # Image assets
│   │   ├── 📁 image-gallery/    # Tour photos
│   │   └── 📁 video/            # Video content
│   └── 📁 views/
│       └── 📁 pages/            # HTML templates
│           ├── index.php
│           ├── contact_us.php
│           ├── feedback.php
│           └── [tour packages].php
│
├── 📁 public/                     # Web root (Document root)
│   ├── index.php                 # Front controller
│   └── .htaccess                 # Public routing rules
│
├── 📁 PHPMailer-master/           # Email library
├── 📁 vendor/                     # Composer dependencies
├── 📁 screenshot/                 # Project screenshots
├── 📁 storage/                    # Runtime data
│   ├── 📁 logs/                  # Application logs
│   └── 📁 uploads/               # User uploads
│
├── .env.example                   # Environment template
├── .htaccess                      # Root Apache config
├── composer.json                  # Dependency manifest
└── README.md                      # This file
```

### **Design Pattern**
- **MVC-Inspired**: Separation of concerns (Model-View-Controller principles)
- **Front Controller**: Single entry point (`public/index.php`)
- **Service Layer**: API endpoints in `backend/api/`
- **Configuration Management**: Environment-based settings

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

```bash
✅ PHP >= 7.4 (Recommended: 8.0+)
✅ MySQL >= 5.7 or MariaDB >= 10.3
✅ Apache 2.4+ with mod_rewrite enabled
✅ Composer (PHP dependency manager)
✅ Git
```

**Check your PHP version:**
```bash
php -v
```

**Check MySQL version:**
```bash
mysql --version
```

### Installation

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/DininduAkalanka/Ceylon-Tour-Project.git
cd Ceylon-Tour-Project
```

#### 2️⃣ Install PHP Dependencies
```bash
composer install
```

#### 3️⃣ Set Up Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your credentials (use nano, vim, or any text editor)
nano .env
```

**Configure your `.env` file:**
```env
# Database Configuration
DB_HOST=localhost
DB_NAME=tour_database
DB_USER=your_db_user
DB_PASS=your_secure_password

# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=tls
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password
FROM_EMAIL=your_email@gmail.com
FROM_NAME=Ceylon Tour.com
REPLY_TO=your_email@gmail.com

# Application Settings
APP_ENV=development
DEBUG_MODE=true
```

> **📝 Note:** For Gmail, you need to generate an **App Password**:
> 1. Enable 2-Factor Authentication on your Google Account
> 2. Go to [Google Account → Security → App Passwords](https://myaccount.google.com/apppasswords)
> 3. Generate a new app password for "Mail"
> 4. Use this 16-character password in `SMTP_PASSWORD`

#### 4️⃣ Create Database
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE tour_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create user (optional but recommended)
CREATE USER 'tour_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON tour_database.* TO 'tour_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 5️⃣ Import Database Schema
```bash
# Import contact messages table
mysql -u your_db_user -p tour_database < backend/includes/contact_table.sql

# Import customer feedback table
mysql -u your_db_user -p tour_database < backend/includes/customer_feedback_table.sql
```

**Or manually create tables using `setup_database.php`** (if provided).

#### 6️⃣ Configure Apache Virtual Host (Optional)

**For local development, add to your Apache config or `httpd-vhosts.conf`:**

```apache
<VirtualHost *:80>
    ServerName ceylontour.local
    DocumentRoot "C:/path/to/Ceylon-Tour-Project/public"
    
    <Directory "C:/path/to/Ceylon-Tour-Project/public">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog "logs/ceylontour-error.log"
    CustomLog "logs/ceylontour-access.log" common
</VirtualHost>
```

**Add to your `hosts` file:**
```
127.0.0.1  ceylontour.local
```

#### 7️⃣ Set File Permissions (Linux/Mac)
```bash
chmod -R 755 storage/
chmod -R 755 storage/logs/
chmod -R 755 storage/uploads/
chmod 600 .env
```

#### 8️⃣ Test Email Configuration
```bash
# Open in browser:
http://localhost/backend/includes/test_email.php
```

### Configuration

#### Apache `.htaccess` Setup
Ensure `mod_rewrite` is enabled:
```bash
# Ubuntu/Debian
sudo a2enmod rewrite
sudo systemctl restart apache2

# Check if enabled
apache2ctl -M | grep rewrite
```

#### PHP Configuration
Edit your `php.ini`:
```ini
; Recommended settings
upload_max_filesize = 10M
post_max_size = 10M
max_execution_time = 60
memory_limit = 256M

; Enable required extensions
extension=mysqli
extension=mbstring
extension=openssl
```

---

## 💻 Usage

### Starting the Application

#### **Using XAMPP/WAMP**
1. Start Apache and MySQL from XAMPP Control Panel
2. Place project in `htdocs/` directory
3. Access: `http://localhost/Ceylon-Tour-Project/public/`

#### **Using PHP Built-in Server (Development)**
```bash
cd public
php -S localhost:8000
```
Access: `http://localhost:8000`

#### **Using Apache Virtual Host**
```
http://ceylontour.local
```

### Common Operations

#### **Testing Contact Form**
1. Navigate to `Contact Us` page
2. Fill in form fields
3. Submit and check email inbox
4. Verify database entry:
   ```sql
   SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5;
   ```

#### **Making a Booking**
1. Browse tour packages
2. Select a package
3. Fill booking form with:
   - Full name
   - Email
   - Phone number
   - Travel date
   - Number of travelers
4. Submit and receive confirmation email

#### **Submitting Feedback**
1. Go to Feedback page
2. Rate your experience (1-5 stars)
3. Provide comments
4. Submit review

#### **Enabling Dark Mode**
- Click the dark mode toggle button in the header
- Preference saved in localStorage

---

## 📸 Screenshots

### 🏠 Homepage
<!-- Add screenshot here -->
![Homepage](screenshot/home.PNG)
*Modern hero secti<img width="1344" height="678" alt="Screenshot 2025-11-09 025536" src="https://github.com/user-attachments/assets/dc2d6562-6780-4399-bcf2-04b088d705f9" />
on with tour package highlights and call-to-action buttons*

### 🎒 Adventure Packages
<!-- Add screenshot here -->
![Adventure Packages](screenshot/adventure.PNG)
*Browse various tour packages with interac<img width="1352" height="624" alt="Screenshot 2025-11-09 025606" src="https://github.com/user-attachments/assets/795b92ad-1885-450a-b139-c3f4ef8f60f5" />
tive cards and filters*

### 📦 Package Details - Page 1
<!-- Add screenshot here -->
![Package Details 1](screenshot/package1.PNG)
*Detailed tour information with image galleries, iti<img width="1347" height="625" alt="Screenshot 2025-11-09 025646" src="https://github.com/user-attachments/assets/bbe42d46-bca8-4abe-9aeb-e8ec28a87e7f" />
neraries, and booking options*

### 📦 Package Details - Page 2
<!-- Add screenshot here -->
![Package Details 2](screenshot/package2.PNG)
*Additional package information, p<img width="1347" height="629" alt="Screenshot 2025-11-09 025711" src="https://github.com/user-attachments/assets/6ebf5ae5-e5bd-45d3-80f6-ff6e58f513d8" />
ricing breakdown, and customer reviews*

### 📞 Contact Us
<!-- Add screenshot here -->
![Contact Page](screenshot/contact.PNG)
*Contact form with real-time validation and Google M<img width="1326" height="621" alt="Screenshot 2025-11-09 025826" src="https://github.com/user-attachments/assets/e8441f21-ce78-4c13-bf40-dbf63f8a81a6" />
aps integration*

### 💾 Database - Contact Messages
<!-- Add screenshot here -->
![Database](screenshot/database_contact.PNG)
*Admin view of contact submissions <img width="1347" height="645" alt="Screenshot 2025-11-09 030138" src="https://github.com/user-attachments/assets/0f4d0566-229f-4ed2-9e89-59b1a877867e" />
with timestamps and status tracking*

### 🦶 Footer Section
<!-- Add screenshot here -->
![Footer](screenshot/footer.PNG)
*Comprehensive footer with quick links, soc<img width="1350" height="508" alt="Screenshot 2025-11-09 025841" src="https://github.com/user-attachments/assets/1c4f7b0b-266b-4ecd-8767-79311e62ac73" />
ial media, and contact information*

> **📝 Note:** All screenshots are located in the `/screenshot/` directory.

---

## 🔌 API Endpoints

### Base URL
```
http://yourdomain.com/backend/api/
```

###  Contact Form Submission
```http
POST /backend/api/contact-process.php
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+94771234567",
  "subject": "Tour Inquiry",
  "message": "I'm interested in the 5-day tour package."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you! Your message has been sent successfully."
}
```

###  Booking Submission
```http
POST /backend/api/process_booking.php
Content-Type: application/x-www-form-urlencoded
```

**Request Parameters:**
- `fullName` (string, required)
- `email` (string, required, valid email)
- `phone` (string, optional)
- `packageSelect` (string, required)
- `travelDate` (date, required, YYYY-MM-DD)
- `numTravelers` (integer, required, 1-20)
- `message` (text, optional)

**Response:**
```json
{
  "success": true,
  "message": "Booking confirmed! Check your email for details.",
  "bookingId": 12345
}
```

###  Feedback Submission
```http
POST /backend/api/process_feedback.php
```

**Request Parameters:**
- `fullName` (string, required)
- `email` (string, required)
- `phone` (string, optional)
- `tourPackage` (string, required)
- `rating` (integer, 1-5, required)
- `service_rating` (integer, 1-5, optional)
- `feedback` (text, required)

**Response:**
```json
{
  "success": true,
  "message": "Thank you for your feedback!"
}
```

### 📱 WhatsApp Notification
```http
POST /backend/api/whatsapp_notification.php
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "WhatsApp button clicked",
  "timestamp": "2025-11-09 14:30:00"
}
```

---

## 🔐 Security

### Implemented Security Measures

#### ✅ Input Validation & Sanitization
```php
// XSS Prevention
$clean_input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');

// Email Validation
filter_var($email, FILTER_VALIDATE_EMAIL);
```

#### ✅ SQL Injection Prevention
```php
// Prepared Statements
$stmt = $conn->prepare("INSERT INTO bookings (...) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $email, $phone);
$stmt->execute();
```

#### ✅ CSRF Protection Headers
```apache
# In .htaccess
Header set X-Frame-Options "SAMEORIGIN"
Header set X-XSS-Protection "1; mode=block"
Header set X-Content-Type-Options "nosniff"
```

#### ✅ Environment Variable Protection
```apache
# Block .env access
<FilesMatch "^\.env">
    Order allow,deny
    Deny from all
</FilesMatch>
```

#### ✅ Password Security (if implementing authentication)
```php
// Use PHP password hashing
$hashed = password_hash($password, PASSWORD_DEFAULT);
password_verify($input_password, $hashed);
```

### Security Recommendations

1. **Enable HTTPS**: Use SSL/TLS certificates (Let's Encrypt)
2. **Implement Rate Limiting**: Prevent brute force attacks
3. **Add CSRF Tokens**: For all form submissions
4. **Regular Updates**: Keep PHP, MySQL, and libraries updated
5. **Security Audits**: Regular code reviews and vulnerability scanning

---

### Coding Standards

- **PHP**: Follow [PSR-12](https://www.php-fig.org/psr/psr-12/) coding standards
- **JavaScript**: Use ES6+ syntax, ESLint recommended
- **CSS**: BEM naming convention preferred
- **Commits**: Use [Conventional Commits](https://www.conventionalcommits.org/)

### Reporting Bugs

Use GitHub Issues with the bug template:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details

---




### Project Links
- **Repository**: [https://github.com/DininduAkalanka/Ceylon-Tour-Project](https://github.com/DininduAkalanka/Ceylon-Tour-Project)
- **Live Demo**: https://ceylontour.infinityfreeapp.com/
- **Issues**: [GitHub Issues](https://github.com/DininduAkalanka/Ceylon-Tour-Project/issues)



## 🙏 Acknowledgments

### Libraries & Frameworks
- [PHPMailer](https://github.com/PHPMailer/PHPMailer) - Email sending functionality
- [Swiper.js](https://swiperjs.com/) - Modern mobile touch slider
- [Font Awesome](https://fontawesome.com/) - Icon library
- [Google Fonts](https://fonts.google.com/) - Poppins font family

### Inspiration & Resources
- [PHP: The Right Way](https://phptherightway.com/) - PHP best practices
- [MDN Web Docs](https://developer.mozilla.org/) - Web development reference
- [OWASP](https://owasp.org/) - Security guidelines

### Special Thanks
- Contributors and testers
---




