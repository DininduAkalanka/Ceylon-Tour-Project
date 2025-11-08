/**
 * FAQ Data Template - Ceylon Tour.com
 * 
 * Optional: Use this structure if you want to load FAQs dynamically from PHP
 * Place this in a file called faq-data.php
 */

<?php
header('Content-Type: application/json');

$faqData = [
    'general' => [
        'title' => 'General Information',
        'icon' => 'fa-info-circle',
        'faqs' => [
            [
                'question' => 'What is included in your tour packages?',
                'answer' => 'Our tour packages typically include accommodation, daily breakfast, transportation in air-conditioned vehicles, professional English-speaking guides, entrance fees to specified attractions, and all taxes. Specific inclusions vary by package, so please check individual tour details.'
            ],
            [
                'question' => 'How do I book a tour with Ceylon Tour.com?',
                'answer' => 'Booking is easy! Simply select your desired package, click "Book Now", fill out the booking form with your travel details, and submit. Our team will contact you within 24 hours to confirm your booking and arrange payment. You can also contact us directly via phone or email.'
            ],
            [
                'question' => 'Can I customize my tour itinerary?',
                'answer' => 'Absolutely! We specialize in creating personalized experiences. Contact us with your preferences, interests, budget, and travel dates, and we\'ll design a custom itinerary just for you. Whether you want to add extra days, change destinations, or include special activities, we\'re here to help.'
            ]
        ]
    ],
    
    'booking' => [
        'title' => 'Booking & Payment',
        'icon' => 'fa-credit-card',
        'faqs' => [
            [
                'question' => 'What payment methods do you accept?',
                'answer' => 'We accept international bank transfers, credit/debit cards (Visa, Mastercard), PayPal, and cash upon arrival. A deposit is typically required to confirm your booking, with the balance due before your tour starts or upon arrival.'
            ],
            [
                'question' => 'What is your cancellation policy?',
                'answer' => 'Cancellations made 30+ days before departure receive a full refund minus 10% processing fee. 15-29 days: 50% refund. Less than 15 days: no refund. However, you can reschedule your tour for up to 12 months with no penalty. Terms may vary for peak season bookings.'
            ],
            [
                'question' => 'Do I need to pay a deposit?',
                'answer' => 'Yes, we require a 30% deposit to confirm your booking. This secures your accommodations, vehicle, and guide. The remaining balance is due 14 days before your tour starts or can be paid upon arrival in Sri Lanka.'
            ]
        ]
    ],
    
    'safety' => [
        'title' => 'Travel & Safety',
        'icon' => 'fa-shield-alt',
        'faqs' => [
            [
                'question' => 'Is Sri Lanka safe for tourists?',
                'answer' => 'Yes, Sri Lanka is very safe for tourists. We maintain the highest safety standards with experienced drivers, well-maintained vehicles, and 24/7 support. Our guides are trained in first aid and emergency procedures. We monitor travel advisories and adjust itineraries if needed for your safety.'
            ],
            [
                'question' => 'Do I need travel insurance?',
                'answer' => 'While not mandatory, we strongly recommend comprehensive travel insurance covering medical emergencies, trip cancellation, lost luggage, and travel delays. This provides peace of mind and financial protection during your journey.'
            ],
            [
                'question' => 'What vaccinations do I need for Sri Lanka?',
                'answer' => 'No vaccinations are mandatory for Sri Lanka. However, it\'s recommended to be up-to-date on routine vaccines and consider Hepatitis A, Typhoid, and Japanese Encephalitis depending on your travel plans. Consult your doctor 6-8 weeks before departure.'
            ]
        ]
    ],
    
    'logistics' => [
        'title' => 'Logistics & Planning',
        'icon' => 'fa-suitcase',
        'faqs' => [
            [
                'question' => 'What is the best time to visit Sri Lanka?',
                'answer' => 'Sri Lanka has two monsoon seasons, so the best time depends on where you\'re going. December to March is ideal for the west and south coasts. April to September is best for the east coast. The Cultural Triangle (central region) can be visited year-round with beautiful weather from December to April.'
            ],
            [
                'question' => 'Do I need a visa to visit Sri Lanka?',
                'answer' => 'Most visitors need an Electronic Travel Authorization (ETA) which can be obtained online before arrival. It costs around $50 USD and is valid for 30 days. Some nationalities receive free visas. Check the official Sri Lanka ETA website or contact us for assistance.'
            ],
            [
                'question' => 'Will I have WiFi and mobile connectivity?',
                'answer' => 'Yes, most hotels and restaurants offer free WiFi. We recommend purchasing a local SIM card at the airport for reliable mobile data throughout your journey. Our vehicles also have WiFi hotspots available for your convenience during long drives.'
            ],
            [
                'question' => 'What should I pack for my Sri Lanka tour?',
                'answer' => 'Pack lightweight, breathable clothing, comfortable walking shoes, sunscreen, insect repellent, and a hat. Bring modest clothing for temple visits (covering shoulders and knees). If visiting hill country, pack a light jacket. Don\'t forget your camera, swimwear, and any personal medications.'
            ]
        ]
    ]
];

// Return JSON
echo json_encode($faqData, JSON_PRETTY_PRINT);
?>
