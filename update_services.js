const fs = require('fs');
const path = require('path');

const targetDir = process.cwd();
const servicesHtmlPath = path.join(targetDir, 'services.html');

const replacement = `<div class="services-grid">
                <!-- Digital Printing -->
                <div class="service-card">
                    <div class="service-image"><img fetchpriority="high" loading="eager" src="images/generated/service_print.png" alt="Digital Printing"></div>
                    <h3>Digital Printing</h3>
                    <p>Fast, high-quality digital printing for business cards, brochures, flyers, and more. Perfect for quick turnaround times.</p>
                    <ul class="service-features">
                        <li><i class="fas fa-check-circle"></i> Business Cards</li>
                        <li><i class="fas fa-check-circle"></i> Brochures & Flyers</li>
                        <li><i class="fas fa-check-circle"></i> Fast Turnaround</li>
                        <li><i class="fas fa-check-circle"></i> High Quality</li>
                    </ul>
                    <a href="digital-printing.html" class="btn btn-primary">View Details <i class="fas fa-arrow-right" style="margin-left:8px"></i></a>
                </div>

                <!-- Offset Printing -->
                <div class="service-card">
                    <div class="service-image"><img decoding="async" src="images/generated/work_print.png" alt="Offset Printing"></div>
                    <h3>Offset Printing</h3>
                    <p>Cost-effective, large-volume printing with superior image quality and color fidelity. Ideal for magazines, catalogs, and packaging.</p>
                    <ul class="service-features">
                        <li><i class="fas fa-check-circle"></i> Large Volumes</li>
                        <li><i class="fas fa-check-circle"></i> Superior Quality</li>
                        <li><i class="fas fa-check-circle"></i> Cost-Effective</li>
                        <li><i class="fas fa-check-circle"></i> Color Accuracy</li>
                    </ul>
                    <a href="offset-printing.html" class="btn btn-primary">View Details <i class="fas fa-arrow-right" style="margin-left:8px"></i></a>
                </div>

                <!-- Corporate Gifts -->
                <div class="service-card">
                    <div class="service-image"><img decoding="async" src="images/generated/service_promo.png" alt="Corporate Gifts"></div>
                    <h3>Corporate Gifts</h3>
                    <p>Custom branded merchandise and corporate gifts that leave a lasting impression. From luxury sets to event giveaways.</p>
                    <ul class="service-features">
                        <li><i class="fas fa-check-circle"></i> Executive Gifts</li>
                        <li><i class="fas fa-check-circle"></i> Event Giveaways</li>
                        <li><i class="fas fa-check-circle"></i> Branded Merchandise</li>
                        <li><i class="fas fa-check-circle"></i> Bulk Discounts</li>
                    </ul>
                    <a href="promotional-gifts.html" class="btn btn-primary">View Details <i class="fas fa-arrow-right" style="margin-left:8px"></i></a>
                </div>

                <!-- Roll-up & Banners -->
                <div class="service-card">
                    <div class="service-image"><img decoding="async" src="images/generated/work_vehicle.png" alt="Roll-up & Banners"></div>
                    <h3>Roll-up & Banners : Large format Printing</h3>
                    <p>Eye-catching large format printing for exhibitions and events. Portable displays with stunning visual impact.</p>
                    <ul class="service-features">
                        <li><i class="fas fa-check-circle"></i> Rollup Banners</li>
                        <li><i class="fas fa-check-circle"></i> Large Format Banners</li>
                        <li><i class="fas fa-check-circle"></i> Event Backdrops</li>
                        <li><i class="fas fa-check-circle"></i> High-Resolution</li>
                    </ul>
                    <a href="rollup-banners.html" class="btn btn-primary">View Details <i class="fas fa-arrow-right" style="margin-left:8px"></i></a>
                </div>

                <!-- Mementos -->
                <div class="service-card">
                    <div class="service-image"><img decoding="async" src="images/generated/service_outdoor.png" alt="Mementos"></div>
                    <h3>Mementos</h3>
                    <p>Personalized awards, trophies, and mementos to celebrate achievements and milestones with premium craftsmanship.</p>
                    <ul class="service-features">
                        <li><i class="fas fa-check-circle"></i> Custom Trophies</li>
                        <li><i class="fas fa-check-circle"></i> Crystal Awards</li>
                        <li><i class="fas fa-check-circle"></i> Personalized Plaques</li>
                        <li><i class="fas fa-check-circle"></i> High Craftsmanship</li>
                    </ul>
                    <a href="mementos.html" class="btn btn-primary">View Details <i class="fas fa-arrow-right" style="margin-left:8px"></i></a>
                </div>

                <!-- Photos / Canvas -->
                <div class="service-card">
                    <div class="service-image"><img decoding="async" src="images/generated/work_led.png" alt="Photos / Canvas"></div>
                    <h3>Photos / Canvas</h3>
                    <p>Transform your photos into stunning wall art with our premium canvas printing services. Museum-quality gallery wraps.</p>
                    <ul class="service-features">
                        <li><i class="fas fa-check-circle"></i> Canvas Prints</li>
                        <li><i class="fas fa-check-circle"></i> Photo Enlargements</li>
                        <li><i class="fas fa-check-circle"></i> Gallery Wraps</li>
                        <li><i class="fas fa-check-circle"></i> Vibrant Colors</li>
                    </ul>
                    <a href="canvas-printing.html" class="btn btn-primary">View Details <i class="fas fa-arrow-right" style="margin-left:8px"></i></a>
                </div>

                <!-- Signage -->
                <div class="service-card">
                    <div class="service-image"><img decoding="async" src="images/generated/service_3d.png" alt="Signage"></div>
                    <h3>Signage</h3>
                    <p>Complete signage solutions from 3D illuminated letters to outdoor pylon signs. Make your brand visible day and night.</p>
                    <ul class="service-features">
                        <li><i class="fas fa-check-circle"></i> 3D & LED Signs</li>
                        <li><i class="fas fa-check-circle"></i> Indoor Signage</li>
                        <li><i class="fas fa-check-circle"></i> Outdoor Signage</li>
                        <li><i class="fas fa-check-circle"></i> Wayfinding Systems</li>
                    </ul>
                    <a href="signages.html" class="btn btn-primary">View Details <i class="fas fa-arrow-right" style="margin-left:8px"></i></a>
                </div>

                <!-- Vehicle Branding -->
                <div class="service-card">
                    <div class="service-image"><img decoding="async" src="images/generated/service_vehicle.png" alt="Vehicle Branding"></div>
                    <h3>Vehicle Branding</h3>
                    <p>Turn your vehicles into mobile billboards with premium vinyl wraps, decals, and fleet graphics that capture attention.</p>
                    <ul class="service-features">
                        <li><i class="fas fa-check-circle"></i> Full & Partial Wraps</li>
                        <li><i class="fas fa-check-circle"></i> Fleet Graphics</li>
                        <li><i class="fas fa-check-circle"></i> UV-Resistant</li>
                        <li><i class="fas fa-check-circle"></i> Professional Install</li>
                    </ul>
                    <a href="vehicle-branding.html" class="btn btn-primary">View Details <i class="fas fa-arrow-right" style="margin-left:8px"></i></a>
                </div>
            </div>`;

let content = fs.readFileSync(servicesHtmlPath, 'utf8');
const regex = /<div class="services-grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/;
const fullReplacement = replacement + '\n        </div>\n    </section>';

if (content.match(regex)) {
    content = content.replace(regex, fullReplacement);
    fs.writeFileSync(servicesHtmlPath, content, 'utf8');
    console.log("Updated services.html");
} else {
    console.log("Could not find regex in services.html");
}
