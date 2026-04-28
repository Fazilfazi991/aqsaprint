import os

template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | AQSA Print Saudi Arabia</title>
    <meta name="description" content="{description}">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet">

    <!-- Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <!-- Shared Styles -->
    <link rel="stylesheet" href="style.css">
    
    <style>
        .service-detail-section {{
            padding: 80px 0;
        }}
        .service-content-grid {{
            display: grid;
            grid-template-columns: 1fr;
            gap: 40px;
        }}
        @media (min-width: 1024px) {{
            .service-content-grid {{
                grid-template-columns: 2fr 1fr;
            }}
        }}
        .service-image {{
            width: 100%;
            border-radius: var(--radius-xl);
            margin-bottom: 30px;
            box-shadow: var(--shadow-lg);
        }}
        .service-desc-title {{
            font-size: 28px;
            font-weight: 800;
            color: var(--gray-900);
            margin-bottom: 20px;
        }}
        .service-desc-text {{
            font-size: 16px;
            line-height: 1.8;
            color: var(--gray-600);
            margin-bottom: 24px;
        }}
        .service-features {{
            list-style: none;
            padding: 0;
            margin: 0 0 40px 0;
        }}
        .service-features li {{
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
            font-size: 16px;
            color: var(--gray-700);
        }}
        .service-features li i {{
            color: var(--teal-primary);
            font-size: 20px;
        }}
        .sidebar-box {{
            background: var(--white);
            border-radius: var(--radius-lg);
            padding: 30px;
            border: 1px solid var(--gray-100);
            box-shadow: var(--shadow-md);
            margin-bottom: 30px;
            position: sticky;
            top: 100px;
        }}
        .sidebar-title {{
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 20px;
            color: var(--gray-900);
        }}
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="header-inner">
                <a href="index.html" class="logo">
                    <svg class="logo-icon" viewBox="0 0 48 48" fill="none">
                        <defs>
                            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#E8A5B8"/>
                                <stop offset="100%" style="stop-color:#2DB8A8"/>
                            </linearGradient>
                        </defs>
                        <circle cx="12" cy="24" r="10" fill="url(#logoGradient)" opacity="0.6"/>
                        <path d="M24 6L40 42H32L28 32H20L16 42H8L24 6Z" fill="url(#logoGradient)"/>
                        <rect x="4" y="42" width="40" height="4" rx="2" fill="url(#logoGradient)"/>
                    </svg>
                    <div>
                        <span class="logo-text text-gradient">AQSA</span>
                        <span class="logo-text-ar">أقصى</span>
                    </div>
                </a>

                <nav class="nav-desktop">
                    <a href="index.html" class="nav-link">Home</a>
                    <div class="nav-dropdown">
                        <a href="services.html" class="nav-link active nav-dropdown-trigger">
                            Services <i class="fas fa-chevron-down" style="font-size: 10px;"></i>
                        </a>
                        <div class="nav-dropdown-menu">
                            <a href="indoor-outdoor-branding.html" class="nav-dropdown-item">Indoor & Outdoor Branding</a>
                            <a href="vehicle-branding.html" class="nav-dropdown-item">Vehicle Branding</a>
                            <a href="signages.html" class="nav-dropdown-item">Signages</a>
                            <a href="design-development.html" class="nav-dropdown-item">Design & Development</a>
                            <a href="rollups-backdrops.html" class="nav-dropdown-item">Rollups & Backdrops</a>
                            <a href="flags.html" class="nav-dropdown-item">Flags</a>
                            <a href="promotional-gifts.html" class="nav-dropdown-item">Promotional Gifts</a>
                            <a href="printing-services.html" class="nav-dropdown-item">Printing Services</a>
                        </div>
                    </div>
                    <div class="nav-dropdown">
                        <a href="shop.html" class="nav-link nav-dropdown-trigger">
                            Products <i class="fas fa-chevron-down" style="font-size: 10px;"></i>
                        </a>
                        <div class="nav-dropdown-menu">
                            <a href="signages.html" class="nav-dropdown-item">Signages</a>
                            <a href="vehicle-branding.html" class="nav-dropdown-item">Vehicle Branding</a>
                            <a href="flags.html" class="nav-dropdown-item">Flags</a>
                            <a href="rollups-backdrops.html" class="nav-dropdown-item">Rollups</a>
                            <a href="promotional-gifts.html" class="nav-dropdown-item">Gifts</a>
                        </div>
                    </div>
                    <a href="portfolio.html" class="nav-link">Portfolio</a>
                    <a href="about.html" class="nav-link">About</a>
                    <a href="contact.html" class="nav-link">Contact</a>
                </nav>

                <div class="header-actions">
                    <a href="quote.html" class="btn btn-primary btn-quote">
                        <i class="fas fa-calendar-check"></i> Get Quote
                    </a>
                    <button class="mobile-menu-btn" aria-label="Toggle menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile Menu -->
        <div class="mobile-menu">
            <a href="index.html" class="mobile-menu-link">Home</a>
            <a href="services.html" class="mobile-menu-link">Services</a>
            <a href="shop.html" class="mobile-menu-link">Products</a>
            <a href="portfolio.html" class="mobile-menu-link">Portfolio</a>
            <a href="about.html" class="mobile-menu-link">About</a>
            <a href="contact.html" class="mobile-menu-link">Contact</a>
            <div class="mobile-menu-cta">
                <a href="quote.html" class="btn btn-primary" style="width: 100%;">
                    <i class="fab fa-whatsapp"></i> Get Free Quote
                </a>
            </div>
        </div>
    </header>

    <!-- Page Hero -->
    <section class="page-hero">
        <div class="container">
            <div class="page-hero-content">
                <h1 class="section-title"><span class="text-gradient">{title}</span></h1>
                <p class="section-subtitle">{subtitle}</p>
            </div>
        </div>
    </section>

    <!-- Service Detail -->
    <section class="service-detail-section">
        <div class="container">
            <div class="service-content-grid">
                <!-- Main Content -->
                <div>
                    <img src="{image_url}" alt="{title}" class="service-image">
                    
                    <h2 class="service-desc-title">About This Service</h2>
                    <p class="service-desc-text">
                        {paragraph1}
                    </p>
                    <p class="service-desc-text">
                        {paragraph2}
                    </p>

                    <h2 class="service-desc-title">Key Features</h2>
                    <ul class="service-features">
                        <li><i class="fas fa-check-circle"></i> High-quality materials for maximum durability</li>
                        <li><i class="fas fa-check-circle"></i> Custom designs tailored to your brand identity</li>
                        <li><i class="fas fa-check-circle"></i> Fast turnaround and professional installation available</li>
                        <li><i class="fas fa-check-circle"></i> Competitive pricing for the Saudi market</li>
                    </ul>

                    <a href="quote.html" class="btn btn-primary">Request a Custom Quote</a>
                </div>

                <!-- Sidebar -->
                <aside>
                    <div class="sidebar-box">
                        <h3 class="sidebar-title">Need Help?</h3>
                        <p style="color: var(--gray-600); margin-bottom: 20px; line-height: 1.6;">Our experts in Riyadh are ready to assist you with your printing requirements.</p>
                        
                        <div style="display: flex; flex-direction: column; gap: 16px;">
                            <a href="tel:+966501234567" style="display: flex; align-items: center; gap: 12px; color: var(--gray-800); text-decoration: none; font-weight: 600;">
                                <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--gray-100); display: flex; align-items: center; justify-content: center; color: var(--teal-primary);">
                                    <i class="fas fa-phone"></i>
                                </div>
                                +966 50 123 4567
                            </a>
                            <a href="https://wa.me/966501234567" style="display: flex; align-items: center; gap: 12px; color: var(--gray-800); text-decoration: none; font-weight: 600;">
                                <div style="width: 40px; height: 40px; border-radius: 50%; background: #25D366; display: flex; align-items: center; justify-content: center; color: white;">
                                    <i class="fab fa-whatsapp"></i>
                                </div>
                                Chat on WhatsApp
                            </a>
                            <a href="mailto:info@aqsaprint.com" style="display: flex; align-items: center; gap: 12px; color: var(--gray-800); text-decoration: none; font-weight: 600;">
                                <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--gray-100); display: flex; align-items: center; justify-content: center; color: var(--teal-primary);">
                                    <i class="fas fa-envelope"></i>
                                </div>
                                info@aqsaprint.com
                            </a>
                        </div>
                    </div>

                    <div class="sidebar-box">
                        <h3 class="sidebar-title">Related Services</h3>
                        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px;">
                            <li><a href="signages.html" style="color: var(--teal-primary); text-decoration: none; font-weight: 500;">&rarr; Signages</a></li>
                            <li><a href="vehicle-branding.html" style="color: var(--teal-primary); text-decoration: none; font-weight: 500;">&rarr; Vehicle Branding</a></li>
                            <li><a href="rollups-backdrops.html" style="color: var(--teal-primary); text-decoration: none; font-weight: 500;">&rarr; Rollups & Backdrops</a></li>
                            <li><a href="indoor-outdoor-branding.html" style="color: var(--teal-primary); text-decoration: none; font-weight: 500;">&rarr; Indoor & Outdoor Branding</a></li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="footer-logo">
                        <svg class="footer-logo-icon" viewBox="0 0 48 48" fill="none">
                            <defs>
                                <linearGradient id="logoGradientFooter" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style="stop-color:#E8A5B8"/>
                                    <stop offset="100%" style="stop-color:#2DB8A8"/>
                                </linearGradient>
                            </defs>
                            <circle cx="12" cy="24" r="10" fill="url(#logoGradientFooter)" opacity="0.6"/>
                            <path d="M24 6L40 42H32L28 32H20L16 42H8L24 6Z" fill="url(#logoGradientFooter)"/>
                            <rect x="4" y="42" width="40" height="4" rx="2" fill="url(#logoGradientFooter)"/>
                        </svg>
                        <span class="footer-logo-text">AQSA</span>
                    </div>
                    <p class="footer-description">Your trusted partner for all printing needs in KSA. Premium quality, fast turnaround, and exceptional service since 2020.</p>
                    <div class="footer-social">
                        <a href="#"><i class="fab fa-facebook-f"></i></a>
                        <a href="#"><i class="fab fa-instagram"></i></a>
                        <a href="#"><i class="fab fa-linkedin-in"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                    </div>
                </div>
                <div>
                    <h4 class="footer-title">Services</h4>
                    <ul class="footer-links">
                        <li><a href="vehicle-branding.html">Vehicle Branding</a></li>
                        <li><a href="signages.html">Signages</a></li>
                        <li><a href="flex-banner-printing.html">Flex & Banners</a></li>
                        <li><a href="rollups-backdrops.html">Rollups & Backdrops</a></li>
                        <li><a href="flags.html">Flags</a></li>
                        <li><a href="promotional-gifts.html">Promotional Gifts</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="footer-title">Quick Links</h4>
                    <ul class="footer-links">
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="portfolio.html">Portfolio</a></li>
                        <li><a href="shop.html">Products</a></li>
                        <li><a href="contact.html">Contact</a></li>
                        <li><a href="quote.html">Get a Quote</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="footer-title">Contact Us</h4>
                    <ul class="footer-contact">
                        <li>
                            <i class="fas fa-map-marker-alt"></i>
                            <span>Riyadh, Saudi Arabia</span>
                        </li>
                        <li>
                            <i class="fas fa-phone"></i>
                            <span>+966 50 123 4567</span>
                        </li>
                        <li>
                            <i class="fas fa-envelope"></i>
                            <span>info@aqsaprint.com</span>
                        </li>
                        <li>
                            <i class="fab fa-whatsapp"></i>
                            <span>+966 50 123 4567</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p class="footer-copyright">© 2025 AQSA Print. All rights reserved.</p>
                <div class="footer-legal">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Floating Buttons -->
    <div class="floating-buttons">
        <a href="https://wa.me/966501234567" class="floating-btn floating-btn-whatsapp" aria-label="Chat on WhatsApp">
            <i class="fab fa-whatsapp"></i>
        </a>
        <a href="tel:+966501234567" class="floating-btn floating-btn-phone" aria-label="Call us">
            <i class="fas fa-phone"></i>
        </a>
    </div>

    <!-- Shared JavaScript -->
    <script src="main.js"></script>
