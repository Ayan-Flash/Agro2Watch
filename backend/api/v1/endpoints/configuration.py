from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, Any, Optional
import logging
import asyncio
import httpx
from datetime import datetime

logger = logging.getLogger(__name__)
router = APIRouter()

# Pydantic models for request/response
class FirebaseConfig(BaseModel):
    projectId: str
    apiKey: str
    authDomain: str = ""
    storageBucket: str = ""
    messagingSenderId: str = ""
    appId: str = ""

class WeatherConfig(BaseModel):
    apiKey: str
    endpoint: str = "https://api.openweathermap.org/data/2.5"
    testLocation: str = "Delhi,IN"

class KYCConfig(BaseModel):
    apiKey: str
    endpoint: str
    authToken: str = ""

class FullConfiguration(BaseModel):
    firebase: FirebaseConfig
    weather: WeatherConfig
    kyc: KYCConfig

@router.post("/validate-firebase")
async def validate_firebase_config(config: FirebaseConfig) -> JSONResponse:
    """
    Validate Firebase configuration
    
    Args:
        config: Firebase configuration to validate
        
    Returns:
        JSON response with validation result
    """
    try:
        logger.info(f"Validating Firebase config for project: {config.projectId}")
        
        # Basic validation
        if not config.projectId or not config.apiKey:
            return JSONResponse(content={
                "valid": False,
                "error": "Project ID and API Key are required"
            })
        
        # Validate project ID format
        if not config.projectId.replace('-', '').replace('_', '').isalnum():
            return JSONResponse(content={
                "valid": False,
                "error": "Invalid project ID format"
            })
        
        # Validate API key format (should start with AIza)
        if not config.apiKey.startswith('AIza'):
            return JSONResponse(content={
                "valid": False,
                "error": "Invalid API key format. Firebase API keys should start with 'AIza'"
            })
        
        # Test Firebase configuration by making a request to Firebase REST API
        async with httpx.AsyncClient() as client:
            try:
                # Test with a simple auth request
                test_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={config.apiKey}"
                response = await client.post(test_url, json={}, timeout=10.0)
                
                # If we get a 400 with specific error about missing email, the API key is valid
                if response.status_code == 400:
                    error_data = response.json()
                    if "MISSING_EMAIL" in str(error_data):
                        return JSONResponse(content={
                            "valid": True,
                            "message": "Firebase configuration is valid"
                        })
                
                # Check for invalid API key error
                if response.status_code == 400:
                    error_data = response.json()
                    if "API_KEY_INVALID" in str(error_data):
                        return JSONResponse(content={
                            "valid": False,
                            "error": "Invalid Firebase API key"
                        })
                
                # If we reach here, assume it's valid (Firebase API might be working)
                return JSONResponse(content={
                    "valid": True,
                    "message": "Firebase configuration appears to be valid"
                })
                
            except httpx.TimeoutException:
                return JSONResponse(content={
                    "valid": False,
                    "error": "Timeout connecting to Firebase. Please check your internet connection."
                })
            except Exception as e:
                logger.error(f"Error testing Firebase API: {e}")
                # If we can't test, assume it's valid if format is correct
                return JSONResponse(content={
                    "valid": True,
                    "message": "Firebase configuration format is valid (unable to test connectivity)"
                })
        
    except Exception as e:
        logger.error(f"Error validating Firebase config: {e}")
        return JSONResponse(content={
            "valid": False,
            "error": f"Validation error: {str(e)}"
        })

@router.post("/validate-weather")
async def validate_weather_config(config: WeatherConfig) -> JSONResponse:
    """
    Validate Weather API configuration
    
    Args:
        config: Weather API configuration to validate
        
    Returns:
        JSON response with validation result and sample data
    """
    try:
        logger.info(f"Validating Weather API config for endpoint: {config.endpoint}")
        
        if not config.apiKey:
            return JSONResponse(content={
                "valid": False,
                "error": "API Key is required"
            })
        
        # Test the weather API with a sample request
        async with httpx.AsyncClient() as client:
            try:
                test_url = f"{config.endpoint}/weather"
                params = {
                    "q": config.testLocation,
                    "appid": config.apiKey,
                    "units": "metric"
                }
                
                response = await client.get(test_url, params=params, timeout=10.0)
                
                if response.status_code == 200:
                    weather_data = response.json()
                    return JSONResponse(content={
                        "valid": True,
                        "message": "Weather API is working correctly",
                        "data": weather_data
                    })
                elif response.status_code == 401:
                    return JSONResponse(content={
                        "valid": False,
                        "error": "Invalid API key. Please check your OpenWeatherMap API key."
                    })
                elif response.status_code == 404:
                    return JSONResponse(content={
                        "valid": False,
                        "error": f"Location '{config.testLocation}' not found. Please check the location format."
                    })
                else:
                    error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {}
                    return JSONResponse(content={
                        "valid": False,
                        "error": f"API request failed: {error_data.get('message', f'HTTP {response.status_code}')}"
                    })
                    
            except httpx.TimeoutException:
                return JSONResponse(content={
                    "valid": False,
                    "error": "Timeout connecting to Weather API. Please check your internet connection."
                })
            except Exception as e:
                logger.error(f"Error testing Weather API: {e}")
                return JSONResponse(content={
                    "valid": False,
                    "error": f"Connection error: {str(e)}"
                })
        
    except Exception as e:
        logger.error(f"Error validating Weather config: {e}")
        return JSONResponse(content={
            "valid": False,
            "error": f"Validation error: {str(e)}"
        })

