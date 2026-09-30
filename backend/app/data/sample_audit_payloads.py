"""
VayuGrid Sample Audit Payloads & Evaluation Test Fixtures
Provides synthetic forensic evaluation benchmarks for all 6 pollution archetypes,
5 regional city archetypes, anti-spoofing rejection test fixtures, and 6-language advisories.
"""

from typing import Dict, Any, Optional

SAMPLE_AUDIT_PAYLOADS: Dict[str, Dict[str, Any]] = {
    # 1. Delhi-NCR: Open Municipal Solid Waste Burning
    "OPEN_MUNICIPAL_WASTE_BURNING": {
        "city_id": "delhi_ncr",
        "city_name": "Delhi-NCR",
        "default_coords": {"lat": 28.6253, "lon": 77.3298, "address_hint": "Ghazipur Landfill Perimeter, East Delhi"},
        "verification": {
            "is_valid_environmental_hazard": True,
            "rejection_reason": None,
            "source_classification": "OPEN_MUNICIPAL_WASTE_BURNING",
            "severity_score": 0.88,
            "confidence_score": 0.94,
            "optical_smoke_opacity": 0.85,
            "estimated_plume_spread_radius_meters": 450,
            "detected_visual_markers": [
                "Dense, acrid black plume indicating combustion of chlorinated plastics and municipal polymers",
                "Uncontrolled open flame burning in unsegregated refuse heap along roadway shoulder",
                "Severe thermal updraft carrying microparticulate ash toward adjacent residential housing blocks"
            ],
            "recommended_ulb_action": {
                "intervention_type": "Deploy High-Capacity Smog Gun Mist Cannon & Water Sprinkler Tanker",
                "target_department": "Municipal Solid Waste Enforcement Cell / East Delhi Municipal Corporation (MCD)",
                "priority_level": "CRITICAL"
            },
            "summary_assessment": (
                "Statutory violation under Solid Waste Management Rules 2016 and Section 133 EP Act. "
                "Immediate ground suppression required to curb dioxin and PM2.5 release."
            )
        },
        "vernacular_advisories": {
            "en": "Warning: High-intensity toxic waste burning detected nearby. Residents and schools downwind must seal windows and avoid outdoor exposure for the next 2 hours.",
            "hi": "चेतावनी: आस-पास कचरे में आग लगने से अत्यधिक जहरीला धुआं फैल रहा है। हवा के बहाव वाले क्षेत्र के लोग खिड़कियां बंद रखें और अगले 2 घंटे बाहर न निकलें।",
            "te": "హెచ్చరిక: సమీపంలో వ్యర్థాలను కాల్చడం వల్ల దట్టమైన విషపూరిత పొగ వ్యాపిస్తోంది. పరిసర ప్రాంత ప్రజలు కిటికీలు మూసివేసి, 2 గంటల పాటు బయటకు రాకుండా ఉండాలి.",
            "kn": "ಎಚ್ಚರಿಕೆ: ಹತ್ತಿರದಲ್ಲಿ ತ್ಯಾಜ್ಯ ಸುಡುವಿಕೆಯಿಂದ ದಟ್ಟವಾದ ವಿಷಕಾರಿ ಹೊಗೆ ಹರಡುತ್ತಿದೆ. ಹತ್ತಿರದ ನಿವಾಸಿಗಳು ಕಿಟಕಿಗಳನ್ನು ಮುಚ್ಚಿ ಮುಂದಿನ 2 ಗಂಟೆಗಳ ಕಾಲ ಹೊರಹೋಗುವುದನ್ನು ತಪ್ಪಿಸಿ.",
            "ta": "எச்சரிக்கை: அருகில் குப்பைகள் எரிக்கப்படுவதால் அடர்ந்த நச்சுப் புகை பரவுகிறது. அப்பகுதி மக்கள் ஜன்னல்களை மூடிவிட்டு அடுத்த 2 மணிநேரத்திற்கு வெளியில் செல்வதைத் தவிர்க்கவும்.",
            "ml": "മുന്നറിയിപ്പ്: സമീപത്ത് മാലിന്യം കത്തിച്ചതിനെത്തുടർന്ന് കനത്ത വിഷപ്പുക ഉയരുന്നു. അടുത്തുള്ള താമസക്കാർ ജനലുകൾ അടയ്ക്കുകയും അടുത്ത 2 മണിക്കൂർ പുറത്തിറങ്ങുന്നത് ഒഴിവാക്കുകയും വേണം."
        }
    },

    # 2. Bengaluru: Construction & Demolition Dust
    "CONSTRUCTION_DEMOLITION_DUST": {
        "city_id": "bengaluru",
        "city_name": "Bengaluru",
        "default_coords": {"lat": 12.9863, "lon": 77.7335, "address_hint": "Whitefield IT Corridor / Outer Ring Road, Bengaluru"},
        "verification": {
            "is_valid_environmental_hazard": True,
            "rejection_reason": None,
            "source_classification": "CONSTRUCTION_DEMOLITION_DUST",
            "severity_score": 0.72,
            "confidence_score": 0.91,
            "optical_smoke_opacity": 0.65,
            "estimated_plume_spread_radius_meters": 320,
            "detected_visual_markers": [
                "Uncovered earthmoving excavation with heavy earthmovers (JCBs) operating dry",
                "Absence of perimeter green dust barrier mesh and zero water sprinkling suppression",
                "Billowing pale tan particulate mineral dust crossing 6-lane arterial transit corridor"
            ],
            "recommended_ulb_action": {
                "intervention_type": "Issue Stop-Work Notice and Dispatch Mechanical Vacuum Sweeper",
                "target_department": "Environmental Health & Engineering Division / BBMP Bengaluru",
                "priority_level": "HIGH"
            },
            "summary_assessment": (
                "Violation of C&D Waste Management Rules 2016. High particulate resuspension impacting "
                "commuters and tech park personnel. Immediate wet misting mandated."
            )
        },
        "vernacular_advisories": {
            "en": "Advisory: Heavy construction dust cloud active along the roadway. Motorcyclists, cyclists, and asthmatic individuals should wear protective masks.",
            "hi": "सलाह: सड़क पर निर्माण कार्य के कारण भारी धूल का गुबार छाया हुआ है। दोपहिया वाहन चालक और सांस के रोगी मास्क पहनकर ही निकलें।",
            "te": "సూచన: రహదారిపై భారీ నిర్మాణ ధూళి వ్యాపించింది. ద్విచక్ర వాహనదారులు మరియు శ్వಾಸకోశ సమస్యలు ఉన్నవారు తప్పనిసరిగా మాస్కులు ధరించాలి.",
            "kn": "ಸಲಹೆ: ರಸ್ತೆಯಲ್ಲಿ ಕಟ್ಟಡ ನಿರ್ಮಾಣದ ದಟ್ಟವಾದ ಧೂಳು ಆವರಿಸಿದೆ. ದ್ವಿಚಕ್ರ ವಾಹನ ಸವಾರರು ಮತ್ತು ಉಸಿರಾಟದ ಸಮಸ್ಯೆಯಿರುವವರು ಕಡ್ಡಾಯವಾಗಿ ಮಾಸ್ಕ್ ಧರಿಸಿ.",
            "ta": "அறிவுறுத்தல்: சாலையில் தீவிர கட்டுமான தூசிப் புயல் எழுந்துள்ளது. இருசக்கர வாகன ஓட்டிகள் மற்றும் சுவாசப் பிரச்சனை உள்ளவர்கள் கட்டாயம் முகக்கவசம் அணியவும்.",
            "ml": "നിർദ്ദേശം: റോഡിൽ വലിയ രീതിയിലുള്ള നിർമ്മാണ പൊടിപടലങ്ങൾ ഉയരുന്നു. ഇരുചക്ര വാഹന യാത്രികരും ശ്വാസകോശ രോഗമുള്ളവരും മാസ്ക് ധരിക്കുക."
        }
    },

    # 3. Kanpur: Industrial Stack Emission
    "INDUSTRIAL_STACK_EMISSION": {
        "city_id": "kanpur",
        "city_name": "Kanpur",
        "default_coords": {"lat": 26.4385, "lon": 80.3842, "address_hint": "Jajmau Industrial Area / Tannery Cluster, Kanpur"},
        "verification": {
            "is_valid_environmental_hazard": True,
            "rejection_reason": None,
            "source_classification": "INDUSTRIAL_STACK_EMISSION",
            "severity_score": 0.92,
            "confidence_score": 0.96,
            "optical_smoke_opacity": 0.90,
            "estimated_plume_spread_radius_meters": 850,
            "detected_visual_markers": [
                "High-velocity sulfurous dark brown emission discharging directly from untreated industrial boiler chimney",
                "Heavy chemical haze hanging over low-lying worker settlements adjacent to industrial canal",
                "Ringelmann opacity scale exceeding statutory limits (Level 4+ observed)"
            ],
            "recommended_ulb_action": {
                "intervention_type": "Issue Emergency Shut-Down Order under Section 31A Air Act 1981",
                "target_department": "Uttar Pradesh Pollution Control Board (UPPCB) & KMC Industrial Task Force",
                "priority_level": "CRITICAL"
            },
            "summary_assessment": (
                "Unscrubbed industrial flue-gas plume containing volatile sulfur oxides and toxic PM10. "
                "Exceeds CPCB stack emission parameters; immediate inspection team dispatched."
            )
        },
        "vernacular_advisories": {
            "en": "Urgent Health Alert: Untreated industrial chemical plume detected. Downwind settlements must keep children and senior citizens indoors immediately.",
            "hi": "आपातकालीन चेतावनी: जहरीला औद्योगिक धुआं फैला है। हवा की दिशा में स्थित बस्तियों के बुजुर्गों और बच्चों को तुरंत घर के अंदर रखें।",
            "te": "అత్యవసర హెచ్చరిక: రసాయనాలతో కూడిన పరిశ్రమల పొగ వెలువడింది. గాలి ప్రవాహ దిశలోని కాలనీల ప్రజలు, పిల్లలు, వృద్ధులు ఇళ్లలోనే ఉండాలి.",
            "kn": "ತುರ್ತು ಎಚ್ಚರಿಕೆ: ಕಾರ್ಖಾನೆಯಿಂದ ರಾಸಾಯನಿಕಯುಕ್ತ ವಿಷಕಾರಿ ಹೊಗೆ ಹೊರಬರುತ್ತಿದೆ. ಗಾಳಿ ಬೀಸುವ ದಿಕ್ಕಿನ ನಿವಾಸಿಗಳು ಮಕ್ಕಳು ಮತ್ತು ಹಿರಿಯರನ್ನು ತಕ್ಷಣ ಮನೆಯೊಳಗೆ ಇರಿಸಿ.",
            "ta": "அவசர எச்சரிக்கை: நச்சு இரசாயன தொழிற்சாலை புகை பரவி வருகிறது. காற்றின் திசையிலுள்ள மக்கள், குழந்தைகள் மற்றும் முதியவர்களை உடனடியாக வீட்டிற்குள் பாதுகாக்கவும்.",
            "ml": "അടിയന്തര മുന്നറിയിപ്പ്: വ്യവസായശാലയിൽ നിന്നുള്ള വിഷപ്പുക പടരുന്നു. കാറ്റിന്റെ ദിശയിലുള്ള പ്രദേശവാസികൾ കുട്ടികളെയും മുതിർന്നവരെയും ഉടൻ വീടിനുള്ളിലാക്കുക."
        }
    },

    # 4. Punjab: Biomass & Agricultural Stubble Burning
    "BIOMASS_STUBBLE_BURNING": {
        "city_id": "punjab",
        "city_name": "Punjab Agrarian Belt",
        "default_coords": {"lat": 30.2458, "lon": 75.8421, "address_hint": "Sangrur-Sunam Rural Agrarian Belt, Punjab"},
        "verification": {
            "is_valid_environmental_hazard": True,
            "rejection_reason": None,
            "source_classification": "BIOMASS_STUBBLE_BURNING",
            "severity_score": 0.85,
            "confidence_score": 0.95,
            "optical_smoke_opacity": 0.78,
            "estimated_plume_spread_radius_meters": 1200,
            "detected_visual_markers": [
                "Widespread ground-level fireline across multiple paddy harvest acres (paddy straw / parali)",
                "Broad, horizontal billowing pale-grey aerosol sheet drifting across inter-district state highway",
                "Severely compromised atmospheric visibility (approaching zero-horizontal visibility)"
            ],
            "recommended_ulb_action": {
                "intervention_type": "Dispatch District Fire Patrol & Issue Joint Revenue Challan",
                "target_department": "Punjab Pollution Control Board (PPCB) & District Agriculture Field Team",
                "priority_level": "CRITICAL"
            },
            "summary_assessment": (
                "Massive seasonal post-harvest biomass burning event. Cross-boundary advection likely to impact "
                "downwind Delhi-NCR airshed within 18 hours. Ground fire containment required."
            )
        },
        "vernacular_advisories": {
            "en": "Smog Hazard: Extensive crop stubble smoke is creating severe low-visibility smog. Highway drivers should reduce speed; vulnerable individuals stay indoors.",
            "hi": "धुंध चेतावनी: पराली जलाने से भारी धुआं और धुंध छाई हुई है। हाईवे पर वाहन चालक गति धीमी रखें और सांस के मरीज घर पर ही रहें।",
            "te": "పొగమంచు హెచ్చరిక: పంట వ్యర్థాల దహనం వల్ల దట్టమైన పొగ మరియు మంచు కమ్ముకుంది. హైవే ప్రయాణికులు వేగం తగ్గించండి, రోగులు ఇళ్లలోనే ఉండండి.",
            "kn": "ದಟ್ಟ ಹೊಗೆ ಎಚ್ಚರಿಕೆ: ಕೃಷಿ ತ್ಯಾಜ್ಯ ಸುಡುವಿಕೆಯಿಂದ ಹೆದ್ದಾರಿಯಲ್ಲಿ ಹೊಗೆ ಆವರಿಸಿದೆ. ವಾಹನ ಸವಾರರು ಜಾಗರೂಕರಾಗಿ ಚಾಲನೆ ಮಾಡಿ ಮತ್ತು ಮನೆಯಲ್ಲೇ ಇರಿ.",
            "ta": "புகை எச்சரிக்கை: பயிர் கழிவுகள் எரிக்கப்படுவதால் கடுமையான புகைமூட்டம் நிலவுகிறது. நெடுஞ்சாலை பயணிகள் வேகத்தைக் குறைக்கவும்; நோயாளிகள் வீட்டிலேயே இருக்கவும்.",
            "ml": "കനത്ത പുക മുന്നറിയിപ്പ്: കൃഷി അവശിഷ്ടങ്ങൾ കത്തിച്ചതിനെത്തുടർന്ന് കനത്ത പുക പടരുന്നു. ഹൈവേയിൽ വാഹനങ്ങളുടെ വേഗത കുറയ്ക്കുക, രോഗികൾ വീടുകളിൽ തുടരുക."
        }
    },

    # 5. Mumbai: High Density Vehicular Idling Corridor
    "HIGH_DENSITY_VEHICULAR_IDLING": {
        "city_id": "mumbai",
        "city_name": "Mumbai Metropolitan",
        "default_coords": {"lat": 19.0760, "lon": 72.8777, "address_hint": "Western Express Highway / Kalanagar Flyover, Mumbai"},
        "verification": {
            "is_valid_environmental_hazard": True,
            "rejection_reason": None,
            "source_classification": "HIGH_DENSITY_VEHICULAR_IDLING",
            "severity_score": 0.65,
            "confidence_score": 0.89,
            "optical_smoke_opacity": 0.55,
            "estimated_plume_spread_radius_meters": 280,
            "detected_visual_markers": [
                "Bumper-to-bumper peak hour traffic gridlock with hundreds of idling combustion engines",
                "Accumulated blue-grey NOx and hydrocarbon haze trapped in concrete canyon between elevated flyover and residential high-rises",
                "Elevated ground-level temperature and visible exhaust tailpipe plumes"
            ],
            "recommended_ulb_action": {
                "intervention_type": "Activate Traffic Police Green Corridor & Deploy Anti-Smog Mobile Cannon",
                "target_department": "Mumbai Traffic Police Cell & BMC Environmental Protection Department",
                "priority_level": "MEDIUM"
            },
            "summary_assessment": (
                "Micro-climate street canyon accumulation of primary mobile source combustion products. "
                "Requires traffic de-congestion and boundary layer aerosol dispersion."
            )
        },
        "vernacular_advisories": {
            "en": "Traffic Exhaust Advisory: Dense vehicle exhaust trapped in the corridor. Commuters should keep vehicle air recirculating and close windows.",
            "hi": "यातायात धुआं सलाह: सड़क पर वाहनों का जहरीला धुआं जमा हो गया है। वाहन चालक खिड़कियां बंद रखें और एसी का रीसर्कुलेशन मोड चालू करें।",
            "te": "ట్రాఫిక్ పొగ హెచ్చరిక: వాహనాల రద్దీ వల్ల పొగ చిక్కుకుపోయింది. ప్రయాణికులు వాహనాల కిటికీలు మూసివేసి ఏసీ రీసర్క్యులేషన్ ఉపయోగించండి.",
            "kn": "ಟ್ರಾಫಿಕ್ ಹೊಗೆ ಸಲಹೆ: ರಸ್ತೆಯಲ್ಲಿ ವಾಹನಗಳ ದಟ್ಟವಾದ ಹೊಗೆ ಆವರಿಸಿದೆ. ಪ್ರಯಾಣಿಕರು ಕಿಟಕಿಗಳನ್ನು ಮುಚ್ಚಿ ವಾಹನದ ಎಸಿ ಮರುಪರಿಚಲನೆಯನ್ನು ಬಳಸಿ.",
            "ta": "போக்குவரத்து புகை ஆலோசனை: வாகன நெரிசலால் அடர்ந்த புகை தேங்கியுள்ளது. பயணிகள் வாகன ஜன்னல்களை மூடிவிட்டு ஏர் சர்குலேஷனைப் பயன்படுத்தவும்.",
            "ml": "ട്രാഫിക് പുക നിർദ്ദേശം: റോഡിൽ വാഹനങ്ങളുടെ കനത്ത പുക കെട്ടിക്കിടക്കുന്നു. യാത്രക്കാർ വാഹനങ്ങളുടെ ജനലുകൾ അടച്ച് എസി റീസർക്കുലേഷൻ ഉപയോഗിക്കുക."
        }
    },

    # 6. Unpaved Road Suspension
    "UNPAVED_ROAD_SUSPENSION": {
        "city_id": "delhi_ncr",
        "city_name": "Delhi Peripheral Zone",
        "default_coords": {"lat": 28.7901, "lon": 77.0850, "address_hint": "Bawana-Narela Peripheral Freight Corridor, North Delhi"},
        "verification": {
            "is_valid_environmental_hazard": True,
            "rejection_reason": None,
            "source_classification": "UNPAVED_ROAD_SUSPENSION",
            "severity_score": 0.68,
            "confidence_score": 0.88,
            "optical_smoke_opacity": 0.60,
            "estimated_plume_spread_radius_meters": 350,
            "detected_visual_markers": [
                "Unmetalled broken roadside berm churning massive fugitive dust under heavy commercial truck movement",
                "Coarse mineral particulate cloud remaining suspended at pedestrian breathing height",
                "Absence of end-to-end blacktop bitumen surfacing"
            ],
            "recommended_ulb_action": {
                "intervention_type": "Dispatch Heavy Water Sprinkler & Register Road Paving Ticket",
                "target_department": "Public Works Department (PWD) & North Delhi Municipal Corporation",
                "priority_level": "HIGH"
            },
            "summary_assessment": (
                "Non-exhaust fugitive dust suspension causing continuous PM10 spikes. "
                "Road stabilization and daily wet damping mandatory under GRAP Stage 2."
            )
        },
        "vernacular_advisories": {
            "en": "Advisory: High road dust suspension detected. Pedestrians and roadside vendors are advised to wear particulate masks.",
            "hi": "सलाह: कच्ची सड़क से भारी धूल उड़ रही है। पैदल यात्री और सड़क किनारे दुकान लगाने वाले लोग मास्क का उपयोग करें।",
            "te": "సూచన: రోడ్డు దుమ్ము విపరీతంగా పైకి లేస్తోంది. పాదచారులు మరియు చిరువ్యాపారులు మాస్కులు ధరించాలని సూచించడమైనది.",
            "kn": "ಸಲಹೆ: ರಸ್ತೆಯ ಧೂಳು ವಿಪರೀತವಾಗಿ ಹರಡುತ್ತಿದೆ. ಪಾದಚಾರಿಗಳು ಮತ್ತು ಬೀದಿಬದಿ ವ್ಯಾಪಾರಿಗಳು ಧೂಳು ನಿರೋಧಕ ಮಾಸ್ಕ್ ಧರಿಸಿ.",
            "ta": "அறிவுறுத்தல்: சாலையோர புழுதி அதிகளவில் காற்றில் பரவுகிறது. பாதசாரிகள் மற்றும் சாலையோர வியாபாரிகள் முகக்கவசம் அணியுமாறு கேட்டுக் கொள்ளப்படுகிறார்கள்.",
            "ml": "നിർദ്ദേശം: റോഡിൽ പൊടിപടലങ്ങൾ ശക്തമായി ഉയരുന്നു. കാൽനടയാത്രക്കാരും വഴിയോര കച്ചവടക്കാരും മാസ്ക് ധരിക്കുക."
        }
    }
}


