export interface Translations {
  // Navigation
  dashboard: string;
  cropDetection: string;
  soilDetection: string;
  pestDetection: string;
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
  
  // Pest Detection
  pestDetectionAnalysis: string;
  pestIdentification: string;
  pestStatus: string;
  treatmentPlan: string;
  preventionTips: string;
  
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
  
  // Chatbot
  aiAssistant: string;
  typeMessage: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  farmSize: string;
  cropType: string;
  register: string;
  submit: string;
  
  // Aadhaar System
  aadhaarNumber: string;
  scanQR: string;
  fetchFromAadhaar: string;
  aadhaarVerification: string;
  autoFillFromAadhaar: string;
  
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
  
  // Additional fields
  subtitle?: string;
  acres?: string;
  hectares?: string;
  corn?: string;
  vegetables?: string;
  both?: string;
  createAccount?: string;
  loginWithAadhaar?: string;
  enterOtp?: string;
  verifyOtp?: string;
  farmDetails?: string;
  cropTypes?: string;
  signIn?: string;
}

export const translations: Record<string, Translations> = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    cropDetection: "Crop Detection",
    soilDetection: "Soil Detection",
    pestDetection: "Pest Detection",
    farmerRegistration: "Farmer Registration",
    adminDashboard: "Admin Dashboard",
    login: "Login",
    logout: "Logout",
    
    // Dashboard
    welcomeMessage: "Welcome to AgroWatch",
    cropHealthOverview: "Crop Health Overview",
    environmentalData: "Environmental Data",
    recentAlerts: "Recent Alerts",
    
    // Crop Detection
    cropHealthAnalysis: "Crop Health Analysis",
    uploadImage: "Upload Image",
    analyzeHealth: "Analyze Health",
    healthStatus: "Health Status",
    recommendations: "Recommendations",
    
    // Pest Detection
    pestDetectionAnalysis: "Pest Detection Analysis",
    pestIdentification: "Pest Identification",
    pestStatus: "Pest Status",
    treatmentPlan: "Treatment Plan",
    preventionTips: "Prevention Tips",
    
    // Soil Detection
    soilHealthAnalysis: "Soil Health Analysis",
    soilMoisture: "Soil Moisture",
    phLevel: "pH Level",
    nutrients: "Nutrients",
    
    // Environmental Panel
    temperature: "Temperature",
    humidity: "Humidity",
    soilMoistureLevel: "Soil Moisture Level",
    lightIntensity: "Light Intensity",
    
    // Alerts
    alerts: "Alerts",
    pestAlert: "Pest Alert",
    weatherAlert: "Weather Alert",
    
    // Forms
    name: "Name",
    
    // Chatbot
    aiAssistant: "AI Assistant",
    typeMessage: "Type your farming question...",
    email: "Email",
    phone: "Phone",
    password: "Password",
    address: "Address",
    farmSize: "Farm Size",
    cropType: "Crop Type",
    register: "Register",
    submit: "Submit",
    
    // Aadhaar System
    aadhaarNumber: "Aadhaar Number",
    scanQR: "Scan QR Code",
    fetchFromAadhaar: "Fetch from Aadhaar",
    aadhaarVerification: "Aadhaar Verification",
    autoFillFromAadhaar: "Auto-fill from Aadhaar",
    
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
    
    // Additional
    subtitle: "AI-Powered Precision Farming for India",
    acres: "Acres",
    hectares: "Hectares",
    corn: "Corn",
    vegetables: "Vegetables",
    both: "Both",
    createAccount: "Create Account",
    loginWithAadhaar: "Login with Aadhaar",
    enterOtp: "Enter OTP",
    verifyOtp: "Verify OTP",
    farmDetails: "Farm Details",
    cropTypes: "What do you farm?",
    signIn: "Sign In"
  },
  
  hi: {
    // Navigation
    dashboard: "डैशबोर्ड",
    cropDetection: "फसल का पता लगाना",
    soilDetection: "मिट्टी की जांच",
    pestDetection: "कीट का पता लगाना",
    farmerRegistration: "किसान पंजीकरण",
    adminDashboard: "एडमिन डैशबोर्ड",
    login: "लॉग इन",
    logout: "लॉग आउट",
    
    // Dashboard
    welcomeMessage: "एग्रोवॉच में आपका स्वागत है",
    cropHealthOverview: "फसल स्वास्थ्य अवलोकन",
    environmentalData: "पर्यावरणीय डेटा",
    recentAlerts: "हाल की अलर्ट",
    
    // Crop Detection
    cropHealthAnalysis: "फसल स्वास्थ्य विश्लेषण",
    uploadImage: "छवि अपलोड करें",
    analyzeHealth: "स्वास्थ्य का विश्लेषण करें",
    healthStatus: "स्वास्थ्य स्थिति",
    recommendations: "सिफारिशें",
    
    // Pest Detection
    pestDetectionAnalysis: "कीट पहचान विश्लेषण",
    pestIdentification: "कीट की पहचान",
    pestStatus: "कीट स्थिति",
    treatmentPlan: "उपचार योजना",
    preventionTips: "रोकथाम के उपाय",
    
    // Soil Detection
    soilHealthAnalysis: "मिट्टी स्वास्थ्य विश्लेषण",
    soilMoisture: "मिट्टी की नमी",
    phLevel: "पीएच स्तर",
    nutrients: "पोषक तत्व",
    
    // Environmental Panel
    temperature: "तापमान",
    humidity: "आर्द्रता",
    soilMoistureLevel: "मिट्टी की नमी का स्तर",
    lightIntensity: "प्रकाश की तीव्रता",
    
    // Alerts
    alerts: "अलर्ट",
    pestAlert: "कीट अलर्ट",
    weatherAlert: "मौसम अलर्ट",
    
    // Forms
    name: "नाम",
    
    // Chatbot
    aiAssistant: "AI सहायक",
    typeMessage: "अपना कृषि प्रश्न टाइप करें...",
    email: "ईमेल",
    phone: "फोन",
    password: "पासवर्ड",
    address: "पता",
    farmSize: "खेत का आकार",
    cropType: "फसल का प्रकार",
    register: "पंजीकरण करें",
    submit: "जमा करें",
    
    // Aadhaar System
    aadhaarNumber: "आधार संख्या",
    scanQR: "क्यूआर कोड स्कैन करें",
    fetchFromAadhaar: "आधार से डेटा लें",
    aadhaarVerification: "आधार सत्यापन",
    autoFillFromAadhaar: "आधार से ऑटो-फिल करें",
    
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
    
    // Additional
    subtitle: "भारत के लिए AI-संचालित सटीक खेती",
    acres: "एकड़",
    hectares: "हेक्टेयर",
    corn: "मक्का",
    vegetables: "सब्जियां",
    both: "दोनों",
    createAccount: "खाता बनाएं",
    loginWithAadhaar: "आधार से लॉगिन करें",
    enterOtp: "ओटीपी दर्ज करें",
    verifyOtp: "ओटीपी सत्यापित करें",
    farmDetails: "खेत का विवरण",
    cropTypes: "आप क्या उगाते हैं?",
    signIn: "साइन इन"
  },
  
  bn: {
    // Navigation
    dashboard: "ড্যাশবোর্ড",
    cropDetection: "ফসল সনাক্তকরণ",
    soilDetection: "মাটি সনাক্তকরণ",
    pestDetection: "কীটপতঙ্গ সনাক্তকরণ",
    farmerRegistration: "কৃষক নিবন্ধন",
    adminDashboard: "অ্যাডমিন ড্যাশবোর্ড",
    login: "লগইন",
    logout: "লগআউট",
    
    // Dashboard
    welcomeMessage: "এগ্রোওয়াচে স্বাগতম",
    cropHealthOverview: "ফসলের স্বাস্থ্য পর্যালোচনা",
    environmentalData: "পরিবেশগত তথ্য",
    recentAlerts: "সাম্প্রতিক সতর্কতা",
    
    // Crop Detection
    cropHealthAnalysis: "ফসলের স্বাস্থ্য বিশ্লেষণ",
    uploadImage: "ছবি আপলোড করুন",
    analyzeHealth: "স্বাস্থ্য বিশ্লেষণ করুন",
    healthStatus: "স্বাস্থ্যের অবস্থা",
    recommendations: "সুপারিশ",
    
    // Pest Detection
    pestDetectionAnalysis: "কীটপতঙ্গ সনাক্তকরণ বিশ্লেষণ",
    pestIdentification: "কীটপতঙ্গ চিহ্নিতকরণ",
    pestStatus: "কীটপতঙ্গের অবস্থা",
    treatmentPlan: "চিকিৎসা পরিকল্পনা",
    preventionTips: "প্রতিরোধের উপায়",
    
    // Soil Detection
    soilHealthAnalysis: "মাটির স্বাস্থ্য বিশ্লেষণ",
    soilMoisture: "মাটির আর্দ্রতা",
    phLevel: "পিএইচ স্তর",
    nutrients: "পুষ্টি উপাদান",
    
    // Environmental Panel
    temperature: "তাপমাত্রা",
    humidity: "আর্দ্রতা",
    soilMoistureLevel: "মাটির আর্দ্রতার স্তর",
    lightIntensity: "আলোর তীব্রতা",
    
    // Alerts
    alerts: "সতর্কতা",
    pestAlert: "কীটপতঙ্গ সতর্কতা",
    weatherAlert: "আবহাওয়া সতর্কতা",
    
    // Forms
    name: "নাম",
    
    // Chatbot
    aiAssistant: "AI সহায়ক",
    typeMessage: "আপনার কৃষি প্রশ্ন টাইপ করুন...",
    email: "ইমেইল",
    phone: "ফোন",
    password: "পাসওয়ার্ড",
    address: "ঠিকানা",
    farmSize: "খামারের আকার",
    cropType: "ফসলের ধরন",
    register: "নিবন্ধন করুন",
    submit: "জমা দিন",
    
    // Aadhaar System
    aadhaarNumber: "আধার নম্বর",
    scanQR: "কিউআর কোড স্ক্যান করুন",
    fetchFromAadhaar: "আধার থেকে তথ্য নিন",
    aadhaarVerification: "আধার যাচাইকরণ",
    autoFillFromAadhaar: "আধার থেকে অটো-ফিল করুন",
    
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
    
    // Additional
    subtitle: "ভারতের জন্য AI-চালিত নির্ভুল কৃষি",
    acres: "একর",
    hectares: "হেক্টর",
    corn: "ভুট্টা",
    vegetables: "সবজি",
    both: "উভয়",
    createAccount: "অ্যাকাউন্ট তৈরি করুন",
    loginWithAadhaar: "আধার দিয়ে লগইন করুন",
    enterOtp: "ওটিপি লিখুন",
    verifyOtp: "ওটিপি যাচাই করুন",
    farmDetails: "খামারের বিবরণ",
    cropTypes: "আপনি কী চাষ করেন?",
    signIn: "সাইন ইন"
  },
  
  gu: {
    // Navigation
    dashboard: "ડેશબોર્ડ",
    cropDetection: "પાક શોધ",
    soilDetection: "માટી શોધ",
    pestDetection: "જીવાત શોધ",
    farmerRegistration: "ખેડૂત નોંધણી",
    adminDashboard: "એડમિન ડેશબોર્ડ",
    login: "લોગિન",
    logout: "લોગઆઉટ",
    
    // Dashboard
    welcomeMessage: "એગ્રોવોચમાં આપનું સ્વાગત છે",
    cropHealthOverview: "પાક આરોગ્ય વિહંગાવલોકન",
    environmentalData: "પર્યાવરણીય ડેટા",
    recentAlerts: "તાજેતરના અલર્ટ્સ",
    
    // Crop Detection
    cropHealthAnalysis: "પાક આરોગ્ય વિશ્લેષણ",
    uploadImage: "છબી અપલોડ કરો",
    analyzeHealth: "આરોગ્યનું વિશ્લેષણ કરો",
    healthStatus: "આરોગ્ય સ્થિતિ",
    recommendations: "ભલામણો",
    
    // Pest Detection
    pestDetectionAnalysis: "જીવાત શોધ વિશ્લેષણ",
    pestIdentification: "જીવાત ઓળખ",
    pestStatus: "જીવાત સ્થિતિ",
    treatmentPlan: "સારવાર યોજના",
    preventionTips: "બચાવના ઉપાયો",
    
    // Soil Detection
    soilHealthAnalysis: "માટી આરોગ્ય વિશ્લેષણ",
    soilMoisture: "માટીની ભેજ",
    phLevel: "પીએચ સ્તર",
    nutrients: "પોષક તત્વો",
    
    // Environmental Panel
    temperature: "તાપમાન",
    humidity: "ભેજ",
    soilMoistureLevel: "માટીની ભેજનું સ્તર",
    lightIntensity: "પ્રકાશની તીવ્રતા",
    
    // Alerts
    alerts: "અલર્ટ્સ",
    pestAlert: "જીવાત અલર્ટ",
    weatherAlert: "હવામાન અલર્ટ",
    
    // Forms
    name: "નામ",
    
    // Chatbot
    aiAssistant: "AI સહાયક",
    typeMessage: "તમારો કૃષિ પ્રશ્ન ટાઇપ કરો...",
    email: "ઈમેઈલ",
    phone: "ફોન",
    password: "પાસવર્ડ",
    address: "સરનામું",
    farmSize: "ખેતરનું કદ",
    cropType: "પાકનો પ્રકાર",
    register: "નોંધણી કરો",
    submit: "સબમિટ કરો",
    
    // Aadhaar System
    aadhaarNumber: "આધાર નંબર",
    scanQR: "ક્યુઆર કોડ સ્કેન કરો",
    fetchFromAadhaar: "આધારથી ડેટા લો",
    aadhaarVerification: "આધાર ચકાસણી",
    autoFillFromAadhaar: "આધારથી ઓટો-ફિલ કરો",
    
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
    
    // Additional
    subtitle: "ભારત માટે AI-સંચાલિત ચોક્કસ ખેતી",
    acres: "એકર",
    hectares: "હેક્ટર",
    corn: "મકાઈ",
    vegetables: "શાકભાજી",
    both: "બંને",
    createAccount: "ખાતું બનાવો",
    loginWithAadhaar: "આધાર સાથે લોગિન કરો",
    enterOtp: "ઓટીપી દાખલ કરો",
    verifyOtp: "ઓટીપી ચકાસો",
    farmDetails: "ખેતરની વિગતો",
    cropTypes: "તમે શું ઉગાડો છો?",
    signIn: "સાઇન ઇન"
  },
  
  ta: {
    // Navigation
    dashboard: "டாஷ்போர்டு",
    cropDetection: "பயிர் கண்டறிதல்",
    soilDetection: "மண் கண்டறிதல்",
    pestDetection: "பூச்சி கண்டறிதல்",
    farmerRegistration: "விவசாயி பதிவு",
    adminDashboard: "நிர்வாக டாஷ்போர்டு",
    login: "உள்நுழைவு",
    logout: "வெளியேறு",
    
    // Dashboard
    welcomeMessage: "அக்ரோவாட்சிற்கு வரவேற்கிறோம்",
    cropHealthOverview: "பயிர் ஆரோக்கிய மேலோட்டம்",
    environmentalData: "சுற்றுச்சூழல் தரவு",
    recentAlerts: "சமீபத்திய எச்சரிக்கைகள்",
    
    // Crop Detection
    cropHealthAnalysis: "பயிர் ஆரோக்கிய பகுப்பாய்வு",
    uploadImage: "படத்தை பதிவேற்றவும்",
    analyzeHealth: "ஆரோக்கியத்தை பகுப்பாய்வு செய்யவும்",
    healthStatus: "ஆரோக்கிய நிலை",
    recommendations: "பரிந்துரைகள்",
    
    // Pest Detection
    pestDetectionAnalysis: "பூச்சி கண்டறிதல் பகுப்பாய்வு",
    pestIdentification: "பூச்சி அடையாளம்",
    pestStatus: "பூச்சி நிலை",
    treatmentPlan: "சிகிச்சை திட்டம்",
    preventionTips: "தடுப்பு வழிகள்",
    
    // Soil Detection
    soilHealthAnalysis: "மண் ஆரோக்கிய பகுப்பாய்வு",
    soilMoisture: "மண் ஈரப்பதம்",
    phLevel: "பிஎச் அளவு",
    nutrients: "ஊட்டச்சத்துக்கள்",
    
    // Environmental Panel
    temperature: "வெப்பநிலை",
    humidity: "ஈரப்பதம்",
    soilMoistureLevel: "மண் ஈரப்பத அளவு",
    lightIntensity: "ஒளி தீவிரம்",
    
    // Alerts
    alerts: "எச்சரிக்கைகள்",
    pestAlert: "பூச்சி எச்சரிக்கை",
    weatherAlert: "வானிலை எச்சரிக்கை",
    
    // Forms
    name: "பெயர்",
    
    // Chatbot
    aiAssistant: "AI உதவியாளர்",
    typeMessage: "உங்கள் விவசாய கேள்வியை தட்டச்சு செய்யவும்...",
    email: "மின்னஞ்சல்",
    phone: "தொலைபேசி",
    password: "கடவுச்சொல்",
    address: "முகவரி",
    farmSize: "பண்ணை அளவு",
    cropType: "பயிர் வகை",
    register: "பதிவு செய்யவும்",
    submit: "சமர்ப்பிக்கவும்",
    
    // Aadhaar System
    aadhaarNumber: "ஆதார் எண்",
    scanQR: "க்யூஆர் கோட் ஸ்கேன் செய்யவும்",
    fetchFromAadhaar: "ஆதாரிலிருந்து தரவு எடுக்கவும்",
    aadhaarVerification: "ஆதார் சரிபார்ப்பு",
    autoFillFromAadhaar: "ஆதாரிலிருந்து தானாக நிரப்பவும்",
    
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
    
    // Additional
    subtitle: "இந்தியாவிற்கான AI-இயங்கும் துல்லியமான விவசாயம்",
    acres: "ஏக்கர்",
    hectares: "ஹெக்டேர்",
    corn: "சோளம்",
    vegetables: "காய்கறிகள்",
    both: "இரண்டும்",
    createAccount: "கணக்கை உருவாக்கவும்",
    loginWithAadhaar: "ஆதார் மூலம் உள்நுழையவும்",
    enterOtp: "OTP ஐ உள்ளிடவும்",
    verifyOtp: "OTP ஐ சரிபார்க்கவும்",
    farmDetails: "பண்ணை விவரங்கள்",
    cropTypes: "நீங்கள் என்ன வளர்க்கிறீர்கள்?",
    signIn: "உள்நுழையவும்"
  },
  
  te: {
    // Navigation
    dashboard: "డాష్‌బోర్డ్",
    cropDetection: "పంట గుర్తింపు",
    soilDetection: "మట్టి గుర్తింపు",
    pestDetection: "కీటక గుర్తింపు",
    farmerRegistration: "రైతు నమోదు",
    adminDashboard: "అడ్మిన్ డాష్‌బోర్డ్",
    login: "లాగిన్",
    logout: "లాగౌట్",
    
    // Dashboard
    welcomeMessage: "అగ్రోవాచ్‌కు స్వాగతం",
    cropHealthOverview: "పంట ఆరోగ్య సమీక్ష",
    environmentalData: "పర్యావరణ డేటా",
    recentAlerts: "ఇటీవలి హెచ్చరికలు",
    
    // Crop Detection
    cropHealthAnalysis: "పంట ఆరోగ్య విశ్లేషణ",
    uploadImage: "చిత్రాన్ని అప్‌లోడ్ చేయండి",
    analyzeHealth: "ఆరోగ్యాన్ని విశ్లేషించండి",
    healthStatus: "ఆరోగ్య స్థితి",
    recommendations: "సిఫార్సులు",
    
    // Pest Detection
    pestDetectionAnalysis: "కీటక గుర్తింపు విశ్లేషణ",
    pestIdentification: "కీటక గుర్తింపు",
    pestStatus: "కీటక స్థితి",
    treatmentPlan: "చికిత్స ప్రణాళిక",
    preventionTips: "నివారణ చిట్కాలు",
    
    // Soil Detection
    soilHealthAnalysis: "మట్టి ఆరోగ్య విశ్లేషణ",
    soilMoisture: "మట్టి తేమ",
    phLevel: "పిహెచ్ స్థాయి",
    nutrients: "పోషకాలు",
    
    // Environmental Panel
    temperature: "ఉష్ణోగ్రత",
    humidity: "తేమ",
    soilMoistureLevel: "మట్టి తేమ స్థాయి",
    lightIntensity: "కాంతి తీవ్రత",
    
    // Alerts
    alerts: "హెచ్చరికలు",
    pestAlert: "కీటక హెచ్చరిక",
    weatherAlert: "వాతావరణ హెచ్చరిక",
    
    // Forms
    name: "పేరు",
    
    // Chatbot
    aiAssistant: "AI సహాయకుడు",
    typeMessage: "మీ వ్యవసాయ ప్రశ్నను టైప్ చేయండి...",
    email: "ఇమెయిల్",
    phone: "ఫోన్",
    password: "పాస్‌వర్డ్",
    address: "చిరునామా",
    farmSize: "వ్యవసాయ భూమి పరిమాణం",
    cropType: "పంట రకం",
    register: "నమోదు చేయండి",
    submit: "సమర్పించండి",
    
    // Aadhaar System
    aadhaarNumber: "ఆధార్ నంబర్",
    scanQR: "క్యూఆర్ కోడ్ స్కాన్ చేయండి",
    fetchFromAadhaar: "ఆధార్ నుండి డేటా తీసుకోండి",
    aadhaarVerification: "ఆధార్ ధృవీకరణ",
    autoFillFromAadhaar: "ఆధార్ నుండి ఆటో-ఫిల్ చేయండి",
    
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
    
    // Additional
    subtitle: "భారతదేశం కోసం AI-శక్తితో కూడిన ఖచ్చితమైన వ్యవసాయం",
    acres: "ఎకరాలు",
    hectares: "హెక్టార్లు",
    corn: "మొక్కజొన్న",
    vegetables: "కూరగాయలు",
    both: "రెండూ",
    createAccount: "ఖాతా సృష్టించండి",
    loginWithAadhaar: "ఆధార్‌తో లాగిన్ చేయండి",
    enterOtp: "OTP నమోదు చేయండి",
    verifyOtp: "OTP ధృవీకరించండి",
    farmDetails: "వ్యవసాయ వివరాలు",
    cropTypes: "మీరు ఏమి పండిస్తారు?",
    signIn: "సైన్ ఇన్"
  },
  
  as: {
    // Navigation
    dashboard: "ডেশ্ববর্ড",
    cropDetection: "শস্য চিনাক্তকৰণ",
    soilDetection: "মাটি চিনাক্তকৰণ",
    pestDetection: "কীট-পতংগ চিনাক্তকৰণ",
    farmerRegistration: "কৃষক পঞ্জীয়ন",
    adminDashboard: "প্ৰশাসক ডেশ্ববর্ড",
    login: "লগইন",
    logout: "লগআউট",
    
    // Dashboard
    welcomeMessage: "এগ্ৰোৱাচলৈ স্বাগতম",
    cropHealthOverview: "শস্যৰ স্বাস্থ্য অৱলোকন",
    environmentalData: "পৰিৱেশগত তথ্য",
    recentAlerts: "শেহতীয়া সতৰ্কবাণী",
    
    // Crop Detection
    cropHealthAnalysis: "শস্যৰ স্বাস্থ্য বিশ্লেষণ",
    uploadImage: "ছবি আপলোড কৰক",
    analyzeHealth: "স্বাস্থ্য বিশ্লেষণ কৰক",
    healthStatus: "স্বাস্থ্যৰ অৱস্থা",
    recommendations: "পৰামৰ্শ",
    
    // Pest Detection
    pestDetectionAnalysis: "কীট-পতংগ চিনাক্তকৰণ বিশ্লেষণ",
    pestIdentification: "কীট-পতংগ চিনাক্তকৰণ",
    pestStatus: "কীট-পতংগৰ অৱস্থা",
    treatmentPlan: "চিকিৎসা পৰিকল্পনা",
    preventionTips: "প্ৰতিৰোধৰ উপায়",
    
    // Soil Detection
    soilHealthAnalysis: "মাটিৰ স্বাস্থ্য বিশ্লেষণ",
    soilMoisture: "মাটিৰ আৰ্দ্ৰতা",
    phLevel: "পিএইচ স্তৰ",
    nutrients: "পুষ্টিকৰ উপাদান",
    
    // Environmental Panel
    temperature: "উষ্ণতা",
    humidity: "আৰ্দ্ৰতা",
    soilMoistureLevel: "মাটিৰ আৰ্দ্ৰতাৰ স্তৰ",
    lightIntensity: "পোহৰৰ তীব্ৰতা",
    
    // Alerts
    alerts: "সতৰ্কবাণী",
    pestAlert: "কীট-পতংগৰ সতৰ্কবাণী",
    weatherAlert: "বতৰৰ সতৰ্কবাণী",
    
    // Forms
    name: "নাম",
    
    // Chatbot
    aiAssistant: "AI সহায়ক",
    typeMessage: "আপোনাৰ কৃষি প্ৰশ্ন টাইপ কৰক...",
    email: "ইমেইল",
    phone: "ফোন",
    password: "পাছৱৰ্ড",
    address: "ঠিকনা",
    farmSize: "খেতিৰ আকাৰ",
    cropType: "শস্যৰ প্ৰকাৰ",
    register: "পঞ্জীয়ন কৰক",
    submit: "দাখিল কৰক",
    
    // Aadhaar System
    aadhaarNumber: "আধাৰ নম্বৰ",
    scanQR: "কিউআৰ কোড স্কেন কৰক",
    fetchFromAadhaar: "আধাৰৰ পৰা তথ্য লওক",
    aadhaarVerification: "আধাৰ সত্যাপন",
    autoFillFromAadhaar: "আধাৰৰ পৰা অটো-ফিল কৰক",
    
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
    
    // Additional
    subtitle: "ভাৰতৰ বাবে AI-চালিত নিখুঁত কৃষি",
    acres: "একৰ",
    hectares: "হেক্টৰ",
    corn: "ভুট্টা",
    vegetables: "পাচলি",
    both: "দুয়োটা",
    createAccount: "একাউণ্ট সৃষ্টি কৰক",
    loginWithAadhaar: "আধাৰৰ সৈতে লগইন কৰক",
    enterOtp: "ওটিপি দিয়ক",
    verifyOtp: "ওটিপি সত্যাপন কৰক",
    farmDetails: "খেতিৰ বিৱৰণ",
    cropTypes: "আপুনি কি খেতি কৰে?",
    signIn: "ছাইন ইন"
  }
};

export const languageOptions = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
];

export type Language = keyof typeof translations;
export type TranslationKey = string;

export const useTranslation = (language: string): Translations => {
  return translations[language] || translations.en;
};

export const t = (key: TranslationKey, language: string = 'en'): string => {
  const translation: Record<string, string> = (translations as any)[language] || translations.en;
  const fallback: Record<string, string> = translations.en as any;
  return translation[key] || fallback[key] || key;
};