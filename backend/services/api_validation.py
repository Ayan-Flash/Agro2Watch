import httpx
import asyncio
from typing import Dict, Any, Optional, Tuple
import logging
from datetime import datetime, timedelta
import json

logger = logging.getLogger(__name__)

class APIValidationService:
    """
    Service for validating API configurations and testing connectivity
    """
    
    def __init__(self):
        self.validation_cache = {}
        self.cache_ttl = timedelta(minutes=5)  # Cache results for 5 minutes
    
    async def validate_firebase_config(self, config: Dict[str, Any]) -> Tuple[bool, str, Optional[Dict]]:
        """
        Validate Firebase configuration
        
        Args:
            config: Firebase configuration dictionary
            
        Returns:
            Tuple of (is_valid, message, additional_data)
        """
        try:
            project_id = config.get('projectId', '')
            api_key = config.get('apiKey', '')
            
            if not project_id or not api_key:
                return False, "Project ID and API Key are required", None
            
            # Check cache first
            cache_key = f"firebase_{project_id}_{api_key[:10]}"
            if self._is_cached_valid(cache_key):
                cached_result = self.validation_cache[cache_key]
                return cached_result['valid'], cached_result['message'], cached_result.get('data')
            
            # Validate format
            if not self._validate_firebase_format(project_id, api_key):
                return False, "Invalid Firebase configuration format", None
            
            # Test API connectivity
            is_valid, message, data = await self._test_firebase_api(api_key)
            
            # Cache result
            self._cache_result(cache_key, is_valid, message, data)
            
            return is_valid, message, data
            
        except Exception as e:
            logger.error(f"Error validating Firebase config: {e}")
            return False, f"Validation error: {str(e)}", None
    
    async def validate_weather_config(self, config: Dict[str, Any]) -> Tuple[bool, str, Optional[Dict]]:
        """
        Validate Weather API configuration
        
        Args:
            config: Weather API configuration dictionary
            
        Returns:
            Tuple of (is_valid, message, weather_data)
        """
        try:
            api_key = config.get('apiKey', '')
            endpoint = config.get('endpoint', 'https://api.openweathermap.org/data/2.5')
            test_location = config.get('testLocation', 'Delhi,IN')
            
            if not api_key:
                return False, "API Key is required", None
            
            # Check cache first
            cache_key = f"weather_{api_key[:10]}"
            if self._is_cached_valid(cache_key):
                cached_result = self.validation_cache[cache_key]
                return cached_result['valid'], cached_result['message'], cached_result.get('data')
            
            # Test weather API
            is_valid, message, data = await self._test_weather_api(api_key, endpoint, test_location)
            
            # Cache result
            self._cache_result(cache_key, is_valid, message, data)
            
            return is_valid, message, data
            
        except Exception as e:
            logger.error(f"Error validating Weather config: {e}")
            return False, f"Validation error: {str(e)}", None
    
    async def validate_kyc_config(self, config: Dict[str, Any]) -> Tuple[bool, str, Optional[Dict]]:
        """
        Validate KYC API configuration
        
        Args:
            config: KYC API configuration dictionary
            
        Returns:
            Tuple of (is_valid, message, additional_data)
        """
        try:
            api_key = config.get('apiKey', '')
            endpoint = config.get('endpoint', '')
            auth_token = config.get('authToken', '')
            
            if not api_key or not endpoint:
                return False, "API Key and Endpoint are required", None
            
            # Check cache first
            cache_key = f"kyc_{api_key[:10]}_{endpoint}"
            if self._is_cached_valid(cache_key):
                cached_result = self.validation_cache[cache_key]
                return cached_result['valid'], cached_result['message'], cached_result.get('data')
            
            # Test KYC API
            is_valid, message, data = await self._test_kyc_api(api_key, endpoint, auth_token)
            
            # Cache result
            self._cache_result(cache_key, is_valid, message, data)
            
            return is_valid, message, data
            
        except Exception as e:
            logger.error(f"Error validating KYC config: {e}")
            return False, f"Validation error: {str(e)}", None
    
    def _validate_firebase_format(self, project_id: str, api_key: str) -> bool:
        """Validate Firebase configuration format"""
        # Project ID should be alphanumeric with hyphens
        if not project_id.replace('-', '').replace('_', '').isalnum():
            return False
        
        # API key should start with AIza
        if not api_key.startswith('AIza'):
            return False
        
        return True
    
    async def _test_firebase_api(self, api_key: str) -> Tuple[bool, str, Optional[Dict]]:
        """Test Firebase API connectivity"""
        try:
            async with httpx.AsyncClient() as client:
                # Test with Firebase Auth REST API
                test_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={api_key}"
                
                response = await client.post(
                    test_url, 
                    json={},  # Empty request to trigger validation
                    timeout=10.0
                )
                
                if response.status_code == 400:
                    error_data = response.json()
                    error_message = error_data.get('error', {}).get('message', '')
                    
                    # If we get MISSING_EMAIL, the API key is valid
                    if 'MISSING_EMAIL' in error_message:
                        return True, "Firebase API key is valid", {"status": "authenticated"}
                    
                    # If we get API_KEY_INVALID, the key is invalid
                    if 'API_KEY_INVALID' in error_message:
                        return False, "Invalid Firebase API key", None
                
                # For other responses, assume valid if we got a response
                return True, "Firebase API key appears to be valid", {"status": "connected"}
                
        except httpx.TimeoutException:
            return False, "Timeout connecting to Firebase API", None
        except Exception as e:
            logger.error(f"Error testing Firebase API: {e}")
            return False, f"Connection error: {str(e)}", None
    
    async def _test_weather_api(self, api_key: str, endpoint: str, location: str) -> Tuple[bool, str, Optional[Dict]]:
        """Test Weather API connectivity"""
        try:
            async with httpx.AsyncClient() as client:
                test_url = f"{endpoint}/weather"
                params = {
                    "q": location,
                    "appid": api_key,
                    "units": "metric"
                }
                
                response = await client.get(test_url, params=params, timeout=10.0)
                
                if response.status_code == 200:
                    weather_data = response.json()
                    return True, "Weather API is working correctly", weather_data
                elif response.status_code == 401:
                    return False, "Invalid Weather API key", None
                elif response.status_code == 404:
                    return False, f"Location '{location}' not found", None
                else:
                    error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {}
                    error_message = error_data.get('message', f'HTTP {response.status_code}')
                    return False, f"Weather API error: {error_message}", None
                    
        except httpx.TimeoutException:
            return False, "Timeout connecting to Weather API", None
        except Exception as e:
            logger.error(f"Error testing Weather API: {e}")
            return False, f"Connection error: {str(e)}", None
    
    async def _test_kyc_api(self, api_key: str, endpoint: str, auth_token: str = "") -> Tuple[bool, str, Optional[Dict]]:
        """Test KYC API connectivity"""
        try:
            async with httpx.AsyncClient() as client:
                headers = {
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                }
                
                if auth_token:
                    headers["X-Auth-Token"] = auth_token
                
                # Try multiple common endpoints
                test_endpoints = [
                    f"{endpoint}/status",
                    f"{endpoint}/health",
                    f"{endpoint}/",
                    endpoint.rstrip('/')
                ]
                
                for test_url in test_endpoints:
                    try:
                        response = await client.get(test_url, headers=headers, timeout=10.0)
                        
                        if response.status_code == 200:
                            return True, "KYC API is accessible and responding", {"endpoint": test_url}
                        elif response.status_code in [401, 403]:
                            return True, "KYC API endpoint exists (check authentication)", {"endpoint": test_url}
                        
                    except Exception:
                        continue
                
                # Try POST request for verification endpoint
                try:
                    verify_url = f"{endpoint}/verify"
                    response = await client.post(
                        verify_url,
                        headers=headers,
                        json={"test": True},
                        timeout=10.0
                    )
                    
                    if response.status_code in [200, 400, 401, 403, 422]:
                        return True, "KYC API endpoint is accessible", {"endpoint": verify_url}
                        
                except Exception:
                    pass
                
                return False, "Unable to connect to KYC API endpoint", None
                
        except httpx.TimeoutException:
            return False, "Timeout connecting to KYC API", None
        except Exception as e:
            logger.error(f"Error testing KYC API: {e}")
            return False, f"Connection error: {str(e)}", None
    
    def _is_cached_valid(self, cache_key: str) -> bool:
        """Check if cached result is still valid"""
        if cache_key not in self.validation_cache:
            return False
        
        cached_time = self.validation_cache[cache_key]['timestamp']
        return datetime.now() - cached_time < self.cache_ttl
    
    def _cache_result(self, cache_key: str, is_valid: bool, message: str, data: Optional[Dict]):
        """Cache validation result"""
        self.validation_cache[cache_key] = {
            'valid': is_valid,
            'message': message,
            'data': data,
            'timestamp': datetime.now()
        }
    
    async def validate_all_services(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate all API services concurrently
        
        Args:
            config: Complete configuration dictionary
            
        Returns:
            Dictionary with validation results for all services
        """
        try:
            # Extract service configurations
            firebase_config = config.get('firebase', {})
            weather_config = config.get('weather', {})
            kyc_config = config.get('kyc', {})
            
            # Run validations concurrently
            firebase_task = self.validate_firebase_config(firebase_config)
            weather_task = self.validate_weather_config(weather_config)
            kyc_task = self.validate_kyc_config(kyc_config)
            
            firebase_result, weather_result, kyc_result = await asyncio.gather(
                firebase_task, weather_task, kyc_task, return_exceptions=True
            )
            
            # Process results
            results = {}
            
            # Firebase
            if isinstance(firebase_result, tuple):
                is_valid, message, data = firebase_result
                results['firebase'] = {
                    'valid': is_valid,
                    'message': message,
                    'data': data
                }
            else:
                results['firebase'] = {
                    'valid': False,
                    'message': str(firebase_result),
                    'data': None
                }
            
            # Weather
            if isinstance(weather_result, tuple):
                is_valid, message, data = weather_result
                results['weather'] = {
                    'valid': is_valid,
                    'message': message,
                    'data': data
                }
            else:
                results['weather'] = {
                    'valid': False,
                    'message': str(weather_result),
                    'data': None
                }
            
            # KYC
            if isinstance(kyc_result, tuple):
                is_valid, message, data = kyc_result
                results['kyc'] = {
                    'valid': is_valid,
                    'message': message,
                    'data': data
                }
            else:
                results['kyc'] = {
                    'valid': False,
                    'message': str(kyc_result),
                    'data': None
                }
            
            # Calculate overall status
            valid_count = sum(1 for result in results.values() if result['valid'])
            total_count = len(results)
            
            return {
                'overall_valid': valid_count == total_count,
                'valid_services': valid_count,
                'total_services': total_count,
                'results': results,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error validating all services: {e}")
            return {
                'overall_valid': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def clear_cache(self):
        """Clear validation cache"""
        self.validation_cache.clear()

# Global validation service instance
api_validation_service = APIValidationService()