# Anti-spoofing rejection test scenarios
SPOOFING_REJECTION_FIXTURES: Dict[str, Dict[str, Any]] = {
    "INDOOR_ROOM": {
        "is_valid_environmental_hazard": False,
        "rejection_reason": "ANTI_SPOOFING_FAILURE: Image depicts an indoor domestic environment (bedroom/living room), not an outdoor environmental hazard.",
        "source_classification": None,
        "severity_score": 0.0,
        "confidence_score": 0.98,
        "optical_smoke_opacity": 0.0,
        "estimated_plume_spread_radius_meters": 0,
        "detected_visual_markers": [],
        "recommended_ulb_action": None,
        "summary_assessment": "Rejected during preliminary anti-spoofing validation: Indoor scene."
    },
    "SCREEN_CAPTURE": {
        "is_valid_environmental_hazard": False,
        "rejection_reason": "ANTI_SPOOFING_FAILURE: Visual evidence indicates a photograph of a computer/smartphone screen displaying digital media.",
        "source_classification": None,
        "severity_score": 0.0,
        "confidence_score": 0.95,
        "optical_smoke_opacity": 0.0,
        "estimated_plume_spread_radius_meters": 0,
        "detected_visual_markers": [],
        "recommended_ulb_action": None,
        "summary_assessment": "Rejected during preliminary anti-spoofing validation: Screen capture / Moiré pattern detected."
    },
    "CLEAN_SKY": {
        "is_valid_environmental_hazard": False,
        "rejection_reason": "NO_HAZARD_DETECTED: Outdoor scene analyzed shows normal meteorological clouds and clean blue sky without anthropogenic pollution.",
        "source_classification": None,
        "severity_score": 0.0,
        "confidence_score": 0.96,
        "optical_smoke_opacity": 0.0,
        "estimated_plume_spread_radius_meters": 0,
        "detected_visual_markers": [],
        "recommended_ulb_action": None,
        "summary_assessment": "Rejected: No visible air pollution hazard identified."
    }
}


def get_sample_by_archetype(archetype: str) -> Optional[Dict[str, Any]]:
    """Retrieves a sample audit fixture by its pollution archetype string."""
    return SAMPLE_AUDIT_PAYLOADS.get(archetype)


def get_sample_by_city(city_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves the flagship audit fixture matching a given city identifier."""
    for payload in SAMPLE_AUDIT_PAYLOADS.values():
        if payload.get("city_id") == city_id:
            return payload
    return SAMPLE_AUDIT_PAYLOADS["OPEN_MUNICIPAL_WASTE_BURNING"]


def list_available_archetypes() -> list:
    """Lists all available 6-way classification archetype keys."""
    return list(SAMPLE_AUDIT_PAYLOADS.keys())
