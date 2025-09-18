from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
import logging
from datetime import datetime

from services.chatbot_service import chatbot_service

logger = logging.getLogger(__name__)
router = APIRouter()

# Pydantic models for request/response
class ChatMessage(BaseModel):
    user_id: str
    message: str
    language: str = "en"
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    text: str
    type: str
    suggestions: Optional[List[str]] = None
    quick_actions: Optional[List[Dict[str, Any]]] = None
    actions: Optional[List[str]] = None
    timestamp: str
    user_id: str

class UserContext(BaseModel):
    user_id: str
    location: Optional[str] = None
    crops: Optional[List[str]] = None
    farm_size: Optional[str] = None
    farming_type: Optional[str] = None
    language: str = "en"

@router.post("/message", response_model=Dict[str, Any])
async def send_message(chat_message: ChatMessage) -> JSONResponse:
    """
    Send message to AI chatbot and get response
    
    Args:
        chat_message: User message with context
        
    Returns:
        JSON response with bot reply and suggestions
    """
    try:
        logger.info(f"Processing message from user {chat_message.user_id}: {chat_message.message[:50]}...")
        
        # Process message through chatbot service
        response = await chatbot_service.process_message(
            user_id=chat_message.user_id,
            message=chat_message.message,
            language=chat_message.language,
            context=chat_message.context
        )
        
        # Add metadata to response
        response["timestamp"] = datetime.now().isoformat()
        response["user_id"] = chat_message.user_id
        response["language"] = chat_message.language
        
        logger.info(f"Generated response for user {chat_message.user_id}: {response['type']}")
        return JSONResponse(content=response)
        
    except Exception as e:
        logger.error(f"Error processing chat message: {e}")
        raise HTTPException(status_code=500, detail="Failed to process message")

@router.get("/history/{user_id}")
async def get_chat_history(user_id: str, limit: int = 20) -> JSONResponse:
    """
    Get conversation history for a user
    
    Args:
        user_id: User identifier
        limit: Number of recent messages to retrieve
        
    Returns:
        JSON response with conversation history
    """
    try:
        history = chatbot_service.get_conversation_history(user_id, limit)
        
        return JSONResponse(content={
            "user_id": user_id,
            "history": history,
            "total_messages": len(history)
        })
        
    except Exception as e:
        logger.error(f"Error retrieving chat history: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve chat history")

@router.post("/context")
async def update_user_context(context: UserContext) -> JSONResponse:
    """
    Update user context information
    
    Args:
        context: User context data
        
    Returns:
        JSON response confirming context update
    """
    try:
        context_dict = context.dict(exclude_unset=True)
        user_id = context_dict.pop("user_id")
        
        chatbot_service.update_user_context(user_id, context_dict)
        
        return JSONResponse(content={
            "status": "success",
            "message": "User context updated successfully",
            "user_id": user_id
        })
        
    except Exception as e:
        logger.error(f"Error updating user context: {e}")
        raise HTTPException(status_code=500, detail="Failed to update user context")

@router.get("/context/{user_id}")
async def get_user_context(user_id: str) -> JSONResponse:
    """
    Get user context information
    
    Args:
        user_id: User identifier
        
    Returns:
        JSON response with user context
    """
    try:
        context = chatbot_service.get_user_context(user_id)
        
        return JSONResponse(content={
            "user_id": user_id,
            "context": context
        })
        
    except Exception as e:
        logger.error(f"Error retrieving user context: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve user context")

@router.get("/suggestions")
async def get_quick_suggestions(language: str = "en") -> JSONResponse:
    """
    Get quick suggestion buttons for chat interface
    
    Args:
        language: User's preferred language
        
    Returns:
        JSON response with quick suggestions and actions
    """
    try:
        suggestions = chatbot_service.get_quick_suggestions(language)
        quick_actions = chatbot_service.knowledge_base.get("quick_actions", [])
        
        return JSONResponse(content={
            "suggestions": suggestions,
            "quick_actions": quick_actions,
            "language": language
        })
        
    except Exception as e:
        logger.error(f"Error retrieving suggestions: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve suggestions")

@router.post("/voice")
async def process_voice_message(
    user_id: str,
    language: str = "en",
    audio_file: UploadFile = File(...)
) -> JSONResponse:
    """
    Process voice message (placeholder for future implementation)
    
    Args:
        user_id: User identifier
        language: User's preferred language
        audio_file: Audio file with voice message
        
    Returns:
        JSON response with transcribed text and bot response
    """
    try:
        # Placeholder implementation
        # In a real implementation, you would:
        # 1. Use speech-to-text service (Google Speech API, Azure Speech, etc.)
        # 2. Transcribe the audio to text
        # 3. Process the text through the chatbot
        # 4. Return both transcription and response
        
        return JSONResponse(content={
            "status": "not_implemented",
            "message": "Voice processing feature coming soon",
            "user_id": user_id,
            "language": language,
            "suggestion": "Please type your message for now"
        })
        
    except Exception as e:
        logger.error(f"Error processing voice message: {e}")
        raise HTTPException(status_code=500, detail="Failed to process voice message")

