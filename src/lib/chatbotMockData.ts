export interface ChatbotResponse {
  text: string;
  type?: string;
  timestamp?: string;
  suggestions?: string[];
  quick_actions?: Array<{
    title: string;
    action: string;
    icon: string;
  }>;
  actions?: string[];
}

export interface ChatbotMockData {
  [key: string]: {
    [language: string]: ChatbotResponse;
  };
}

// Comprehensive mock data for chatbot responses
export const chatbotMockData: ChatbotMockData = {
  // Weather queries
  weather_query: {
    en: {
      text: "Here's the current weather information for farming:\n\n🌤️ **Current Conditions:**\n- Temperature: 28°C (82°F)\n- Humidity: 65%\n- Wind Speed: 12 km/h\n- Rainfall: 0mm (last 24h)\n\n📅 **7-Day Forecast:**\n- Today: Partly cloudy, 28°C\n- Tomorrow: Sunny, 30°C\n- Day 3: Light rain, 26°C\n- Day 4: Heavy rain, 24°C\n- Day 5: Cloudy, 27°C\n- Day 6: Sunny, 29°C\n- Day 7: Partly cloudy, 28°C\n\n🌱 **Farming Recommendations:**\n- Good time for planting rice and vegetables\n- Avoid heavy field work during rainy days (Day 3-4)\n- Irrigation not needed for next 2 days\n- Monitor soil moisture levels",
      type: "weather",
      suggestions: ["Crop planting schedule", "Irrigation advice", "Weather alerts"],
      quick_actions: [
        { title: "Detailed Forecast", action: "detailed_weather", icon: "cloud" },
        { title: "Crop Planning", action: "crop_planning", icon: "calendar" },
        { title: "Soil Moisture", action: "soil_moisture", icon: "droplets" }
      ]
    },
    hi: {
      text: "कृषि के लिए मौसम की जानकारी:\n\n🌤️ **वर्तमान स्थिति:**\n- तापमान: 28°C\n- आर्द्रता: 65%\n- हवा की गति: 12 km/h\n- वर्षा: 0mm (पिछले 24 घंटे)\n\n📅 **7-दिन का पूर्वानुमान:**\n- आज: आंशिक बादल, 28°C\n- कल: धूप, 30°C\n- दिन 3: हल्की बारिश, 26°C\n- दिन 4: भारी बारिश, 24°C\n- दिन 5: बादल, 27°C\n- दिन 6: धूप, 29°C\n- दिन 7: आंशिक बादल, 28°C\n\n🌱 **कृषि सुझाव:**\n- चावल और सब्जियों की बुवाई के लिए अच्छा समय\n- बारिश के दिनों में भारी खेत का काम न करें\n- अगले 2 दिनों तक सिंचाई की आवश्यकता नहीं",
      type: "weather",
      suggestions: ["फसल बुवाई कार्यक्रम", "सिंचाई सलाह", "मौसम चेतावनी"]
    }
  },

  // Crop problems
  crop_problem: {
    en: {
      text: "I'm here to help with your crop problems! Please describe what you're seeing:\n\n🔍 **Common Issues I can help with:**\n- Yellowing leaves\n- Brown spots on crops\n- Stunted growth\n- Pest damage\n- Disease symptoms\n- Nutrient deficiencies\n- Water-related issues\n\n📸 **For better diagnosis:**\n- Upload a clear photo of the affected area\n- Describe the symptoms in detail\n- Mention when you first noticed the problem\n- Tell me about your recent farming practices",
      type: "crop_problem",
      suggestions: ["Upload crop photo", "Describe symptoms", "Get treatment plan"],
      quick_actions: [
        { title: "Disease Diagnosis", action: "disease_diagnosis", icon: "bug" },
        { title: "Pest Control", action: "pest_control", icon: "shield" },
        { title: "Nutrient Check", action: "nutrient_check", icon: "test-tube" }
      ]
    },
    hi: {
      text: "मैं आपकी फसल की समस्याओं में मदद करने के लिए यहाँ हूँ! बताएं कि आप क्या देख रहे हैं:\n\n🔍 **मैं इन समस्याओं में मदद कर सकता हूँ:**\n- पीले पत्ते\n- फसलों पर भूरे धब्बे\n- कम वृद्धि\n- कीट नुकसान\n- रोग के लक्षण\n- पोषक तत्वों की कमी\n- पानी से संबंधित समस्याएं",
      type: "crop_problem",
      suggestions: ["फसल की फोटो अपलोड करें", "लक्षण बताएं", "उपचार योजना प्राप्त करें"]
    }
  },

  // Government schemes
  schemes_info: {
    en: {
      text: "Here are the latest government schemes for farmers:\n\n🏛️ **PM Kisan Samman Nidhi**\n- ₹6,000 per year in 3 installments\n- Direct benefit transfer to bank accounts\n- For all farmer families\n- Apply online at pmkisan.gov.in\n\n🌾 **Pradhan Mantri Fasal Bima Yojana (PMFBY)**\n- Crop insurance at affordable rates\n- Covers yield loss and weather damage\n- Premium: 2% for Kharif, 1.5% for Rabi\n- Apply through Common Service Centers\n\n💧 **Pradhan Mantri Krishi Sinchai Yojana (PMKSY)**\n- Water conservation and irrigation\n- Micro-irrigation systems\n- 50% subsidy for small farmers\n- Apply through state agriculture department\n\n📱 **Kisan Credit Card (KCC)**\n- Credit limit up to ₹3 lakh\n- Interest rate: 4% per annum\n- Apply at any bank branch\n- No collateral required for small farmers",
      type: "schemes",
      suggestions: ["Application process", "Eligibility criteria", "Document requirements"],
      quick_actions: [
        { title: "Apply Online", action: "apply_schemes", icon: "computer" },
        { title: "Check Status", action: "check_status", icon: "search" },
        { title: "Find Centers", action: "find_centers", icon: "map-pin" }
      ]
    },
    hi: {
      text: "किसानों के लिए नवीनतम सरकारी योजनाएं:\n\n🏛️ **पीएम किसान सम्मान निधि**\n- ₹6,000 प्रति वर्ष 3 किस्तों में\n- बैंक खातों में सीधा लाभ हस्तांतरण\n- सभी किसान परिवारों के लिए\n\n🌾 **प्रधानमंत्री फसल बीमा योजना**\n- किफायती दरों पर फसल बीमा\n- उपज हानि और मौसमी नुकसान कवर\n- प्रीमियम: खरीफ के लिए 2%, रबी के लिए 1.5%",
      type: "schemes",
      suggestions: ["आवेदन प्रक्रिया", "पात्रता मानदंड", "दस्तावेज आवश्यकताएं"]
    }
  },

  // Market prices
  market_prices: {
    en: {
      text: "Current market prices for major crops:\n\n🌾 **Cereals (per quintal):**\n- Rice (Basmati): ₹3,200-3,800\n- Wheat: ₹2,100-2,300\n- Maize: ₹1,800-2,000\n- Bajra: ₹2,200-2,400\n\n🥜 **Pulses (per quintal):**\n- Chana: ₹5,200-5,800\n- Moong: ₹7,500-8,200\n- Urad: ₹8,000-8,800\n- Masoor: ₹5,800-6,400\n\n🌶️ **Vegetables (per kg):**\n- Onion: ₹25-35\n- Potato: ₹15-25\n- Tomato: ₹30-45\n- Green Chilli: ₹80-120\n\n📈 **Market Trends:**\n- Rice prices stable\n- Wheat prices rising 5%\n- Onion prices volatile\n- Pulses demand increasing\n\n💡 **Trading Tips:**\n- Best time to sell rice: Nov-Dec\n- Wheat storage recommended\n- Monitor onion price trends",
      type: "market_prices",
      suggestions: ["Price alerts", "Trading strategies", "Storage advice"],
      quick_actions: [
        { title: "Set Price Alert", action: "price_alert", icon: "bell" },
        { title: "Market Analysis", action: "market_analysis", icon: "trending-up" },
        { title: "Trading Tips", action: "trading_tips", icon: "lightbulb" }
      ]
    },
    hi: {
      text: "प्रमुख फसलों के वर्तमान बाजार मूल्य:\n\n🌾 **अनाज (प्रति क्विंटल):**\n- चावल (बासमती): ₹3,200-3,800\n- गेहूं: ₹2,100-2,300\n- मक्का: ₹1,800-2,000\n- बाजरा: ₹2,200-2,400\n\n🥜 **दालें (प्रति क्विंटल):**\n- चना: ₹5,200-5,800\n- मूंग: ₹7,500-8,200\n- उड़द: ₹8,000-8,800\n- मसूर: ₹5,800-6,400",
      type: "market_prices",
      suggestions: ["मूल्य अलर्ट", "ट्रेडिंग रणनीतियां", "भंडारण सलाह"]
    }
  },

  // Soil advice
  soil_advice: {
    en: {
      text: "Soil health is crucial for successful farming! Here's comprehensive soil advice:\n\n🌱 **Soil Testing:**\n- Test soil every 6 months\n- Check pH levels (6.0-7.5 ideal)\n- Analyze nutrient content (N, P, K)\n- Test organic matter content\n\n💧 **Water Management:**\n- Maintain proper drainage\n- Avoid over-irrigation\n- Use mulching to retain moisture\n- Implement drip irrigation for efficiency\n\n🌿 **Nutrient Management:**\n- Use organic compost regularly\n- Apply fertilizers based on soil test\n- Practice crop rotation\n- Use green manure crops\n\n🦠 **Soil Health Improvement:**\n- Add vermicompost\n- Use bio-fertilizers\n- Practice no-till farming\n- Maintain soil cover",
      type: "soil_advice",
      suggestions: ["Soil testing guide", "Fertilizer calculator", "Crop rotation plan"],
      quick_actions: [
        { title: "Soil Test", action: "soil_test", icon: "test-tube" },
        { title: "Fertilizer Guide", action: "fertilizer_guide", icon: "leaf" },
        { title: "Crop Rotation", action: "crop_rotation", icon: "refresh-cw" }
      ]
    },
    hi: {
      text: "सफल खेती के लिए मिट्टी का स्वास्थ्य महत्वपूर्ण है! यहाँ व्यापक मिट्टी सलाह है:\n\n🌱 **मिट्टी परीक्षण:**\n- हर 6 महीने में मिट्टी का परीक्षण करें\n- pH स्तर जांचें (6.0-7.5 आदर्श)\n- पोषक तत्व सामग्री का विश्लेषण करें\n- जैविक पदार्थ सामग्री जांचें",
      type: "soil_advice",
      suggestions: ["मिट्टी परीक्षण गाइड", "उर्वरक कैलकुलेटर", "फसल चक्र योजना"]
    }
  },

  // Expert connect
  expert_connect: {
    en: {
      text: "Connect with agricultural experts for personalized advice:\n\n👨‍🌾 **Available Experts:**\n- Dr. Rajesh Kumar - Crop Disease Specialist\n- Dr. Priya Sharma - Soil Science Expert\n- Dr. Amit Singh - Pest Management Expert\n- Dr. Sunita Verma - Organic Farming Specialist\n\n📞 **Contact Options:**\n- Video consultation: ₹500/hour\n- Phone consultation: ₹300/hour\n- Text consultation: ₹100/question\n- Group sessions: ₹200/person\n\n🕒 **Available Hours:**\n- Monday-Friday: 9 AM - 6 PM\n- Saturday: 9 AM - 2 PM\n- Sunday: Emergency only\n\n📝 **How to Book:**\n1. Select expert and time slot\n2. Choose consultation type\n3. Pay online\n4. Receive meeting link\n5. Get expert advice",
      type: "expert_connect",
      suggestions: ["Book consultation", "View expert profiles", "Check availability"],
      quick_actions: [
        { title: "Book Now", action: "book_consultation", icon: "calendar" },
        { title: "Expert Profiles", action: "expert_profiles", icon: "user" },
        { title: "Emergency Help", action: "emergency_help", icon: "phone" }
      ]
    },
    hi: {
      text: "व्यक्तिगत सलाह के लिए कृषि विशेषज्ञों से जुड़ें:\n\n👨‍🌾 **उपलब्ध विशेषज्ञ:**\n- डॉ. राजेश कुमार - फसल रोग विशेषज्ञ\n- डॉ. प्रिया शर्मा - मिट्टी विज्ञान विशेषज्ञ\n- डॉ. अमित सिंह - कीट प्रबंधन विशेषज्ञ\n- डॉ. सुनीता वर्मा - जैविक खेती विशेषज्ञ",
      type: "expert_connect",
      suggestions: ["परामर्श बुक करें", "विशेषज्ञ प्रोफाइल देखें", "उपलब्धता जांचें"]
    }
  },

  // General greetings and help
  greeting: {
    en: {
      text: "Hello! I'm your AI farming assistant. I can help you with:\n\n🌤️ Weather forecasts and farming advice\n🌱 Crop health and disease diagnosis\n🐛 Pest identification and control\n🌾 Government schemes and subsidies\n💰 Market prices and trading tips\n🌿 Soil health and nutrition\n👨‍🌾 Expert consultations\n📱 Farm management tools\n\nHow can I assist you today?",
      type: "greeting",
      suggestions: ["Weather forecast", "Crop problems", "Government schemes", "Market prices"],
      quick_actions: [
        { title: "Weather Forecast", action: "weather_query", icon: "cloud" },
        { title: "Crop Problems", action: "crop_problem", icon: "bug" },
        { title: "Government Schemes", action: "schemes_info", icon: "government" },
        { title: "Market Prices", action: "market_prices", icon: "trending-up" }
      ]
    },
    hi: {
      text: "नमस्ते! मैं आपका AI कृषि सहायक हूँ। मैं आपकी इन चीजों में मदद कर सकता हूँ:\n\n🌤️ मौसम पूर्वानुमान और खेती सलाह\n🌱 फसल स्वास्थ्य और रोग निदान\n🐛 कीट पहचान और नियंत्रण\n🌾 सरकारी योजनाएं और सब्सिडी\n💰 बाजार मूल्य और ट्रेडिंग टिप्स\n🌿 मिट्टी स्वास्थ्य और पोषण\n👨‍🌾 विशेषज्ञ परामर्श\n📱 फार्म प्रबंधन उपकरण\n\nआज मैं आपकी कैसे मदद कर सकता हूँ?",
      type: "greeting",
      suggestions: ["मौसम पूर्वानुमान", "फसल समस्याएं", "सरकारी योजनाएं", "बाजार मूल्य"]
    }
  },

  // Error responses
  error: {
    en: {
      text: "I'm sorry, I'm having trouble connecting right now. Please try again later or use one of the quick actions below.",
      type: "error",
      suggestions: ["Try again", "Help", "Contact support"],
      quick_actions: [
        { title: "Try Again", action: "retry", icon: "refresh-cw" },
        { title: "Help", action: "help", icon: "help-circle" },
        { title: "Contact Support", action: "contact_support", icon: "phone" }
      ]
    },
    hi: {
      text: "मुझे खेद है, अभी मुझे कनेक्ट होने में परेशानी हो रही है। कृपया बाद में पुनः प्रयास करें या नीचे दिए गए त्वरित कार्यों का उपयोग करें।",
      type: "error",
      suggestions: ["पुनः प्रयास करें", "मदद", "सहायता से संपर्क करें"]
    }
  }
};