@router.post("/validate-kyc")
async def validate_kyc_config(config: KYCConfig) -> JSONResponse:
    """
    Validate KYC API configuration
    
    Args:
        config: KYC API configuration to validate
        
    Returns:
        JSON response with validation result
    """
    try:
        logger.info(f"Validating KYC API config for endpoint: {config.endpoint}")
        
        if not config.apiKey or not config.endpoint:
            return JSONResponse(content={
                "valid": False,
                "error": "API Key and Endpoint are required"
            })
        
        # Test the KYC API endpoint
        async with httpx.AsyncClient() as client:
            try:
                # Try to make a simple request to test connectivity
                headers = {
                    "Authorization": f"Bearer {config.apiKey}",
                    "Content-Type": "application/json"
                }
                
                if config.authToken:
                    headers["X-Auth-Token"] = config.authToken
                
                # Most KYC APIs have a status or health endpoint
                test_endpoints = [
                    f"{config.endpoint}/status",
                    f"{config.endpoint}/health", 
                    f"{config.endpoint}/",
                    config.endpoint
                ]
                
                last_error = None
                
                for test_url in test_endpoints:
                    try:
                        response = await client.get(test_url, headers=headers, timeout=10.0)
                        
                        if response.status_code in [200, 401, 403]:
                            # 200 = success, 401/403 = auth issue but endpoint exists
                            if response.status_code == 200:
                                return JSONResponse(content={
                                    "valid": True,
                                    "message": "KYC API endpoint is accessible and responding"
                                })
                            else:
                                return JSONResponse(content={
                                    "valid": True,
                                    "message": "KYC API endpoint exists (authentication may need adjustment)"
                                })
                        
                    except Exception as e:
                        last_error = str(e)
                        continue
                
                # If all endpoints failed, try a POST request (some APIs only respond to POST)
                try:
                    response = await client.post(
                        f"{config.endpoint}/verify", 
                        headers=headers, 
                        json={"test": True},
                        timeout=10.0
                    )
                    
                    if response.status_code in [200, 400, 401, 403, 422]:
                        return JSONResponse(content={
                            "valid": True,
                            "message": "KYC API endpoint is accessible"
                        })
                        
                except Exception:
                    pass
                
                return JSONResponse(content={
                    "valid": False,
                    "error": f"Unable to connect to KYC API endpoint. Last error: {last_error or 'Connection failed'}"
                })
                
            except httpx.TimeoutException:
                return JSONResponse(content={
                    "valid": False,
                    "error": "Timeout connecting to KYC API. Please check the endpoint URL."
                })
            except Exception as e:
                logger.error(f"Error testing KYC API: {e}")
                return JSONResponse(content={
                    "valid": False,
                    "error": f"Connection error: {str(e)}"
                })
        
    except Exception as e:
        logger.error(f"Error validating KYC config: {e}")
        return JSONResponse(content={
            "valid": False,
            "error": f"Validation error: {str(e)}"
        })

