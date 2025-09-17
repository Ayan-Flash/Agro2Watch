import json
import re
from typing import Dict, List, Any, Optional
from pathlib import Path
import logging
from datetime import datetime
import asyncio

logger = logging.getLogger(__name__)

class ChatbotService:
    """
    AI Chatbot Service for AgroWatch
    Provides intelligent responses to farming-related queries
    """
    
    def __init__(self):
        self.knowledge_base = {}
        self.conversation_history = {}
        self.user_contexts = {}
        self.load_knowledge_base()
        
    def load_knowledge_base(self):
        """Load farming knowledge base from JSON file"""
        try:
            kb_path = Path(__file__).parent.parent / "data" / "farming_knowledge.json"
            with open(kb_path, 'r', encoding='utf-8') as f:
                self.knowledge_base = json.load(f)
            logger.info("Knowledge base loaded successfully")
        except Exception as e:
            logger.error(f"Error loading knowledge base: {e}")
            self.knowledge_base = {}
    
    async def process_message(self, user_id: str, message: str, language: str = "en", context: Dict = None) -> Dict[str, Any]:
        """
        Process user message and generate appropriate response
        
        Args:
            user_id: Unique user identifier
            message: User's message
            language: User's preferred language
            context: Additional context (location, crops, etc.)
            
        Returns:
            Dictionary containing bot response and metadata
        """
        try:
            # Update user context
            if context:
                self.user_contexts[user_id] = context
            
            # Store message in conversation history
            self._add_to_history(user_id, "user", message, language)
            
            # Analyze message intent and generate response
            intent = self._analyze_intent(message)
            response = await self._generate_response(user_id, message, intent, language)
            
            # Store bot response in history
            self._add_to_history(user_id, "bot", response["text"], language)
            
            return response
            
        except Exception as e:
            logger.error(f"Error processing message: {e}")
            return self._get_error_response(language)
    
    def _analyze_intent(self, message: str) -> Dict[str, Any]:
        """Analyze user message to determine intent"""
        message_lower = message.lower()
        
        # Define intent patterns
        intent_patterns = {
            "crop_advice": [
                r"crop|plant|grow|cultivation|farming|agriculture",
                r"wheat|rice|cotton|tomato|potato|corn|sugarcane",
                r"planting|sowing|harvesting|fertilizer|irrigation"
            ],
            "pest_management": [
                r"pest|insect|bug|disease|fungus|virus",
                r"aphid|bollworm|caterpillar|whitefly|thrips",
                r"spray|treatment|control|management"
            ],
            "soil_health": [
                r"soil|earth|ground|fertility|ph|nutrient",
                r"nitrogen|phosphorus|potassium|organic|compost",
                r"testing|analysis|improvement|amendment"
            ],
            "government_schemes": [
                r"scheme|subsidy|government|policy|benefit",
                r"pm.?kisan|pmfby|kcc|insurance|credit",
                r"application|eligibility|documents|apply"
            ],
            "weather": [
                r"weather|rain|temperature|climate|monsoon",
                r"forecast|prediction|season|humidity|wind"
            ],
            "market_prices": [
                r"price|market|sell|buy|cost|rate",
                r"mandi|trading|profit|loss|demand|supply"
            ],
            "greeting": [
                r"hello|hi|hey|namaste|vanakkam|namaskar",
                r"good morning|good afternoon|good evening"
            ],
            "help": [
                r"help|assist|support|guide|explain|how"
            ]
        }
        
        # Score each intent
        intent_scores = {}
        for intent, patterns in intent_patterns.items():
            score = 0
            for pattern in patterns:
                matches = len(re.findall(pattern, message_lower))
                score += matches
            intent_scores[intent] = score
        
        # Determine primary intent
        primary_intent = max(intent_scores, key=intent_scores.get) if max(intent_scores.values()) > 0 else "general"
        confidence = intent_scores.get(primary_intent, 0) / len(message.split()) if message.split() else 0
        
        return {
            "primary": primary_intent,
            "confidence": min(confidence, 1.0),
            "scores": intent_scores
        }
    
    async def _generate_response(self, user_id: str, message: str, intent: Dict, language: str) -> Dict[str, Any]:
        """Generate appropriate response based on intent"""
        
        intent_type = intent["primary"]
        
        # Handle different intent types
        if intent_type == "greeting":
            return self._get_greeting_response(language)
        elif intent_type == "help":
            return self._get_help_response(language)
        elif intent_type == "crop_advice":
            return self._get_crop_advice_response(message, language)
        elif intent_type == "pest_management":
            return self._get_pest_management_response(message, language)
        elif intent_type == "soil_health":
            return self._get_soil_health_response(message, language)
        elif intent_type == "government_schemes":
            return self._get_schemes_response(message, language)
        elif intent_type == "weather":
            return await self._get_weather_response(user_id, message, language)
        elif intent_type == "market_prices":
            return self._get_market_response(message, language)
        else:
            return self._get_general_response(message, language)
    
    def _get_greeting_response(self, language: str) -> Dict[str, Any]:
        """Generate greeting response"""
        greetings = self.knowledge_base.get("multilingual_responses", {}).get("greetings", {})
        help_options = self.knowledge_base.get("multilingual_responses", {}).get("help_options", {})
        
        greeting_text = greetings.get(language, greetings.get("en", "Hello! How can I help you today?"))
        help_text = help_options.get(language, help_options.get("en", "I can help with farming advice."))
        
        return {
            "text": f"{greeting_text}\n\n{help_text}",
            "type": "greeting",
            "quick_actions": self.knowledge_base.get("quick_actions", []),
            "suggestions": [
                "Weather forecast",
                "Crop problems",
                "Government schemes",
                "Market prices"
            ]
        }
    
    def _get_help_response(self, language: str) -> Dict[str, Any]:
        """Generate help response"""
        help_options = self.knowledge_base.get("multilingual_responses", {}).get("help_options", {})
        help_text = help_options.get(language, help_options.get("en", "I can help with farming advice."))
        
        return {
            "text": help_text,
            "type": "help",
            "quick_actions": self.knowledge_base.get("quick_actions", []),
            "categories": [
                "Crop Advice",
                "Pest Management", 
                "Soil Health",
                "Government Schemes",
                "Weather Information",
                "Market Prices"
            ]
        }
    
    def _get_crop_advice_response(self, message: str, language: str) -> Dict[str, Any]:
        """Generate crop advice response"""
        message_lower = message.lower()
        crop_advice = self.knowledge_base.get("crop_advice", {})
        
        # Identify mentioned crop
        detected_crop = None
        for crop in crop_advice.keys():
            if crop in message_lower:
                detected_crop = crop
                break
        
        if detected_crop:
            crop_info = crop_advice[detected_crop]
            
            # Determine specific advice type
            if any(word in message_lower for word in ["plant", "sow", "grow", "start"]):
                advice = crop_info.get("planting", {})
                advice_type = "planting"
            elif any(word in message_lower for word in ["care", "maintain", "fertiliz", "water"]):
                advice = crop_info.get("care", {})
                advice_type = "care"
            elif any(word in message_lower for word in ["harvest", "cut", "mature"]):
                advice = crop_info.get("harvesting", {})
                advice_type = "harvesting"
            else:
                # Provide general overview
                advice = crop_info
                advice_type = "general"
            
            response_text = self._format_crop_advice(detected_crop, advice, advice_type, language)
            
            return {
                "text": response_text,
                "type": "crop_advice",
                "crop": detected_crop,
                "advice_type": advice_type,
                "suggestions": [
                    f"{detected_crop.title()} planting guide",
                    f"{detected_crop.title()} care tips",
                    f"{detected_crop.title()} harvesting"
                ]
            }
        else:
            # General crop advice
            common_crops = list(crop_advice.keys())[:4]
            crop_list = ", ".join([crop.title() for crop in common_crops])
            
            return {
                "text": f"I can provide advice for various crops including {crop_list}. Which specific crop would you like to know about?",
                "type": "crop_selection",
                "crops": common_crops,
                "suggestions": [f"{crop.title()} advice" for crop in common_crops]
            }
    
    def _get_pest_management_response(self, message: str, language: str) -> Dict[str, Any]:
        """Generate pest management response"""
        message_lower = message.lower()
        pest_info = self.knowledge_base.get("pest_management", {})
        
        # Identify mentioned pest
        detected_pest = None
        for pest in pest_info.keys():
            if pest in message_lower or pest.replace("_", " ") in message_lower:
                detected_pest = pest
                break
        
        if detected_pest:
            pest_data = pest_info[detected_pest]
            
            response_text = f"**{detected_pest.replace('_', ' ').title()} Management:**\n\n"
            response_text += f"**Identification:** {pest_data.get('identification', 'Not available')}\n\n"
            response_text += f"**Damage:** {pest_data.get('damage', 'Not available')}\n\n"
            response_text += f"**Treatment:** {pest_data.get('treatment', 'Not available')}\n\n"
            response_text += f"**Prevention:** {pest_data.get('prevention', 'Not available')}"
            
            if 'biological_control' in pest_data:
                response_text += f"\n\n**Biological Control:** {pest_data['biological_control']}"
            
            return {
                "text": response_text,
                "type": "pest_management",
                "pest": detected_pest,
                "suggestions": [
                    "Other pest problems",
                    "Integrated pest management",
                    "Biological control methods"
                ]
            }
        else:
            # General pest management advice
            common_pests = list(pest_info.keys())[:4]
            pest_list = ", ".join([pest.replace("_", " ").title() for pest in common_pests])
            
            return {
                "text": f"I can help with pest management for {pest_list} and more. Which specific pest are you dealing with? You can also upload an image for identification.",
                "type": "pest_identification",
                "pests": common_pests,
                "suggestions": [pest.replace("_", " ").title() for pest in common_pests],
                "actions": ["upload_image", "pest_library"]
            }
    
    def _get_soil_health_response(self, message: str, language: str) -> Dict[str, Any]:
        """Generate soil health response"""
        message_lower = message.lower()
        soil_info = self.knowledge_base.get("soil_health", {})
        
        if any(word in message_lower for word in ["ph", "acid", "alkaline"]):
            ph_info = soil_info.get("ph_management", {})
            response_text = "**Soil pH Management:**\n\n"
            
            if "acid" in message_lower:
                acidic_info = ph_info.get("acidic_soil", {})
                response_text += f"**For Acidic Soil (pH < 6.5):**\n"
                response_text += f"Treatment: {acidic_info.get('treatment', 'Apply lime')}\n"
                response_text += f"Quantity: {acidic_info.get('quantity', '2-4 tons per hectare')}\n"
                response_text += f"Timing: {acidic_info.get('timing', 'Before planting')}"
            elif "alkaline" in message_lower:
                alkaline_info = ph_info.get("alkaline_soil", {})
                response_text += f"**For Alkaline Soil (pH > 8.0):**\n"
                response_text += f"Treatment: {alkaline_info.get('treatment', 'Apply gypsum')}\n"
                response_text += f"Quantity: {alkaline_info.get('quantity', '2-5 tons per hectare')}\n"
                response_text += f"Timing: {alkaline_info.get('timing', 'Before monsoon')}"
            else:
                response_text += "Soil pH affects nutrient availability. I can help with both acidic and alkaline soil management."
                
        elif any(word in message_lower for word in ["nitrogen", "phosphorus", "potassium", "nutrient"]):
            nutrient_info = soil_info.get("nutrient_management", {})
            
            if "nitrogen" in message_lower:
                n_info = nutrient_info.get("nitrogen", {})
                response_text = f"**Nitrogen Management:**\n\n"
                response_text += f"**Deficiency Signs:** {n_info.get('deficiency_signs', 'Yellowing of leaves')}\n"
                response_text += f"**Sources:** {n_info.get('sources', 'Urea, organic manure')}\n"
                response_text += f"**Application:** {n_info.get('application', 'Split doses')}\n"
                response_text += f"**Timing:** {n_info.get('timing', 'Active growth stages')}"
            elif "phosphorus" in message_lower:
                p_info = nutrient_info.get("phosphorus", {})
                response_text = f"**Phosphorus Management:**\n\n"
                response_text += f"**Deficiency Signs:** {p_info.get('deficiency_signs', 'Purple coloration')}\n"
                response_text += f"**Sources:** {p_info.get('sources', 'DAP, SSP')}\n"
                response_text += f"**Application:** {p_info.get('application', 'At planting time')}\n"
                response_text += f"**Availability:** {p_info.get('availability', 'Better in neutral pH')}"
            elif "potassium" in message_lower:
                k_info = nutrient_info.get("potassium", {})
                response_text = f"**Potassium Management:**\n\n"
                response_text += f"**Deficiency Signs:** {k_info.get('deficiency_signs', 'Leaf margin yellowing')}\n"
                response_text += f"**Sources:** {k_info.get('sources', 'MOP, SOP')}\n"
                response_text += f"**Application:** {k_info.get('application', 'Split application')}\n"
                response_text += f"**Mobility:** {k_info.get('mobility', 'Highly mobile')}"
            else:
                response_text = "**Nutrient Management:**\n\nI can help with nitrogen, phosphorus, and potassium management. Which specific nutrient would you like to know about?"
                
        elif any(word in message_lower for word in ["organic", "compost", "manure"]):
            organic_info = soil_info.get("organic_matter", {})
            response_text = f"**Organic Matter Management:**\n\n"
            response_text += f"**Importance:** {organic_info.get('importance', 'Improves soil structure')}\n"
            response_text += f"**Sources:** {organic_info.get('sources', 'Compost, manure')}\n"
            response_text += f"**Application Rate:** {organic_info.get('application_rate', '10-15 tons per hectare')}\n"
            response_text += f"**Benefits:** {organic_info.get('benefits', 'Enhanced soil health')}"
        else:
            response_text = "I can help with soil health management including pH correction, nutrient management, and organic matter improvement. What specific soil issue are you facing?"
        
        return {
            "text": response_text,
            "type": "soil_health",
            "suggestions": [
                "Soil pH testing",
                "Nutrient deficiency",
                "Organic matter improvement",
                "Soil testing locations"
            ],
            "actions": ["soil_test_centers", "upload_soil_image"]
        }
    
    def _get_schemes_response(self, message: str, language: str) -> Dict[str, Any]:
        """Generate government schemes response"""
        message_lower = message.lower()
        schemes_info = self.knowledge_base.get("government_schemes", {})
        
        # Identify mentioned scheme
        detected_scheme = None
        scheme_keywords = {
            "pm_kisan": ["pm kisan", "pmkisan", "kisan samman", "6000"],
            "pmfby": ["pmfby", "fasal bima", "crop insurance", "insurance"],
            "kcc": ["kcc", "kisan credit", "credit card", "loan"],
            "soil_health_card": ["soil health", "soil card", "soil test"]
        }
        
        for scheme, keywords in scheme_keywords.items():
            if any(keyword in message_lower for keyword in keywords):
                detected_scheme = scheme
                break
        
        if detected_scheme:
            scheme_data = schemes_info[detected_scheme]
            
            response_text = f"**{scheme_data.get('full_name', detected_scheme.upper())}**\n\n"
            response_text += f"**Eligibility:** {scheme_data.get('eligibility', 'Not specified')}\n\n"
            response_text += f"**Benefits:** {scheme_data.get('benefits', 'Not specified')}\n\n"
            response_text += f"**Application:** {scheme_data.get('application', 'Contact local authorities')}\n\n"
            
            if 'documents' in scheme_data:
                response_text += f"**Required Documents:** {scheme_data['documents']}\n\n"
            
            if 'helpline' in scheme_data:
                response_text += f"**Helpline:** {scheme_data['helpline']}"
            
            return {
                "text": response_text,
                "type": "government_scheme",
                "scheme": detected_scheme,
                "suggestions": [
                    "Other government schemes",
                    "Application process",
                    "Required documents",
                    "Eligibility check"
                ],
                "actions": ["scheme_application", "document_checklist"]
            }
        else:
            # List available schemes
            scheme_names = [schemes_info[scheme].get('full_name', scheme) for scheme in schemes_info.keys()]
            
            response_text = "**Available Government Schemes for Farmers:**\n\n"
            for i, (scheme_key, scheme_data) in enumerate(schemes_info.items(), 1):
                response_text += f"{i}. **{scheme_data.get('full_name', scheme_key)}**\n"
                response_text += f"   {scheme_data.get('benefits', 'Benefits available')}\n\n"
            
            response_text += "Which scheme would you like to know more about?"
            
            return {
                "text": response_text,
                "type": "schemes_list",
                "schemes": list(schemes_info.keys()),
                "suggestions": [scheme_data.get('full_name', key) for key, scheme_data in schemes_info.items()]
            }
    
    async def _get_weather_response(self, user_id: str, message: str, language: str) -> Dict[str, Any]:
        """Generate weather-related response"""
        # Get user location from context
        user_context = self.user_contexts.get(user_id, {})
        location = user_context.get('location', 'your area')
        
        weather_advice = self.knowledge_base.get("weather_advice", {})
        
        response_text = f"**Weather Information for {location}:**\n\n"
        response_text += "I can provide weather-based farming advice for different seasons:\n\n"
        
        for season, advice in weather_advice.items():
            response_text += f"**{season.title()} Season:**\n"
            response_text += f"• Preparation: {advice.get('preparation', 'Plan accordingly')}\n"
            response_text += f"• Crop Selection: {advice.get('crop_selection', 'Choose appropriate crops')}\n\n"
        
        response_text += "For current weather conditions and forecasts, please check your local weather service or the weather section in the app."
        
        return {
            "text": response_text,
            "type": "weather_advice",
            "suggestions": [
                "Current weather",
                "7-day forecast", 
                "Seasonal advice",
                "Weather alerts"
            ],
            "actions": ["weather_forecast", "weather_alerts"]
        }
    
    def _get_market_response(self, message: str, language: str) -> Dict[str, Any]:
        """Generate market information response"""
        market_info = self.knowledge_base.get("market_information", {})
        
        response_text = "**Market Information and Pricing:**\n\n"
        
        price_factors = market_info.get("price_factors", {})
        response_text += "**Factors Affecting Crop Prices:**\n"
        for factor, description in price_factors.items():
            response_text += f"• {factor.replace('_', ' ').title()}: {description}\n"
        
        response_text += "\n**Selling Tips:**\n"
        selling_tips = market_info.get("selling_tips", {})
        for tip, description in selling_tips.items():
            response_text += f"• {tip.replace('_', ' ').title()}: {description}\n"
        
        response_text += "\n**Price Information Sources:**\n"
        price_sources = market_info.get("price_information", {})
        for source, description in price_sources.items():
            response_text += f"• {source.replace('_', ' ').title()}: {description}\n"
        
        return {
            "text": response_text,
            "type": "market_information",
            "suggestions": [
                "Current crop prices",
                "Market trends",
                "Best selling time",
                "Price comparison"
            ],
            "actions": ["price_check", "market_trends", "mandi_prices"]
        }
    
    def _get_general_response(self, message: str, language: str) -> Dict[str, Any]:
        """Generate general response for unrecognized queries"""
        # Check if message matches any common questions
        common_questions = self.knowledge_base.get("common_questions", [])
        
        message_lower = message.lower()
        best_match = None
        best_score = 0
        
        for qa in common_questions:
            question = qa.get("question", "").lower()
            # Simple word matching score
            common_words = set(message_lower.split()) & set(question.split())
            score = len(common_words) / max(len(question.split()), 1)
            
            if score > best_score and score > 0.3:  # Threshold for relevance
                best_match = qa
                best_score = score
        
        if best_match:
            return {
                "text": best_match.get("answer", "I'm here to help with farming questions."),
                "type": "faq_answer",
                "category": best_match.get("category", "general"),
                "confidence": best_score,
                "suggestions": [
                    "More about " + best_match.get("category", "farming"),
                    "Other common questions",
                    "Specific crop advice"
                ]
            }
        else:
            # Default response
            return {
                "text": "I'm here to help with farming questions! I can assist you with crop advice, pest management, soil health, government schemes, weather information, and market prices. What would you like to know about?",
                "type": "general_help",
                "quick_actions": self.knowledge_base.get("quick_actions", []),
                "suggestions": [
                    "Crop problems",
                    "Government schemes",
                    "Weather forecast",
                    "Market prices"
                ]
            }
    
    def _format_crop_advice(self, crop: str, advice: Dict, advice_type: str, language: str) -> str:
        """Format crop advice into readable text"""
        if advice_type == "general":
            response_text = f"**{crop.title()} Farming Guide:**\n\n"
            
            if "planting" in advice:
                response_text += "**Planting:**\n"
                planting = advice["planting"]
                for key, value in planting.items():
                    response_text += f"• {key.replace('_', ' ').title()}: {value}\n"
                response_text += "\n"
            
            if "care" in advice:
                response_text += "**Care & Management:**\n"
                care = advice["care"]
                for key, value in care.items():
                    response_text += f"• {key.replace('_', ' ').title()}: {value}\n"
                response_text += "\n"
            
            if "harvesting" in advice:
                response_text += "**Harvesting:**\n"
                harvesting = advice["harvesting"]
                for key, value in harvesting.items():
                    response_text += f"• {key.replace('_', ' ').title()}: {value}\n"
        else:
            response_text = f"**{crop.title()} - {advice_type.title()}:**\n\n"
            for key, value in advice.items():
                response_text += f"**{key.replace('_', ' ').title()}:** {value}\n\n"
        
        return response_text
    
    def _add_to_history(self, user_id: str, sender: str, message: str, language: str):
        """Add message to conversation history"""
        if user_id not in self.conversation_history:
            self.conversation_history[user_id] = []
        
        self.conversation_history[user_id].append({
            "sender": sender,
            "message": message,
            "language": language,
            "timestamp": datetime.now().isoformat()
        })
        
        # Keep only last 50 messages per user
        if len(self.conversation_history[user_id]) > 50:
            self.conversation_history[user_id] = self.conversation_history[user_id][-50:]
    
    def _get_error_response(self, language: str) -> Dict[str, Any]:
        """Generate error response"""
        error_messages = {
            "en": "I'm sorry, I encountered an error. Please try again.",
            "hi": "मुझे खुशी है, मुझे एक त्रुटि का सामना करना पड़ा। कृपया पुनः प्रयास करें।",
            "ta": "மன்னிக்கவும், எனக்கு ஒரு பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
            "te": "క్షమించండి, నాకు ఒక లోపం ఎదురైంది. దయచేసి మళ్లీ ప్రయత్నించండి.",
            "bn": "দুঃখিত, আমার একটি ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
            "mr": "मला माफ करा, मला एक त्रुटी आली. कृपया पुन्हा प्रयत्न करा।",
            "gu": "માફ કરશો, મને એક ભૂલ થઈ. કૃપા કરીને ફરી પ્રયાસ કરો."
        }
        
        return {
            "text": error_messages.get(language, error_messages["en"]),
            "type": "error",
            "suggestions": ["Try again", "Help", "Contact support"]
        }
    
    def get_conversation_history(self, user_id: str, limit: int = 20) -> List[Dict]:
        """Get conversation history for a user"""
        history = self.conversation_history.get(user_id, [])
        return history[-limit:] if history else []
    
    def get_quick_suggestions(self, language: str = "en") -> List[str]:
        """Get quick suggestion buttons"""
        return [
            "Weather forecast",
            "Crop problems", 
            "Government schemes",
            "Market prices",
            "Soil testing",
            "Expert help"
        ]
    
    def update_user_context(self, user_id: str, context: Dict):
        """Update user context information"""
        if user_id not in self.user_contexts:
            self.user_contexts[user_id] = {}
        
        self.user_contexts[user_id].update(context)
    
    def get_user_context(self, user_id: str) -> Dict:
        """Get user context information"""
        return self.user_contexts.get(user_id, {})

# Global chatbot service instance
chatbot_service = ChatbotService()