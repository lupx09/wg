from langchain_core.tools import tool

@tool
def invoice_parser(invoice_data: str) -> dict:
    """
    Parse invoice information from text or image data.
    
    Args:
        invoice_data: The invoice data to parse
        
    Returns:
        Dictionary containing parsed invoice information
    """
    # Mock implementation - replace with actual invoice parsing logic
    return {
        "invoiceNumber": "INV-2024-001",
        "date": "2024-01-15",
        "dueDate": "2024-02-15",
        "amount": 1250.00,
        "currency": "USD",
        "status": "pending",
        "vendor": "Example Vendor Inc.",
        "items": [
            {
                "description": "Consulting Services",
                "quantity": 10,
                "unitPrice": 100.00,
                "total": 1000.00
            },
            {
                "description": "Software License",
                "quantity": 1,
                "unitPrice": 250.00,
                "total": 250.00
            }
        ]
    }
