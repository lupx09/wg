from langchain_core.tools import tool

@tool
def weather_data(location: str) -> dict:
    """
    Get current weather information for a location.
    
    Args:
        location: The location to get weather for
        
    Returns:
        Dictionary containing weather information
    """
    # Mock implementation - replace with actual weather API calls
    return {
        "location": location,
        "temperature": 22,
        "condition": "Partly Cloudy",
        "humidity": 65,
        "windSpeed": 12,
        "description": "Pleasant weather with some clouds"
    }