// Function to get response based on query and language
export const getChatbotResponse = (query: string, language: string = 'en'): ChatbotResponse => {
  const lowerQuery = query.toLowerCase();
  
  // Weather related queries
  if (lowerQuery.includes('weather') || lowerQuery.includes('rain') || lowerQuery.includes('temperature')) {
    return chatbotMockData.weather_query[language] || chatbotMockData.weather_query.en;
  }
  
  // Crop problem queries
  if (lowerQuery.includes('crop') && (lowerQuery.includes('problem') || lowerQuery.includes('disease') || lowerQuery.includes('sick'))) {
    return chatbotMockData.crop_problem[language] || chatbotMockData.crop_problem.en;
  }
  
  // Government schemes
  if (lowerQuery.includes('scheme') || lowerQuery.includes('subsidy') || lowerQuery.includes('government') || lowerQuery.includes('pm kisan')) {
    return chatbotMockData.schemes_info[language] || chatbotMockData.schemes_info.en;
  }
  
  // Market prices
  if (lowerQuery.includes('price') || lowerQuery.includes('market') || lowerQuery.includes('sell') || lowerQuery.includes('buy')) {
    return chatbotMockData.market_prices[language] || chatbotMockData.market_prices.en;
  }
  
  // Soil advice
  if (lowerQuery.includes('soil') || lowerQuery.includes('fertilizer') || lowerQuery.includes('nutrient')) {
    return chatbotMockData.soil_advice[language] || chatbotMockData.soil_advice.en;
  }
  
  // Expert connect
  if (lowerQuery.includes('expert') || lowerQuery.includes('consultation') || lowerQuery.includes('doctor')) {
    return chatbotMockData.expert_connect[language] || chatbotMockData.expert_connect.en;
  }
  
  // Default greeting
  return chatbotMockData.greeting[language] || chatbotMockData.greeting.en;
};

// Function to get response for quick actions
export const getQuickActionResponse = (action: string, language: string = 'en'): ChatbotResponse => {
  const actionMap: { [key: string]: string } = {
    'weather_query': 'weather_query',
    'crop_problem': 'crop_problem',
    'schemes_info': 'schemes_info',
    'market_prices': 'market_prices',
    'soil_advice': 'soil_advice',
    'expert_connect': 'expert_connect'
  };
  
  const responseKey = actionMap[action] || 'greeting';
  return chatbotMockData[responseKey][language] || chatbotMockData[responseKey].en;
};
