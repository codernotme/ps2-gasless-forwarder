import os
from dotenv import load_dotenv

def load_env():
    """
    Load environment variables from a `.env` file if it exists,
    and ensure that the required `PRIVATE_KEY` environment variable is set.
    """
    # Load the .env file
    if not load_dotenv():
        print("No .env file found, relying on system environment variables")

    # Get the PRIVATE_KEY environment variable
    private_key = os.getenv("PRIVATE_KEY")
    if not private_key:
        raise EnvironmentError("PRIVATE_KEY not found in environment variables")
