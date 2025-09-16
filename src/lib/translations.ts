export interface Translations {
  // Navigation
  dashboard: string;
  cropDetection: string;
  soilDetection: string;
  farmerRegistration: string;
  adminDashboard: string;
  login: string;
  logout: string;
  
  // Dashboard
  welcomeMessage: string;
  cropHealthOverview: string;
  environmentalData: string;
  recentAlerts: string;
  
  // Crop Detection
  cropHealthAnalysis: string;
  uploadImage: string;
  analyzeHealth: string;
  healthStatus: string;
  recommendations: string;
  
  // Soil Detection
  soilHealthAnalysis: string;
  soilMoisture: string;
  phLevel: string;
  nutrients: string;
  
  // Environmental Panel
  temperature: string;
  humidity: string;
  soilMoistureLevel: string;
  lightIntensity: string;
  
  // Alerts
  alerts: string;
  pestAlert: string;
  weatherAlert: string;
  
  // Forms
  name: string;
  email: string;
  phone: string;
  address: string;
  farmSize: string;
  cropType: string;
  register: string;
  submit: string;
  
  // Common
  loading: string;
  error: string;
  success: string;
  cancel: string;
  save: string;
  edit: string;
  delete: string;
  view: string;
  
  // Language
  language: string;
  changeLanguage: string;

  // Additional fields from existing system
  cropHealth: string;
  environmental: string;
  trends: string;
  settings: string;
  subtitle: string;
  fieldOverview: string;
  healthyZones: string;
  stressedZones: string;
  criticalZones: string;
  vegetationIndex: string;
  soilCondition: string;
  airTemperature: string;
  leafWetness: string;
  lastUpdated: string;
  pestRisk: string;
  diseaseRisk: string;
  irrigationNeeded: string;
  high: string;
  medium: string;
  low: string;
  weeklyTrend: string;
  monthlyTrend: string;
  prediction: string;
  viewDetails: string;
  takeAction: string;
  dismiss: string;
  healthy: string;
  stressed: string;
  critical: string;
  normal: string;
  warning: string;
  celsius: string;
  percentage: string;
  hectares: string;
}

