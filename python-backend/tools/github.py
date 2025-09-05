from langchain_core.tools import tool

@tool
def github_repo(repo_url: str) -> dict:
    """
    Fetch GitHub repository information.
    
    Args:
        repo_url: The GitHub repository URL
        
    Returns:
        Dictionary containing repository information
    """
    # Mock implementation - replace with actual GitHub API calls
    return {
        "name": "example-repo",
        "description": "An example repository for demonstration",
        "stars": 1234,
        "forks": 567,
        "language": "Python",
        "url": repo_url,
        "topics": ["python", "ai", "langchain"]
    }