</body>
</html>"""

pages = [
    {
        "filename": "vehicle-branding.html",
        "title": "Vehicle Branding",
        "description": "Professional vehicle branding services in Riyadh, Saudi Arabia. Full wraps, partial wraps, and commercial fleet graphics.",
        "subtitle": "Turn your vehicles into moving billboards with our premium vinyl wraps.",
        "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
        "paragraph1": "Vehicle branding is one of the most cost-effective outdoor advertising methods. At AQSA Print Riyadh, we provide high-quality full wraps, partial wraps, and die-cut decals for cars, vans, trucks, and entire commercial fleets.",
        "paragraph2": "We use premium, UV-resistant cast vinyl from top brands like 3M and Avery Dennison to ensure your graphics remain vibrant and protect your vehicle's original paint against the harsh Saudi sun."
    },
    {
        "filename": "signages.html",
        "title": "Signages",
        "description": "Custom indoor and outdoor signages in Riyadh, KSA. 3D signs, illuminated signs, and acrylic signs for businesses.",
        "subtitle": "Make your business stand out with custom 3D and illuminated signages.",
        "image_url": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
        "paragraph1": "A well-designed sign is the face of your business. We design, manufacture, and install a wide variety of signages across Riyadh, including 3D illuminated letters, flex face signs, acrylic standoff signs, and directional wayfinding systems.",
        "paragraph2": "Our experienced installation team ensures that every sign is safely and securely mounted in compliance with local regulations, providing maximum visibility for your brand day and night."
    },
    {
        "filename": "flex-banner-printing.html",
        "title": "Flex Banner Printing",
        "description": "Large format flex and banner printing in Riyadh. Ideal for outdoor advertising, hoardings, and events.",
        "subtitle": "High-impact, large format printing for maximum outdoor visibility.",
        "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
        "paragraph1": "For large-scale advertising, nothing beats the cost-effectiveness and reach of flex banners. We offer high-resolution printing on durable, weather-resistant flex materials suitable for outdoor hoardings, building wraps, and event backdrops in KSA.",
        "paragraph2": "Our state-of-the-art wide-format printers ensure crisp text and vibrant colors that grab attention, even from a distance. We also provide full installation and structural support services."
    },
    {
        "filename": "indoor-outdoor-branding.html",
        "title": "Indoor & Outdoor Branding",
        "description": "Complete branding solutions for indoor and outdoor spaces in Riyadh. Wall wraps, glass stickers, and retail branding.",
        "subtitle": "Transform your commercial space with our comprehensive branding solutions.",
        "image_url": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
        "paragraph1": "Your physical space should reflect your brand's identity. We provide complete indoor and outdoor branding solutions in Riyadh, including custom wall graphics, frosted glass window stickers, retail displays, and elevator branding.",
        "paragraph2": "Whether you are opening a new retail store, renovating a corporate office, or setting up a restaurant, our team handles everything from conceptual design to precision installation, creating an immersive brand environment."
    },
    {
        "filename": "design-development.html",
        "title": "Design & Development",
        "description": "Creative graphic design and brand identity development services in Riyadh.",
        "subtitle": "Creative design services to build a strong and memorable brand identity.",
        "image_url": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80",
        "paragraph1": "Great printing starts with great design. Our in-house creative team in Riyadh offers full graphic design and brand development services, ensuring your visual identity communicates the right message to your target audience.",
        "paragraph2": "From logo creation and corporate identity guidelines to marketing collateral and digital assets, we provide a cohesive design strategy that elevates your brand across all mediums."
    },
    {
        "filename": "rollups-backdrops.html",
        "title": "Rollups & Backdrops",
        "description": "Portable rollup banners, pop-up stands, and event backdrops in Riyadh, Saudi Arabia.",
        "subtitle": "Portable, easy-to-assemble display solutions for exhibitions and events.",
        "image_url": "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200&q=80",
        "paragraph1": "Make a strong impression at your next exhibition or corporate event. We supply a wide range of portable display solutions, including premium rollup banners, tension fabric backdrops, and modular pop-up stands.",
        "paragraph2": "All our display systems are lightweight, easy to transport, and quick to assemble, featuring high-resolution printed graphics that can be easily updated or replaced for future events."
    },
    {
        "filename": "flags.html",
        "title": "Flags & Banners",
        "description": "Custom printed promotional flags, teardrop flags, and feather flags in Riyadh.",
        "subtitle": "Dynamic, wind-resistant flags to draw attention to your business or event.",
        "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
        "paragraph1": "Promotional flags are an excellent way to capture attention in high-traffic outdoor areas. We offer custom-printed teardrop flags, feather flags, and telescopic banners perfect for retail promotions, sports events, and exhibitions in KSA.",
        "paragraph2": "Printed on durable knitted polyester using dye-sublimation technology, our flags are weather-resistant and feature rich, vibrant colors that can be seen clearly from both sides."
    },
    {
        "filename": "promotional-gifts.html",
        "title": "Promotional Gifts",
        "description": "Custom branded corporate gifts and promotional merchandise in Riyadh, KSA.",
        "subtitle": "Leave a lasting impression with custom-branded corporate gifts and merchandise.",
        "image_url": "https://images.unsplash.com/photo-1604537466608-109fa2f16c3b?w=1200&q=80",
        "paragraph1": "Corporate gifting is a powerful tool for client retention and brand awareness. We offer an extensive catalog of promotional items in Riyadh, from premium executive gift sets and tech gadgets to everyday items like mugs, pens, and eco-friendly tote bags.",
        "paragraph2": "Using advanced branding techniques such as laser engraving, UV printing, and screen printing, we ensure your logo looks sharp and professional on any material."
    },
    {
        "filename": "printing-services.html",
        "title": "Commercial Printing Services",
        "description": "High-quality offset and digital printing services for businesses in Riyadh. Business cards, brochures, and stationery.",
        "subtitle": "Premium digital and offset printing for all your corporate stationery needs.",
        "image_url": "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&q=80",
        "paragraph1": "AQSA Print offers comprehensive commercial printing services in Riyadh. From short-run digital printing for urgent needs to large-volume offset printing for brochures, catalogs, and company profiles, we deliver unmatched quality.",
        "paragraph2": "We provide a wide array of premium paper stocks and luxury finishing options, including spot UV, foil stamping, embossing, and die-cutting, ensuring your printed materials reflect the high standards of your business."
    }
]

for page in pages:
    content = template.format(**page)
    with open(page["filename"], "w", encoding="utf-8") as f:
        f.write(content)

print("Generated 9 service pages successfully.")