export const translations: Record<string, Translations> = {
  en: {
    // Navigation & General
    dashboard: "Dashboard",
    cropHealth: "Crop Health",
    environmental: "Environmental Data",
    alerts: "Alerts",
    trends: "Trends",
    settings: "Settings",
    
    // Dashboard
    welcomeMessage: "Agricultural Monitoring System",
    subtitle: "AI-Powered Precision Farming for Kerala",
    
    // Navigation
    cropDetection: "Crop Detection",
    soilDetection: "Soil Detection",
    farmerRegistration: "Farmer Registration",
    adminDashboard: "Admin Dashboard",
    login: "Login",
    logout: "Logout",
    
    // Dashboard
    cropHealthOverview: "Crop Health Overview",
    environmentalData: "Environmental Data",
    recentAlerts: "Recent Alerts",
    
    // Crop Health
    fieldOverview: "Field Overview",
    healthyZones: "Healthy Zones",
    stressedZones: "Stressed Zones",
    criticalZones: "Critical Zones",
    vegetationIndex: "Vegetation Index",
    soilCondition: "Soil Condition",
    
    // Crop Detection
    cropHealthAnalysis: "Crop Health Analysis",
    uploadImage: "Upload Image",
    analyzeHealth: "Analyze Health",
    healthStatus: "Health Status",
    recommendations: "Recommendations",
    
    // Soil Detection
    soilHealthAnalysis: "Soil Health Analysis",
    soilMoisture: "Soil Moisture",
    phLevel: "pH Level",
    nutrients: "Nutrients",
    
    // Environmental Data
    airTemperature: "Air Temperature",
    humidity: "Humidity",
    soilMoistureLevel: "Soil Moisture Level",
    leafWetness: "Leaf Wetness",
    lastUpdated: "Last Updated",
    
    // Environmental Panel
    temperature: "Temperature",
    lightIntensity: "Light Intensity",
    
    // Alerts
    pestRisk: "Pest Risk",
    diseaseRisk: "Disease Risk",
    weatherAlert: "Weather Alert",
    irrigationNeeded: "Irrigation Needed",
    high: "High",
    medium: "Medium",
    low: "Low",
    pestAlert: "Pest Alert",
    
    // Trends
    weeklyTrend: "Weekly Trend",
    monthlyTrend: "Monthly Trend",
    prediction: "Prediction",
    
    // Actions
    viewDetails: "View Details",
    takeAction: "Take Action",
    dismiss: "Dismiss",
    
    // Forms
    name: "Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    farmSize: "Farm Size",
    cropType: "Crop Type",
    register: "Register",
    submit: "Submit",
    
    // Status
    healthy: "Healthy",
    stressed: "Stressed",
    critical: "Critical",
    normal: "Normal",
    warning: "Warning",
    
    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    
    // Language
    language: "Language",
    changeLanguage: "Change Language",
    
    // Units
    celsius: "°C",
    percentage: "%",
    hectares: "hectares"
  },
  
  ml: {
    // Navigation & General
    dashboard: "ഡാഷ്‌ബോർഡ്",
    cropHealth: "വിള ആരോഗ്യം",
    environmental: "പാരിസ്ഥിതിക ഡാറ്റ",
    alerts: "മുന്നറിയിപ്പുകൾ",
    trends: "പ്രവണതകൾ",
    settings: "ക്രമീകരണങ്ങൾ",
    
    // Dashboard
    welcomeMessage: "കാർഷിക നിരീക്ഷണ സംവിധാനം",
    subtitle: "കേരളത്തിനായുള്ള AI-പവർഡ് കൃത്യമായ കൃഷി",
    
    // Navigation
    cropDetection: "വിള കണ്ടെത്തൽ",
    soilDetection: "മണ്ണ് കണ്ടെത്തൽ",
    farmerRegistration: "കർഷക രജിസ്ട്രേഷൻ",
    adminDashboard: "അഡ്മിൻ ഡാഷ്‌ബോർഡ്",
    login: "ലോഗിൻ",
    logout: "ലോഗൗട്ട്",
    
    // Dashboard
    cropHealthOverview: "വിള ആരോഗ്യ അവലോകനം",
    environmentalData: "പാരിസ്ഥിതിക ഡാറ്റ",
    recentAlerts: "സമീപകാല അലേർട്ടുകൾ",
    
    // Crop Health
    fieldOverview: "വയൽ അവലോകനം",
    healthyZones: "ആരോഗ്യകരമായ പ്രദേശങ്ങൾ",
    stressedZones: "സമ്മർദ്ദത്തിലുള്ള പ്രദേശങ്ങൾ",
    criticalZones: "ഗുരുതരമായ പ്രദേശങ്ങൾ",
    vegetationIndex: "സസ്യജാല സൂചിക",
    soilCondition: "മണ്ണിന്റെ അവസ്ഥ",
    
    // Crop Detection
    cropHealthAnalysis: "വിള ആരോഗ്യ വിശകലനം",
    uploadImage: "ചിത്രം അപ്‌ലോഡ് ചെയ്യുക",
    analyzeHealth: "ആരോഗ്യം വിശകലനം ചെയ്യുക",
    healthStatus: "ആരോഗ്യ നില",
    recommendations: "ശുപാർശകൾ",
    
    // Soil Detection
    soilHealthAnalysis: "മണ്ണിന്റെ ആരോഗ്യ വിശകലനം",
    soilMoisture: "മണ്ണിലെ ഈർപ്പം",
    phLevel: "പിഎച്ച് ലെവൽ",
    nutrients: "പോഷകങ്ങൾ",
    
    // Environmental Data
    airTemperature: "വായുവിന്റെ താപനില",
    humidity: "ആർദ്രത",
    soilMoistureLevel: "മണ്ണിന്റെ ഈർപ്പ നില",
    leafWetness: "ഇലയിലെ ഈർപ്പം",
    lastUpdated: "അവസാനം അപ്‌ഡേറ്റ് ചെയ്തത്",
    
    // Environmental Panel
    temperature: "താപനില",
    lightIntensity: "പ്രകാശ തീവ്രത",
    
    // Alerts
    pestRisk: "കീട അപകടസാധ്യത",
    diseaseRisk: "രോഗ അപകടസാധ്യത",
    weatherAlert: "കാലാവസ്ഥാ മുന്നറിയിപ്പ്",
    irrigationNeeded: "ജലസേചനം ആവശ്യം",
    high: "ഉയർന്നത്",
    medium: "ഇടത്തരം",
    low: "കുറഞ്ഞത്",
    pestAlert: "കീട അലേർട്ട്",
    
    // Trends
    weeklyTrend: "പ്രതിവാര പ്രവണത",
    monthlyTrend: "പ്രതിമാസ പ്രവണത",
    prediction: "പ്രവചനം",
    
    // Actions
    viewDetails: "വിശദാംശങ്ങൾ കാണുക",
    takeAction: "നടപടി എടുക്കുക",
    dismiss: "നിരസിക്കുക",
    
    // Forms
    name: "പേര്",
    email: "ഇമെയിൽ",
    phone: "ഫോൺ",
    address: "വിലാസം",
    farmSize: "കൃഷിയിടത്തിന്റെ വലുപ്പം",
    cropType: "വിള തരം",
    register: "രജിസ്റ്റർ ചെയ്യുക",
    submit: "സമർപ്പിക്കുക",
    
    // Status
    healthy: "ആരോഗ്യകരം",
    stressed: "സമ്മർദ്ദത്തിൽ",
    critical: "ഗുരുതരം",
    normal: "സാധാരണ",
    warning: "മുന്നറിയിപ്പ്",
    
    // Common
    loading: "ലോഡ് ചെയ്യുന്നു...",
    error: "പിശക്",
    success: "വിജയം",
    cancel: "റദ്ദാക്കുക",
    save: "സേവ് ചെയ്യുക",
    edit: "എഡിറ്റ് ചെയ്യുക",
    delete: "ഇല്ലാതാക്കുക",
    view: "കാണുക",
    
    // Language
    language: "ഭാഷ",
    changeLanguage: "ഭാഷ മാറ്റുക",
    
    // Units
    celsius: "°സെ",
    percentage: "%",
    hectares: "ഹെക്ടർ"
  },
  
  hi: {
    // Navigation & General
    dashboard: "डैशबोर्ड",
    cropHealth: "फसल स्वास्थ्य",
    environmental: "पर्यावरणीय डेटा",
    alerts: "अलर्ट",
    trends: "रुझान",
    settings: "सेटिंग्स",
    
    // Dashboard
    welcomeMessage: "कृषि निगरानी प्रणाली",
    subtitle: "केरल के लिए AI-संचालित सटीक खेती",
    
    // Navigation
    cropDetection: "फसल का पता लगाना",
    soilDetection: "मिट्टी की जांच",
    farmerRegistration: "किसान पंजीकरण",
    adminDashboard: "एडमिन डैशबोर्ड",
    login: "लॉग इन",
    logout: "लॉग आउट",
    
    // Dashboard
    cropHealthOverview: "फसल स्वास्थ्य अवलोकन",
    environmentalData: "पर्यावरणीय डेटा",
    recentAlerts: "हाल की अलर्ट",
    
    // Crop Health
    fieldOverview: "खेत का अवलोकन",
    healthyZones: "स्वस्थ क्षेत्र",
    stressedZones: "तनावग्रस्त क्षेत्र",
    criticalZones: "गंभीर क्षेत्र",
    vegetationIndex: "वनस्पति सूचकांक",
    soilCondition: "मिट्टी की स्थिति",
    
    // Crop Detection
    cropHealthAnalysis: "फसल स्वास्थ्य विश्लेषण",
    uploadImage: "छवि अपलोड करें",
    analyzeHealth: "स्वास्थ्य का विश्लेषण करें",
    healthStatus: "स्वास्थ्य स्थिति",
    recommendations: "सिफारिशें",
    
    // Soil Detection
    soilHealthAnalysis: "मिट्टी स्वास्थ्य विश्लेषण",
    soilMoisture: "मिट्टी की नमी",
    phLevel: "पीएच स्तर",
    nutrients: "पोषक तत्व",
    
    // Environmental Data
    airTemperature: "हवा का तापमान",
    humidity: "आर्द्रता",
    soilMoistureLevel: "मिट्टी की नमी का स्तर",
    leafWetness: "पत्ती की नमी",
    lastUpdated: "अंतिम अपडेट",
    
    // Environmental Panel
    temperature: "तापमान",
    lightIntensity: "प्रकाश की तीव्रता",
    
    // Alerts
    pestRisk: "कीट जोखिम",
    diseaseRisk: "रोग जोखिम",
    weatherAlert: "मौसम अलर्ट",
    irrigationNeeded: "सिंचाई की आवश्यकता",
    high: "उच्च",
    medium: "मध्यम",
    low: "कम",
    pestAlert: "कीट अलर्ट",
    
    // Trends
    weeklyTrend: "साप्ताहिक रुझान",
    monthlyTrend: "मासिक रुझान",
    prediction: "भविष्यवाणी",
    
    // Actions
    viewDetails: "विवरण देखें",
    takeAction: "कार्रवाई करें",
    dismiss: "खारिज करें",
    
    // Forms
    name: "नाम",
    email: "ईमेल",
    phone: "फोन",
    address: "पता",
    farmSize: "खेत का आकार",
    cropType: "फसल का प्रकार",
    register: "पंजीकरण करें",
    submit: "जमा करें",
    
    // Status
    healthy: "स्वस्थ",
    stressed: "तनावग्रस्त",
    critical: "गंभीर",
    normal: "सामान्य",
    warning: "चेतावनी",
    
    // Common
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    success: "सफलता",
    cancel: "रद्द करें",
    save: "सेव करें",
    edit: "संपादित करें",
    delete: "हटाएं",
    view: "देखें",
    
    // Language
    language: "भाषा",
    changeLanguage: "भाषा बदलें",
    
    // Units
    celsius: "°C",
    percentage: "%",
    hectares: "हेक्टेयर"
  },
  
  bn: {
    // Navigation & General
    dashboard: "ড্যাশবোর্ড",
    cropHealth: "ফসলের স্বাস্থ্য",
    environmental: "পরিবেশগত তথ্য",
    alerts: "সতর্কতা",
    trends: "প্রবণতা",
    settings: "সেটিংস",
    
    // Dashboard
    welcomeMessage: "কৃষি পর্যবেক্ষণ ব্যবস্থা",
    subtitle: "কেরালার জন্য AI-চালিত নির্ভুল কৃষি",
    
    // Navigation
    cropDetection: "ফসল সনাক্তকরণ",
    soilDetection: "মাটি সনাক্তকরণ",
    farmerRegistration: "কৃষক নিবন্ধন",
    adminDashboard: "অ্যাডমিন ড্যাশবোর্ড",
    login: "লগইন",
    logout: "লগআউট",
    
    // Dashboard
    cropHealthOverview: "ফসলের স্বাস্থ্য পর্যালোচনা",
    environmentalData: "পরিবেশগত তথ্য",
    recentAlerts: "সাম্প্রতিক সতর্কতা",
    
    // Crop Health
    fieldOverview: "ক্ষেতের পর্যালোচনা",
    healthyZones: "স্বাস্থ্যকর অঞ্চল",
    stressedZones: "চাপগ্রস্ত অঞ্চল",
    criticalZones: "সংকটপূর্ণ অঞ্চল",
    vegetationIndex: "উদ্ভিদ সূচক",
    soilCondition: "মাটির অবস্থা",
    
    // Crop Detection
    cropHealthAnalysis: "ফসলের স্বাস্থ্য বিশ্লেষণ",
    uploadImage: "ছবি আপলোড করুন",
    analyzeHealth: "স্বাস্থ্য বিশ্লেষণ করুন",
    healthStatus: "স্বাস্থ্যের অবস্থা",
    recommendations: "সুপারিশ",
    
    // Soil Detection
    soilHealthAnalysis: "মাটির স্বাস্থ্য বিশ্লেষণ",
    soilMoisture: "মাটির আর্দ্রতা",
    phLevel: "পিএইচ স্তর",
    nutrients: "পুষ্টি উপাদান",
    
    // Environmental Data
    airTemperature: "বাতাসের তাপমাত্রা",
    humidity: "আর্দ্রতা",
    soilMoistureLevel: "মাটির আর্দ্রতার স্তর",
    leafWetness: "পাতার আর্দ্রতা",
    lastUpdated: "সর্বশেষ আপডেট",
    
    // Environmental Panel
    temperature: "তাপমাত্রা",
    lightIntensity: "আলোর তীব্রতা",
    
    // Alerts
    pestRisk: "কীটপতঙ্গের ঝুঁকি",
    diseaseRisk: "রোগের ঝুঁকি",
    weatherAlert: "আবহাওয়া সতর্কতা",
    irrigationNeeded: "সেচের প্রয়োজন",
    high: "উচ্চ",
    medium: "মধ্যম",
    low: "নিম্ন",
    pestAlert: "কীটপতঙ্গ সতর্কতা",
    
    // Trends
    weeklyTrend: "সাপ্তাহিক প্রবণতা",
    monthlyTrend: "মাসিক প্রবণতা",
    prediction: "পূর্ভাবাস",
    
    // Actions
    viewDetails: "বিস্তারিত দেখুন",
    takeAction: "পদক্ষেপ নিন",
    dismiss: "বাতিল করুন",
    
    // Forms
    name: "নাম",
    email: "ইমেইল",
    phone: "ফোন",
    address: "ঠিকানা",
    farmSize: "খামারের আকার",
    cropType: "ফসলের ধরন",
    register: "নিবন্ধন করুন",
    submit: "জমা দিন",
    
    // Status
    healthy: "স্বাস্থ্যকর",
    stressed: "চাপগ্রস্ত",
    critical: "সংকটপূর্ণ",
    normal: "স্বাভাবিক",
    warning: "সতর্কতা",
    
    // Common
    loading: "লোড হচ্ছে...",
    error: "ত্রুটি",
    success: "সফলতা",
    cancel: "বাতিল",
    save: "সংরক্ষণ করুন",
    edit: "সম্পাদনা করুন",
    delete: "মুছে ফেলুন",
    view: "দেখুন",
    
    // Language
    language: "ভাষা",
    changeLanguage: "ভাষা পরিবর্তন করুন",
    
    // Units
    celsius: "°C",
    percentage: "%",
    hectares: "হেক্টর"
  },
  
  gu: {
    // Navigation & General
    dashboard: "ડેશબોર્ડ",
    cropHealth: "પાક આરોગ્ય",
    environmental: "પર્યાવરણીય ડેટા",
    alerts: "અલર્ટ્સ",
    trends: "વલણો",
    settings: "સેટિંગ્સ",
    
    // Dashboard
    welcomeMessage: "કૃષિ નિરીક્ષણ સિસ્ટમ",
    subtitle: "કેરળ માટે AI-સંચાલિત ચોક્કસ ખેતી",
    
    // Navigation
    cropDetection: "પાક શોધ",
    soilDetection: "માટી શોધ",
    farmerRegistration: "ખેડૂત નોંધણી",
    adminDashboard: "એડમિન ડેશબોર્ડ",
    login: "લોગિન",
    logout: "લોગઆઉટ",
    
    // Dashboard
    cropHealthOverview: "પાક આરોગ્ય વિહંગાવલોકન",
    environmentalData: "પર્યાવરણીય ડેટા",
    recentAlerts: "તાજેતરના અલર્ટ્સ",
    
    // Crop Health
    fieldOverview: "ખેતરનું વિહંગાવલોકન",
    healthyZones: "આરોગ્યપ્રદ વિસ્તારો",
    stressedZones: "તણાવગ્રસ્ત વિસ્તારો",
    criticalZones: "ગંભીર વિસ્તારો",
    vegetationIndex: "વનસ્પતિ સૂચકાંક",
    soilCondition: "માટીની સ્થિતિ",
    
    // Crop Detection
    cropHealthAnalysis: "પાક આરોગ્ય વિશ્લેષણ",
    uploadImage: "છબી અપલોડ કરો",
    analyzeHealth: "આરોગ્યનું વિશ્લેષણ કરો",
    healthStatus: "આરોગ્ય સ્થિતિ",
    recommendations: "ભલામણો",
    
    // Soil Detection
    soilHealthAnalysis: "માટી આરોગ્ય વિશ્લેષણ",
    soilMoisture: "માટીની ભેજ",
    phLevel: "પીએચ સ્તર",
    nutrients: "પોષક તત્વો",
    
    // Environmental Data
    airTemperature: "હવાનું તાપમાન",
    humidity: "ભેજ",
    soilMoistureLevel: "માટીની ભેજનું સ્તર",
    leafWetness: "પાંદડાની ભેજ",
    lastUpdated: "છેલ્લે અપડેટ",
    
    // Environmental Panel
    temperature: "તાપમાન",
    lightIntensity: "પ્રકાશની તીવ્રતા",
    
    // Alerts
    pestRisk: "જીવાતનું જોખમ",
    diseaseRisk: "રોગનું જોખમ",
    weatherAlert: "હવામાન અલર્ટ",
    irrigationNeeded: "સિંચાઈની જરૂર",
    high: "ઊંચું",
    medium: "મધ્યમ",
    low: "નીચું",
    pestAlert: "જીવાત અલર્ટ",
    
    // Trends
    weeklyTrend: "સાપ્તાહિક વલણ",
    monthlyTrend: "માસિક વલણ",
    prediction: "આગાહી",
    
    // Actions
    viewDetails: "વિગતો જુઓ",
    takeAction: "પગલાં લો",
    dismiss: "બરતરફ કરો",
    
    // Forms
    name: "નામ",
    email: "ઈમેઈલ",
    phone: "ફોન",
    address: "સરનામું",
    farmSize: "ખેતરનું કદ",
    cropType: "પાકનો પ્રકાર",
    register: "નોંધણી કરો",
    submit: "સબમિટ કરો",
    
    // Status
    healthy: "આરોગ્યપ્રદ",
    stressed: "તણાવગ્રસ્ત",
    critical: "ગંભીર",
    normal: "સામાન્ય",
    warning: "ચેતવણી",
    
    // Common
    loading: "લોડ થઈ રહ્યું છે...",
    error: "ભૂલ",
    success: "સફળતા",
    cancel: "રદ કરો",
    save: "સેવ કરો",
    edit: "સંપાદિત કરો",
    delete: "કાઢી નાખો",
    view: "જુઓ",
    
    // Language
    language: "ભાષા",
    changeLanguage: "ભાષા બદલો",
    
    // Units
    celsius: "°C",
    percentage: "%",
    hectares: "હેક્ટર"
  },
  
  ta: {
    // Navigation & General
    dashboard: "டாஷ்போர்டு",
    cropHealth: "பயிர் ஆரோக்கியம்",
    environmental: "சுற்றுச்சூழல் தரவு",
    alerts: "எச்சரிக்கைகள்",
    trends: "போக்குகள்",
    settings: "அமைப்புகள்",
    
    // Dashboard
    welcomeMessage: "விவசாய கண்காணிப்பு அமைப்பு",
    subtitle: "கேரளாவிற்கான AI-இயங்கும் துல்லியமான விவசாயம்",
    
    // Navigation
    cropDetection: "பயிர் கண்டறிதல்",
    soilDetection: "மண் கண்டறிதல்",
    farmerRegistration: "விவசாயி பதிவு",
    adminDashboard: "நிர்வாக டாஷ்போர்டு",
    login: "உள்நுழைவு",
    logout: "வெளியேறு",
    
    // Dashboard
    cropHealthOverview: "பயிர் ஆரோக்கிய மேலோட்டம்",
    environmentalData: "சுற்றுச்சூழல் தரவு",
    recentAlerts: "சமீபத்திய எச்சரிக்கைகள்",
    
    // Crop Health
    fieldOverview: "வயல் மேலோட்டம்",
    healthyZones: "ஆரோக்கியமான பகுதிகள்",
    stressedZones: "அழுத்தமான பகுதிகள்",
    criticalZones: "முக்கியமான பகுதிகள்",
    vegetationIndex: "தாவர குறியீடு",
    soilCondition: "மண் நிலை",
    
    // Crop Detection
    cropHealthAnalysis: "பயிர் ஆரோக்கிய பகுப்பாய்வு",
    uploadImage: "படத்தை பதிவேற்றவும்",
    analyzeHealth: "ஆரோக்கியத்தை பகுப்பாய்வு செய்யவும்",
    healthStatus: "ஆரோக்கிய நிலை",
    recommendations: "பரிந்துரைகள்",
    
    // Soil Detection
    soilHealthAnalysis: "மண் ஆரோக்கிய பகுப்பாய்வு",
    soilMoisture: "மண் ஈரப்பதம்",
    phLevel: "பிஎச் அளவு",
    nutrients: "ஊட்டச்சத்துக்கள்",
    
    // Environmental Data
    airTemperature: "காற்று வெப்பநிலை",
    humidity: "ஈரப்பதம்",
    soilMoistureLevel: "மண் ஈரப்பத அளவு",
    leafWetness: "இலை ஈரப்பதம்",
    lastUpdated: "கடைசியாக புதுப்பிக்கப்பட்டது",
    
    // Environmental Panel
    temperature: "வெப்பநிலை",
    lightIntensity: "ஒளி தீவிரம்",
    
    // Alerts
    pestRisk: "பூச்சி ஆபத்து",
    diseaseRisk: "நோய் ஆபத்து",
    weatherAlert: "வானிலை எச்சரிக்கை",
    irrigationNeeded: "நீர்ப்பாசனம் தேவை",
    high: "உயர்ந்த",
    medium: "நடுத்தர",
    low: "குறைந்த",
    pestAlert: "பூச்சி எச்சரிக்கை",
    
    // Trends
    weeklyTrend: "வாராந்திர போக்கு",
    monthlyTrend: "மாதாந்திர போக்கு",
    prediction: "முன்னறிவிப்பு",
    
    // Actions
    viewDetails: "விவரங்களைப் பார்க்கவும்",
    takeAction: "நடவடிக்கை எடுக்கவும்",
    dismiss: "நிராகரிக்கவும்",
    
    // Forms
    name: "பெயர்",
    email: "மின்னஞ்சல்",
    phone: "தொலைபேசி",
    address: "முகவரி",
    farmSize: "பண்ணை அளவு",
    cropType: "பயிர் வகை",
    register: "பதிவு செய்யவும்",
    submit: "சமர்ப்பிக்கவும்",
    
    // Status
    healthy: "ஆரோக்கியமான",
    stressed: "அழுத்தமான",
    critical: "முக்கியமான",
    normal: "சாதாரண",
    warning: "எச்சரிக்கை",
    
    // Common
    loading: "ஏற்றுகிறது...",
    error: "பிழை",
    success: "வெற்றி",
    cancel: "ரத்து செய்",
    save: "சேமிக்கவும்",
    edit: "திருத்தவும்",
    delete: "நீக்கவும்",
    view: "பார்க்கவும்",
    
    // Language
    language: "மொழி",
    changeLanguage: "மொழியை மாற்றவும்",
    
    // Units
    celsius: "°C",
    percentage: "%",
    hectares: "ஹெக்டேர்"
  },
  
  te: {
    // Navigation & General
    dashboard: "డాష్‌బోర్డ్",
    cropHealth: "పంట ఆరోగ్యం",
    environmental: "పర్యావరణ డేటా",
    alerts: "హెచ్చరికలు",
    trends: "ధోరణులు",
    settings: "సెట్టింగులు",
    
    // Dashboard
    welcomeMessage: "వ్యవసాయ పర్యవేక్షణ వ్యవస్థ",
    subtitle: "కేరళ కోసం AI-చాలిత ఖచ్చితమైన వ్యవసాయం",
    
    // Navigation
    cropDetection: "పంట గుర్తింపు",
    soilDetection: "మట్టి గుర్తింపు",
    farmerRegistration: "రైతు నమోదు",
    adminDashboard: "అడ్మిన్ డాష్‌బోర్డ్",
    login: "లాగిన్",
    logout: "లాగౌట్",
    
    // Dashboard
    cropHealthOverview: "పంట ఆరోగ్య సమీక్ష",
    environmentalData: "పర్యావరణ డేటా",
    recentAlerts: "ఇటీవలి హెచ్చరికలు",
    
    // Crop Health
    fieldOverview: "పొలం సమీక్ష",
    healthyZones: "ఆరోగ్యకరమైన ప్రాంతాలు",
    stressedZones: "ఒత్తిడిలో ఉన్న ప్రాంతాలు",
    criticalZones: "క్లిష్టమైన ప్రాంతాలు",
    vegetationIndex: "వృక్షసంపద సూచిక",
    soilCondition: "మట్టి పరిస్థితి",
    
    // Crop Detection
    cropHealthAnalysis: "పంట ఆరోగ్య విశ్లేషణ",
    uploadImage: "చిత్రాన్ని అప్‌లోడ్ చేయండి",
    analyzeHealth: "ఆరోగ్యాన్ని విశ్లేషించండి",
    healthStatus: "ఆరోగ్య స్థితి",
    recommendations: "సిఫార్సులు",
    
    // Soil Detection
    soilHealthAnalysis: "మట్టి ఆరోగ్య విశ్లేషణ",
    soilMoisture: "మట్టి తేమ",
    phLevel: "పిహెచ్ స్థాయి",
    nutrients: "పోషకాలు",
    
    // Environmental Data
    airTemperature: "గాలి ఉష్ణోగ్రత",
    humidity: "తేమ",
    soilMoistureLevel: "మట్టి తేమ స్థాయి",
    leafWetness: "ఆకు తేమ",
    lastUpdated: "చివరిగా అప్‌డేట్ చేయబడింది",
    
    // Environmental Panel
    temperature: "ఉష్ణోగ్రత",
    lightIntensity: "కాంతి తీవ్రత",
    
    // Alerts
    pestRisk: "కీటక ప్రమాదం",
    diseaseRisk: "వ్యాధి ప్రమాదం",
    weatherAlert: "వాతావరణ హెచ్చరిక",
    irrigationNeeded: "నీటిపారుదల అవసరం",
    high: "అధిక",
    medium: "మధ్యమ",
    low: "తక్కువ",
    pestAlert: "కీటక హెచ్చరిక",
    
    // Trends
    weeklyTrend: "వారపు ధోరణి",
    monthlyTrend: "నెలవారీ ధోరణి",
    prediction: "అంచనా",
    
    // Actions
    viewDetails: "వివరాలు చూడండి",
    takeAction: "చర్య తీసుకోండి",
    dismiss: "తోసిపుచ్చండి",
    
    // Forms
    name: "పేరు",
    email: "ఇమెయిల్",
    phone: "ఫోన్",
    address: "చిరునామా",
    farmSize: "వ్యవసాయ భూమి పరిమాణం",
    cropType: "పంట రకం",
    register: "నమోదు చేయండి",
    submit: "సమర్పించండి",
    
    // Status
    healthy: "ఆరోగ్యకరమైన",
    stressed: "ఒత్తిడిలో",
    critical: "క్లిష్టమైన",
    normal: "సాధారణ",
    warning: "హెచ్చరిక",
    
    // Common
    loading: "లోడ్ అవుతోంది...",
    error: "లోపం",
    success: "విజయం",
    cancel: "రద్దు చేయండి",
    save: "సేవ్ చేయండి",
    edit: "సవరించండి",
    delete: "తొలగించండి",
    view: "చూడండి",
    
    // Language
    language: "భాష",
    changeLanguage: "భాష మార్చండి",
    
    // Units
    celsius: "°C",
    percentage: "%",
    hectares: "హెక్టార్లు"
  },
  
  as: {
    // Navigation & General
    dashboard: "ডেশ্ববর্ড",
    cropHealth: "শস্যৰ স্বাস্থ্য",
    environmental: "পৰিৱেশগত তথ্য",
    alerts: "সতৰ্কবাণী",
    trends: "প্ৰৱণতা",
    settings: "ছেটিংছ",
    
    // Dashboard
    welcomeMessage: "কৃষি নিৰীক্ষণ ব্যৱস্থা",
    subtitle: "কেৰালাৰ বাবে AI-চালিত নিৰ্ভুল কৃষি",
    
    // Navigation
    cropDetection: "শস্য চিনাক্তকৰণ",
    soilDetection: "মাটি চিনাক্তকৰণ",
    farmerRegistration: "কৃষক পঞ্জীয়ন",
    adminDashboard: "প্ৰশাসক ডেশ্ববর্ড",
    login: "লগইন",
    logout: "লগআউট",
    
    // Dashboard
    cropHealthOverview: "শস্যৰ স্বাস্থ্য অৱলোকন",
    environmentalData: "পৰিৱেশগত তথ্য",
    recentAlerts: "শেহতীয়া সতৰ্কবাণী",
    
    // Crop Health
    fieldOverview: "পথাৰৰ অৱলোকন",
    healthyZones: "স্বাস্থ্যকৰ অঞ্চল",
    stressedZones: "চাপগ্ৰস্ত অঞ্চল",
    criticalZones: "গুৰুতৰ অঞ্চল",
    vegetationIndex: "উদ্ভিদ সূচক",
    soilCondition: "মাটিৰ অৱস্থা",
    
    // Crop Detection
    cropHealthAnalysis: "শস্যৰ স্বাস্থ্য বিশ্লেষণ",
    uploadImage: "ছবি আপলোড কৰক",
    analyzeHealth: "স্বাস্থ্য বিশ্লেষণ কৰক",
    healthStatus: "স্বাস্থ্যৰ অৱস্থা",
    recommendations: "পৰামৰ্শ",
    
    // Soil Detection
    soilHealthAnalysis: "মাটিৰ স্বাস্থ্য বিশ্লেষণ",
    soilMoisture: "মাটিৰ আৰ্দ্ৰতা",
    phLevel: "পিএইচ স্তৰ",
    nutrients: "পুষ্টিকৰ উপাদান",
    
    // Environmental Data
    airTemperature: "বায়ুৰ উষ্ণতা",
    humidity: "আৰ্দ্ৰতা",
    soilMoistureLevel: "মাটিৰ আৰ্দ্ৰতাৰ স্তৰ",
    leafWetness: "পাতৰ আৰ্দ্ৰতা",
    lastUpdated: "শেষবাৰ আপডেট",
    
    // Environmental Panel
    temperature: "উষ্ণতা",
    lightIntensity: "পোহৰৰ তীব্ৰতা",
    
    // Alerts
    pestRisk: "কীট-পতংগৰ বিপদ",
    diseaseRisk: "ৰোগৰ বিপদ",
    weatherAlert: "বতৰৰ সতৰ্কবাণী",
    irrigationNeeded: "জলসিঞ্চনৰ প্ৰয়োজন",
    high: "উচ্চ",
    medium: "মধ্যম",
    low: "নিম্ন",
    pestAlert: "কীট-পতংগৰ সতৰ্কবাণী",
    
    // Trends
    weeklyTrend: "সাপ্তাহিক প্ৰৱণতা",
    monthlyTrend: "মাহেকীয়া প্ৰৱণতা",
    prediction: "পূৰ্বাভাস",
    
    // Actions
    viewDetails: "বিৱৰণ চাওক",
    takeAction: "পদক্ষেপ লওক",
    dismiss: "নাকচ কৰক",
    
    // Forms
    name: "নাম",
    email: "ইমেইল",
    phone: "ফোন",
    address: "ঠিকনা",
    farmSize: "খেতিৰ আকাৰ",
    cropType: "শস্যৰ প্ৰকাৰ",
    register: "পঞ্জীয়ন কৰক",
    submit: "দাখিল কৰক",
    
    // Status
    healthy: "স্বাস্থ্যকৰ",
    stressed: "চাপগ্ৰস্ত",
    critical: "গুৰুতৰ",
    normal: "স্বাভাৱিক",
    warning: "সতৰ্কবাণী",
    
    // Common
    loading: "লোড হৈ আছে...",
    error: "ত্ৰুটি",
    success: "সফলতা",
    cancel: "বাতিল কৰক",
    save: "সংৰক্ষণ কৰক",
    edit: "সম্পাদনা কৰক",
    delete: "মচি পেলাওক",
    view: "চাওক",
    
    // Language
    language: "ভাষা",
    changeLanguage: "ভাষা সলনি কৰক",
    
    // Units
    celsius: "°C",
    percentage: "%",
    hectares: "হেক্টৰ"
  }
};

export const languageOptions = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
];

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;

export const useTranslation = (language: string): Translations => {
  return translations[language] || translations.en;
};