@router.post("/image-query")
async def process_image_query(
    user_id: str,
    message: str = "What do you see in this image?",
    language: str = "en",
    image_file: UploadFile = File(...)
) -> JSONResponse:
    """
    Process image with accompanying text query
    
    Args:
        user_id: User identifier
        message: Text message accompanying the image
        language: User's preferred language
        image_file: Image file for analysis
        
    Returns:
        JSON response with image analysis and recommendations
    """
    try:
        # Validate image file
        if not image_file.content_type or not image_file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # For now, we'll process the text message and suggest image analysis
        # In a full implementation, this would integrate with the existing
        # crop/pest/soil detection models
        
        response_text = f"I can see you've uploaded an image along with your question: '{message}'\n\n"
        response_text += "For detailed image analysis, please use our specialized tools:\n"
        response_text += "• Crop Health Detection for plant disease analysis\n"
        response_text += "• Pest Detection for identifying insects and pests\n"
        response_text += "• Soil Analysis for soil type and health assessment\n\n"
        response_text += "Would you like me to guide you to the appropriate analysis tool?"
        
        # Process the accompanying text message
        text_response = await chatbot_service.process_message(
            user_id=user_id,
            message=message,
            language=language
        )
        
        # Combine image acknowledgment with text response
        combined_response = {
            "text": response_text + "\n\n" + text_response.get("text", ""),
            "type": "image_query",
            "has_image": True,
            "image_filename": image_file.filename,
            "suggestions": [
                "Crop health analysis",
                "Pest detection",
                "Soil analysis",
                "Ask about the image"
            ],
            "actions": ["crop_analysis", "pest_detection", "soil_analysis"],
            "timestamp": datetime.now().isoformat(),
            "user_id": user_id,
            "language": language
        }
        
        return JSONResponse(content=combined_response)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing image query: {e}")
        raise HTTPException(status_code=500, detail="Failed to process image query")

@router.get("/health")
async def health_check() -> JSONResponse:
    """Health check endpoint for chatbot service"""
    try:
        # Check if knowledge base is loaded
        kb_loaded = bool(chatbot_service.knowledge_base)
        
        return JSONResponse(content={
            "status": "healthy",
            "service": "ai_chatbot",
            "knowledge_base_loaded": kb_loaded,
            "supported_languages": ["en", "hi", "ta", "te", "bn", "mr", "gu"],
            "features": [
                "text_chat",
                "multilingual_support", 
                "context_awareness",
                "conversation_history",
                "quick_suggestions",
                "image_queries"
            ]
        })
        
    except Exception as e:
        logger.error(f"Chatbot health check failed: {e}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "service": "ai_chatbot",
                "error": str(e)
            }
        )

@router.delete("/history/{user_id}")
async def clear_chat_history(user_id: str) -> JSONResponse:
    """
    Clear conversation history for a user
    
    Args:
        user_id: User identifier
        
    Returns:
        JSON response confirming history clearance
    """
    try:
        if user_id in chatbot_service.conversation_history:
            del chatbot_service.conversation_history[user_id]
        
        return JSONResponse(content={
            "status": "success",
            "message": "Chat history cleared successfully",
            "user_id": user_id
        })
        
    except Exception as e:
        logger.error(f"Error clearing chat history: {e}")
        raise HTTPException(status_code=500, detail="Failed to clear chat history")

@router.get("/stats/{user_id}")
async def get_chat_stats(user_id: str) -> JSONResponse:
    """
    Get chat statistics for a user
    
    Args:
        user_id: User identifier
        
    Returns:
        JSON response with chat statistics
    """
    try:
        history = chatbot_service.get_conversation_history(user_id, limit=1000)
        
        # Calculate statistics
        total_messages = len(history)
        user_messages = len([msg for msg in history if msg["sender"] == "user"])
        bot_messages = len([msg for msg in history if msg["sender"] == "bot"])
        
        # Get most recent language
        recent_language = history[-1]["language"] if history else "en"
        
        # Get user context
        context = chatbot_service.get_user_context(user_id)
        
        return JSONResponse(content={
            "user_id": user_id,
            "total_messages": total_messages,
            "user_messages": user_messages,
            "bot_messages": bot_messages,
            "recent_language": recent_language,
            "context": context,
            "first_interaction": history[0]["timestamp"] if history else None,
            "last_interaction": history[-1]["timestamp"] if history else None
        })
        
    except Exception as e:
        logger.error(f"Error retrieving chat stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve chat statistics")