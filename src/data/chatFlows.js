(function () {
    window.AQSA_CHAT_FLOWS = {
        signage: {
            label: "Signage",
            keywords: ["signage", "signboard", "sign board", "board", "shop sign", "indoor sign", "outdoor sign", "led sign", "acrylic sign", "3d letters", "flex sign", "office sign"],
            answer: "AQSA Print provides indoor and outdoor signage solutions including shop signs, 3D letters, acrylic signs, LED signs, flex signs, office signs, and directional signage across Riyadh and KSA.",
            questions: [
                { text: "Is it for indoor or outdoor use?", field: "location" },
                { text: "What approximate size do you need?", field: "size" },
                { text: "Where should it be installed?", field: "location" },
                { text: "Do you already have the design/artwork?", field: "artworkAvailable" },
                { text: "When do you need it completed?", field: "deadline" }
            ]
        },
        vehicle_branding: {
            label: "Vehicle Branding",
            keywords: ["vehicle branding", "car branding", "van branding", "truck branding", "fleet branding", "vehicle wrap", "car wrap", "stickers", "vehicle sticker", "branding for car", "vans branded", "car sticker"],
            answer: "AQSA Print provides vehicle branding for cars, vans, trucks, and fleets, including partial branding, full wraps, stickers, and company branding.",
            questions: [
                { text: "What type of vehicle is it?", field: "message" },
                { text: "How many vehicles do you want to brand?", field: "quantity" },
                { text: "Do you need full wrap or partial branding?", field: "message" },
                { text: "Do you already have the design/artwork?", field: "artworkAvailable" },
                { text: "Where is the vehicle located?", field: "location" },
                { text: "What is your deadline?", field: "deadline" }
            ]
        },
        printing: {
            label: "Printing",
            keywords: ["printing", "business card", "flyer", "brochure", "poster", "banner", "roll up", "rollup", "sticker", "label", "catalogue", "profile printing"],
            answer: "AQSA Print handles business cards, flyers, brochures, posters, banners, roll-up banners, stickers, labels, catalogues, and other corporate printing works.",
            questions: [
                { text: "What item do you need printed?", field: "message" },
                { text: "What quantity do you need?", field: "quantity" },
                { text: "What size do you need?", field: "size" },
                { text: "Single side or double side?", field: "message" },
                { text: "Do you already have print-ready artwork?", field: "artworkAvailable" },
                { text: "What is your deadline?", field: "deadline" }
            ]
        },
        packaging: {
            label: "Packaging",
            keywords: ["packaging", "box", "custom box", "product label", "label", "sticker", "sleeve", "branded packaging"],
            answer: "AQSA Print provides packaging support including product labels, stickers, custom boxes, packaging sleeves, and branded packaging materials.",
            questions: [
                { text: "What product is this packaging for?", field: "message" },
                { text: "Do you need boxes, labels, stickers, or sleeves?", field: "message" },
                { text: "What quantity do you need?", field: "quantity" },
                { text: "Do you know the size?", field: "size" },
                { text: "Do you already have the design?", field: "artworkAvailable" },
                { text: "What is your deadline?", field: "deadline" }
            ]
        },
        exhibition: {
            label: "Exhibition",
            keywords: ["exhibition", "booth", "stand", "exhibition stand", "event stand", "backdrop", "display counter", "event branding"],
            answer: "AQSA Print supports exhibition and event branding including exhibition stands, booth branding, backdrops, display counters, roll-up banners, signage, and event branding materials.",
            questions: [
                { text: "What is the event or exhibition name?", field: "message" },
                { text: "What booth size do you have?", field: "size" },
                { text: "What items do you need?", field: "message" },
                { text: "Where is the setup location?", field: "location" },
                { text: "What is the setup date?", field: "deadline" },
                { text: "Do you already have the design?", field: "artworkAvailable" }
            ]
        },
        branding: {
            label: "Branding",
            keywords: ["branding", "brand identity", "logo", "corporate branding", "stationery", "company profile", "marketing material"],
            answer: "AQSA Print helps with corporate branding materials such as branded stationery, company profiles, marketing materials, logo usage on print items, and brand identity support.",
            questions: [
                { text: "What branding material do you need?", field: "message" },
                { text: "Is it for a new brand or existing brand?", field: "message" },
                { text: "Do you already have logo/design files?", field: "artworkAvailable" },
                { text: "What quantity do you need?", field: "quantity" },
                { text: "What is your deadline?", field: "deadline" }
            ]
        }
    };
}());
