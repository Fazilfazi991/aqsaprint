const fs = require('fs');
const path = require('path');

const targetDir = process.cwd();
const indexHtmlPath = path.join(targetDir, 'index.html');

const replacement = `<div class="services-grid">
                <div class="service-card">
                    <div class="service-image"><img fetchpriority="high" loading="eager" src="images/generated/service_print.png" alt="Digital Printing"></div>
                    <h3>Digital Printing</h3>
                    <p>Fast, high-quality digital printing for business cards, brochures, flyers, and more. Perfect for quick turnaround times.</p>
                    <a href="digital-printing.html" class="btn btn-secondary">Learn More <i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="service-card">
                    <div class="service-image"><img decoding="async" src="images/generated/work_print.png" alt="Offset Printing"></div>
                    <h3>Offset Printing</h3>
                    <p>Cost-effective, large-volume printing with superior image quality and color fidelity. Ideal for magazines, catalogs, and packaging.</p>
                    <a href="offset-printing.html" class="btn btn-secondary">Learn More <i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="service-card">
                    <div class="service-image"><img decoding="async" src="images/generated/service_promo.png" alt="Corporate Gifts"></div>
                    <h3>Corporate Gifts</h3>
                    <p>Custom branded merchandise and corporate gifts that leave a lasting impression. From luxury sets to event giveaways.</p>
                    <a href="promotional-gifts.html" class="btn btn-secondary">Learn More <i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="service-card">
                    <div class="service-image"><img decoding="async" src="images/generated/work_vehicle.png" alt="Roll-up & Banners"></div>
                    <h3>Roll-up & Banners : Large format Printing</h3>
                    <p>Eye-catching large format printing for exhibitions and events. Portable displays with stunning visual impact.</p>
                    <a href="rollup-banners.html" class="btn btn-secondary">Learn More <i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="service-card">
                    <div class="service-image"><img decoding="async" src="images/generated/service_outdoor.png" alt="Mementos"></div>
                    <h3>Mementos</h3>
                    <p>Personalized awards, trophies, and mementos to celebrate achievements and milestones with premium craftsmanship.</p>
                    <a href="mementos.html" class="btn btn-secondary">Learn More <i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="service-card">
                    <div class="service-image"><img decoding="async" src="images/generated/work_led.png" alt="Photos / Canvas"></div>
                    <h3>Photos / Canvas</h3>
                    <p>Transform your photos into stunning wall art with our premium canvas printing services. Museum-quality gallery wraps.</p>
                    <a href="canvas-printing.html" class="btn btn-secondary">Learn More <i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="service-card">
                    <div class="service-image"><img decoding="async" src="images/generated/service_3d.png" alt="Signage"></div>
                    <h3>Signage</h3>
                    <p>Complete signage solutions from 3D illuminated letters to outdoor pylon signs. Make your brand visible day and night.</p>
                    <a href="signages.html" class="btn btn-secondary">Learn More <i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="service-card">
                    <div class="service-image"><img decoding="async" src="images/generated/service_vehicle.png" alt="Vehicle Branding"></div>
                    <h3>Vehicle Branding</h3>
                    <p>Turn your vehicles into mobile billboards with premium vinyl wraps, decals, and fleet graphics that capture attention.</p>
                    <a href="vehicle-branding.html" class="btn btn-secondary">Learn More <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>`;

let content = fs.readFileSync(indexHtmlPath, 'utf8');
const regex = /<div class="services-grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/;
const fullReplacement = replacement + '\n        </div>\n    </section>';

if (content.match(regex)) {
    content = content.replace(regex, fullReplacement);
    fs.writeFileSync(indexHtmlPath, content, 'utf8');
    console.log("Updated index.html");
} else {
    console.log("Could not find regex in index.html");
}
