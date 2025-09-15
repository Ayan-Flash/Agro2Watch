export type Language = 'en' | 'ml' | 'hi';

export type TranslationKey =
  | 'fieldOverview'
  | 'vegetationIndex'
  | 'hectares'
  | 'healthy'
  | 'stressed'
  | 'critical'
  | 'alerts'
  | 'viewDetails'
  | 'takeAction'
  | 'weeklyTrend'
  | 'soilMoisture'
  | 'prediction'
  | 'healthyZones'
  | 'dashboard'
  | 'cropDetection'
  | 'cropHealth'
  | 'soilDetection'
  | 'farmerRegistration'
  | 'adminDashboard'
  | 'language'
  | 'trends'
  | 'percentage'
  | 'airTemperature'
  | 'humidity'
  | 'leafWetness'
  | 'celsius'
  | 'environmental'
  | 'lastUpdated'
  | 'welcomeMessage'
  | 'subtitle';

export const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    fieldOverview: 'Field Overview',
    vegetationIndex: 'Vegetation Index',
    hectares: 'ha',
    healthy: 'Healthy',
    stressed: 'Stressed',
    critical: 'Critical',
    alerts: 'Alerts',
    viewDetails: 'View Details',
    takeAction: 'Take Action',
    weeklyTrend: 'Weekly Trend',
    soilMoisture: 'Soil Moisture',
    prediction: 'Prediction',
    healthyZones: 'Healthy Zones',
    dashboard: 'Dashboard',
    cropDetection: 'Crop Detection',
    cropHealth: 'Crop Health',
    soilDetection: 'Soil Detection',
    farmerRegistration: 'Farmer Registration',
    adminDashboard: 'Admin Dashboard',
    language: 'Language',
    trends: 'Trends',
    percentage: 'Percentage',
    airTemperature: 'Air Temperature',
    humidity: 'Humidity',
    leafWetness: 'Leaf Wetness',
    celsius: '°C',
    environmental: 'Environmental',
    lastUpdated: 'Last Updated',
    welcomeMessage: 'Welcome to AgroWatch',
    subtitle: 'Precision agriculture insights',
  },
  ml: {
    fieldOverview: 'ഫീൽഡ് അവലോകനം',
    vegetationIndex: 'സസ്യാവരണം സൂചിക',
    hectares: 'ഹെ',
    healthy: 'ആരോഗ്യമുള്ള',
    stressed: 'സമ്മർദ്ദം',
    critical: 'ഗുരുതരം',
    alerts: 'അലേർട്ട്',
    viewDetails: 'വിശദാംശങ്ങൾ കാണുക',
    takeAction: 'നടപടി എടുക്കുക',
    weeklyTrend: 'ആഴ്ച്ച ട്രെൻഡ്',
    soilMoisture: 'മണ്ണ് ഈർപ്പം',
    prediction: 'പ്രവചനം',
    healthyZones: 'ആരോഗ്യ മേഖലകൾ',
    dashboard: 'ഡാഷ്ബോർഡ്',
    cropDetection: 'വിള കണ്ടെത്തൽ',
    cropHealth: 'വിളാരോഗ്യം',
    soilDetection: 'മണ്ണ് കണ്ടെത്തൽ',
    farmerRegistration: 'കർഷക രജിസ്ട്രേഷൻ',
    adminDashboard: 'അഡ്മിൻ ഡാഷ്ബോർഡ്',
    language: 'ഭാഷ',
    trends: 'ട്രെൻഡ്സ്',
    percentage: 'ശതമാനം',
    airTemperature: 'വായു താപനില',
    humidity: 'ഈർപ്പം',
    leafWetness: 'ഇലയുടെ ഈർപ്പം',
    celsius: '°C',
    environmental: 'പരിസ്ഥിതി',
    lastUpdated: 'അവസാനം പുതുക്കിയത്',
    welcomeMessage: 'ആഗ്രോവാച്ചിലേക്ക് സ്വാഗതം',
    subtitle: 'പ്രിസിഷൻ കാർഷിക洞察ങ്ങൾ',
  },
  hi: {
    fieldOverview: 'फील्ड अवलोकन',
    vegetationIndex: 'वनस्पति सूचकांक',
    hectares: 'हे',
    healthy: 'स्वस्थ',
    stressed: 'तनावग्रस्त',
    critical: 'गंभीर',
    alerts: 'अलर्ट',
    viewDetails: 'विवरण देखें',
    takeAction: 'कार्रवाई करें',
    weeklyTrend: 'साप्ताहिक रुझान',
    soilMoisture: 'मिट्टी की नमी',
    prediction: 'पूर्वानुमान',
    healthyZones: 'स्वस्थ क्षेत्र',
    dashboard: 'डैशबोर्ड',
    cropDetection: 'फसल पहचान',
    cropHealth: 'फसल स्वास्थ्य',
    soilDetection: 'मृदा पहचान',
    farmerRegistration: 'किसान पंजीकरण',
    adminDashboard: 'एडमिन डैशबोर्ड',
    language: 'भाषा',
    trends: 'रुझान',
    percentage: 'प्रतिशत',
    airTemperature: 'वायु तापमान',
    humidity: 'नमी',
    leafWetness: 'पत्ती की नमी',
    celsius: '°C',
    environmental: 'पर्यावरणीय',
    lastUpdated: 'अंतिम अद्यतन',
    welcomeMessage: 'एग्रोवॉच में आपका स्वागत है',
    subtitle: 'प्रिसीजन कृषि अंतर्दृष्टि',
  },
};