@router.post("/validate-all")
async def validate_all_configurations(config: FullConfiguration) -> JSONResponse:
    """
    Validate all API configurations at once
    
    Args:
        config: Complete configuration to validate
        
    Returns:
        JSON response with validation results for all services
    """
    try:
        logger.info("Validating all API configurations")
        
        # Run all validations concurrently
        firebase_task = validate_firebase_config(config.firebase)
        weather_task = validate_weather_config(config.weather)
        kyc_task = validate_kyc_config(config.kyc)
        
        # Wait for all validations to complete
        firebase_result, weather_result, kyc_result = await asyncio.gather(
            firebase_task, weather_task, kyc_task, return_exceptions=True
        )
        
        # Process results
        results = {}
        
        # Firebase result
        if isinstance(firebase_result, JSONResponse):
            firebase_data = firebase_result.body.decode() if hasattr(firebase_result, 'body') else '{}'
            try:
                import json
                results['firebase'] = json.loads(firebase_data)
            except:
                results['firebase'] = {"valid": False, "error": "Validation failed"}
        else:
            results['firebase'] = {"valid": False, "error": str(firebase_result)}
        
        # Weather result
        if isinstance(weather_result, JSONResponse):
            weather_data = weather_result.body.decode() if hasattr(weather_result, 'body') else '{}'
            try:
                import json
                results['weather'] = json.loads(weather_data)
            except:
                results['weather'] = {"valid": False, "error": "Validation failed"}
        else:
            results['weather'] = {"valid": False, "error": str(weather_result)}
        
        # KYC result
        if isinstance(kyc_result, JSONResponse):
            kyc_data = kyc_result.body.decode() if hasattr(kyc_result, 'body') else '{}'
            try:
                import json
                results['kyc'] = json.loads(kyc_data)
            except:
                results['kyc'] = {"valid": False, "error": "Validation failed"}
        else:
            results['kyc'] = {"valid": False, "error": str(kyc_result)}
        
        # Calculate overall status
        valid_services = sum(1 for result in results.values() if result.get('valid', False))
        total_services = len(results)
        
        return JSONResponse(content={
            "overall_status": "success" if valid_services == total_services else "partial",
            "valid_services": valid_services,
            "total_services": total_services,
            "results": results,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error validating all configurations: {e}")
        return JSONResponse(content={
            "overall_status": "error",
            "error": f"Validation error: {str(e)}",
            "timestamp": datetime.now().isoformat()
        })

@router.get("/health")
async def health_check() -> JSONResponse:
    """Health check endpoint for configuration service"""
    return JSONResponse(content={
        "status": "healthy",
        "service": "configuration",
        "supported_services": ["firebase", "weather", "kyc"],
        "timestamp": datetime.now().isoformat()
    })

@router.get("/providers")
async def get_service_providers() -> JSONResponse:
    """Get list of supported service providers"""
    return JSONResponse(content={
        "firebase": {
            "name": "Firebase",
            "description": "Google's mobile and web application development platform",
            "website": "https://firebase.google.com",
            "signup_url": "https://console.firebase.google.com",
            "documentation": "https://firebase.google.com/docs"
        },
        "weather": {
            "name": "OpenWeatherMap",
            "description": "Weather data and forecast API service",
            "website": "https://openweathermap.org",
            "signup_url": "https://home.openweathermap.org/users/sign_up",
            "documentation": "https://openweathermap.org/api"
        },
        "kyc_providers": [
            {
                "id": "aadhaarapi",
                "name": "AadhaarAPI.com",
                "description": "Aadhaar verification and KYC services",
                "website": "https://aadhaarapi.com",
                "documentation": "https://aadhaarapi.com/docs"
            },
            {
                "id": "signzy",
                "name": "Signzy",
                "description": "Digital onboarding and identity verification",
                "website": "https://signzy.com",
                "documentation": "https://docs.signzy.com"
            },
            {
                "id": "hyperverge",
                "name": "HyperVerge",
                "description": "AI-powered identity verification",
                "website": "https://hyperverge.co",
                "documentation": "https://docs.hyperverge.co"
            }
        ]
    })

@router.post("/test-connection")
async def test_service_connection(service: str, config: Dict[str, Any]) -> JSONResponse:
    """
    Test connection to a specific service
    
    Args:
        service: Service name (firebase, weather, kyc)
        config: Service configuration
        
    Returns:
        JSON response with connection test result
    """
    try:
        if service == "firebase":
            firebase_config = FirebaseConfig(**config)
            return await validate_firebase_config(firebase_config)
        elif service == "weather":
            weather_config = WeatherConfig(**config)
            return await validate_weather_config(weather_config)
        elif service == "kyc":
            kyc_config = KYCConfig(**config)
            return await validate_kyc_config(kyc_config)
        else:
            return JSONResponse(content={
                "valid": False,
                "error": f"Unknown service: {service}"
            })
            
    except Exception as e:
        logger.error(f"Error testing {service} connection: {e}")
        return JSONResponse(content={
            "valid": False,
            "error": f"Connection test failed: {str(e)}"
        })