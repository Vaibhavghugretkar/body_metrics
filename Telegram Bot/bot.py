from flask import Flask, request, Response
from twilio.twiml.messaging_response import MessagingResponse
import os
from dotenv import load_dotenv
import requests
import json
from sarvamai import SarvamAI
import logging
import time

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Initialize Sarvam client
sarvam_client = SarvamAI(
    api_subscription_key=os.getenv("SARVAM_API_KEY")
)

# Store user sessions
user_sessions = {}

# Supported languages
SUPPORTED_LANGUAGES = {
    "1": "en-IN",  # English
    "2": "hi-IN",  # Hindi
    "3": "bn-IN",  # Bengali
    "4": "gu-IN",  # Gujarati
    "5": "kn-IN",  # Kannada
    "6": "ml-IN",  # Malayalam
    "7": "mr-IN",  # Marathi
    "8": "od-IN",  # Odia
    "9": "pa-IN",  # Punjabi
    "10": "ta-IN", # Tamil
    "11": "te-IN"  # Telugu
}

def translate_text(text, target_language="en-IN"):
    """Translate text using Sarvam API"""
    try:
        response = sarvam_client.text.translate(
            input=text,
            source_language_code="auto",
            target_language_code=target_language,
            speaker_gender="Male"
        )
        # Extract the translated text from the response
        if hasattr(response, 'translated_text'):
            return response.translated_text
        elif isinstance(response, dict) and 'translated_text' in response:
            return response['translated_text']
        else:
            logger.error(f"Unexpected translation response format: {response}")
            return text
    except Exception as e:
        logger.error(f"Translation error: {e}")
        return text

def calculateSize(measurements):
    """Calculate clothing sizes based on measurements"""
    chest = measurements.get("chest", 0)
    height = measurements.get("height", 0)
    hips = measurements.get("hips", 0)
    waist = measurements.get("waist", 0)
    footLength = measurements.get("footLength", None)

    # Shirt size determination
    shirtSize = "Unknown"
    if chest and height:
        if chest >= 86 and chest <= 94 and height >= 160 and height <= 170:
            shirtSize = "S"
        elif chest >= 95 and chest <= 102 and height >= 165 and height <= 180:
            shirtSize = "M"
        elif chest >= 103 and chest <= 110 and height >= 170 and height <= 185:
            shirtSize = "L"
        elif chest >= 111 and chest <= 118 and height >= 175 and height <= 190:
            shirtSize = "XL"
        elif chest >= 119 and chest <= 126 and height >= 180 and height <= 195:
            shirtSize = "XXL"
        elif chest >= 127 and height > 190:
            shirtSize = "XXXL"
        # fallback: pick closest size if not exact
        elif chest > 0 and height > 0:
            if chest < 86:
                shirtSize = "S"
            elif chest < 95:
                shirtSize = "S"
            elif chest < 103:
                shirtSize = "M"
            elif chest < 111:
                shirtSize = "L"
            elif chest < 119:
                shirtSize = "XL"
            elif chest < 127:
                shirtSize = "XXL"
            else:
                shirtSize = "XXXL"

    # Pants size determination
    pantsSize = "Unknown"
    if waist and hips:
        if waist >= 71 and waist <= 78 and hips >= 88 and hips <= 95:
            pantsSize = "S"
        elif waist >= 79 and waist <= 86 and hips >= 96 and hips <= 103:
            pantsSize = "M"
        elif waist >= 87 and waist <= 94 and hips >= 104 and hips <= 111:
            pantsSize = "L"
        elif waist >= 95 and waist <= 102 and hips >= 112 and hips <= 119:
            pantsSize = "XL"
        elif waist >= 103 and waist <= 110 and hips >= 120 and hips <= 127:
            pantsSize = "XXL"
        elif waist >= 111 or hips >= 128:
            pantsSize = "XXXL"
        # fallback: pick closest size if not exact
        elif waist > 0 and hips > 0:
            if waist < 71:
                pantsSize = "S"
            elif waist < 79:
                pantsSize = "S"
            elif waist < 87:
                pantsSize = "M"
            elif waist < 95:
                pantsSize = "L"
            elif waist < 103:
                pantsSize = "XL"
            elif waist < 111:
                pantsSize = "XXL"
            else:
                pantsSize = "XXXL"

    # Shoe size determination
    shoeSize = "Unknown"
    if footLength:
        if footLength >= 24.5 and footLength <= 25.4:
            shoeSize = 7
        elif footLength >= 25.5 and footLength <= 26.4:
            shoeSize = 8
        elif footLength >= 26.5 and footLength <= 27.4:
            shoeSize = 9
        elif footLength >= 27.5 and footLength <= 28.4:
            shoeSize = 10
        elif footLength >= 28.5 and footLength <= 29.4:
            shoeSize = 11
        elif footLength >= 29.5 and footLength <= 30.4:
            shoeSize = 12

    # Shoe size calculation based on height (Indian sizing)
    if shoeSize == "Unknown" and height:
        shoeSize = round((height - 100) / 10) + 5

    return {"shirtSize": shirtSize, "pantsSize": pantsSize, "shoeSize": shoeSize}

def get_measurements_from_api(image_url):
    """Get measurements from the measurement API"""
    try:
        start_time = time.time()
        # Download the image from Twilio URL
        logger.info(f"Downloading image from Twilio URL: {image_url}")
        image_response = requests.get(image_url, timeout=10)  # 10 second timeout for image download
        if image_response.status_code != 200:
            logger.error(f"Failed to download image from Twilio: {image_response.status_code}")
            return None
        
        download_time = time.time() - start_time
        logger.info(f"Image download completed in {download_time:.2f} seconds")
        logger.info(f"Image content length: {len(image_response.content)} bytes")

        # Send the image to the measurement API
        api_url = "https://bae3-36-255-14-5.ngrok-free.app/predict"
        logger.info(f"Sending request to measurement API: {api_url}")
        
        # Prepare the file for upload
        files = {
            'image': ('image.jpg', image_response.content, 'image/jpeg')
        }
        
        logger.info("Making POST request to measurement API with file upload...")
        api_start_time = time.time()
        response = requests.post(
            api_url,
            files=files,
            timeout=50
        )
        api_time = time.time() - api_start_time
        logger.info(f"API request completed in {api_time:.2f} seconds")
        
        logger.info(f"API Response Status Code: {response.status_code}")
        logger.info(f"API Response Headers: {dict(response.headers)}")
        logger.info(f"API Response Content: {response.text[:500]}...")  # Log first 500 chars of response
        
        if response.status_code == 200:
            try:
                json_response = response.json()
                logger.info("Successfully parsed JSON response")
                total_time = time.time() - start_time
                logger.info(f"Total processing time: {total_time:.2f} seconds")
                return json_response
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse JSON response: {e}")
                logger.error(f"Raw response content: {response.text}")
                return None
                
        logger.error(f"Measurement API error: {response.status_code} - {response.text}")
        return None
    except requests.Timeout:
        logger.error("Request timed out while getting measurements")
        return "timeout"
    except requests.RequestException as e:
        logger.error(f"Request error: {str(e)}")
        return None
    except Exception as e:
        logger.error(f"Error getting measurements: {e}")
        return None

@app.route("/webhook", methods=["POST"])
def webhook():
    """Handle incoming WhatsApp messages"""
    try:
        start_time = time.time()
        logger.info("=== New Webhook Request ===")
        logger.info(f"Request Method: {request.method}")
        logger.info(f"Request Headers: {dict(request.headers)}")
        logger.info(f"Request Form Data: {request.form}")
        logger.info(f"Request Values: {request.values}")
        
        # Get the message the user sent
        incoming_msg = request.values.get("Body", "").strip().lower()
        sender = request.values.get("From", "")
        media_url = request.values.get("MediaUrl0", None)
        
        if not sender:
            logger.error("No sender found in request")
            return "Error: No sender", 400
            
        logger.info(f"Message from {sender}: {incoming_msg}")
        if media_url:
            logger.info(f"Received image URL: {media_url}")
        
        # Create a Twilio response
        resp = MessagingResponse()
        msg = resp.message()

        # Initialize or get user session
        if sender not in user_sessions:
            user_sessions[sender] = {
                "language": "en-IN",  # Default to English
                "state": "language_selection",
                "measurements": None
            }
            # Send language selection message
            language_msg = """Welcome to Sarvastra AI! Please select your preferred language:

1. English
2. हिंदी (Hindi)
3. বাংলা (Bengali)
4. ગુજરાતી (Gujarati)
5. ಕನ್ನಡ (Kannada)
6. മലയാളം (Malayalam)
7. मराठी (Marathi)
8. ଓଡ଼ିଆ (Odia)
9. ਪੰਜਾਬੀ (Punjabi)
10. தமிழ் (Tamil)
11. తెలుగు (Telugu)

Reply with the number of your preferred language."""
            msg.body(language_msg)
            logger.info("Sending language selection message")
            response_str = str(resp)
            logger.info(f"Response to be sent: {response_str}")
            total_time = time.time() - start_time
            logger.info(f"Total webhook processing time: {total_time:.2f} seconds")
            return response_str

        # Handle language selection
        if user_sessions[sender]["state"] == "language_selection":
            if incoming_msg in SUPPORTED_LANGUAGES:
                user_sessions[sender]["language"] = SUPPORTED_LANGUAGES[incoming_msg]
                user_sessions[sender]["state"] = "welcome"
                welcome_msg = """Welcome to Sarvastra AI! I can help you with:

1. Get body measurements
2. Get size recommendations

Please select an option by sending its number."""
                translated_welcome = translate_text(welcome_msg, user_sessions[sender]["language"])
                msg.body(translated_welcome)
                logger.info(f"Language selected: {user_sessions[sender]['language']}")
            else:
                msg.body("Please select a valid language by sending a number from 1 to 11.")
                logger.info("Invalid language selection")
            response_str = str(resp)
            logger.info(f"Response to be sent: {response_str}")
            total_time = time.time() - start_time
            logger.info(f"Total webhook processing time: {total_time:.2f} seconds")
            return response_str

        # Handle different states and commands
        if user_sessions[sender]["state"] == "welcome":
            if incoming_msg == "1":
                user_sessions[sender]["state"] = "waiting_for_image"
                response_text = """Please send a full-body photo of yourself standing straight.
Make sure:
1. You're standing against a plain wall
2. Your full body is visible
3. You're wearing fitted clothes
4. The lighting is good

Send the photo and I'll analyze your measurements."""
                translated_text = translate_text(response_text, user_sessions[sender]["language"])
                msg.body(translated_text)
                logger.info(f"Sent measurement instructions to {sender}")
            elif incoming_msg == "2":
                if user_sessions[sender]["measurements"]:
                    sizes = calculateSize(user_sessions[sender]["measurements"])
                    response = f"""Based on your measurements, we recommend:

Shirt Size: {sizes['shirtSize']}
Pants Size: {sizes['pantsSize']}
Shoe Size: {sizes['shoeSize']}

Would you like to:
1. Get brand-specific recommendations
2. Take new measurements

Please select an option by sending its number."""
                    translated_response = translate_text(response, user_sessions[sender]["language"])
                    msg.body(translated_response)
                    logger.info(f"Sent recommendations to {sender}")
                else:
                    response = """You need to get your measurements first.

1. Get body measurements
2. Get size recommendations

Please select an option by sending its number."""
                    translated_response = translate_text(response, user_sessions[sender]["language"])
                    msg.body(translated_response)
                    logger.info(f"Sent measurement request to {sender}")
            else:
                welcome_msg = """Welcome to Sarvastra AI! I can help you with:

1. Get body measurements
2. Get size recommendations

Please select an option by sending its number."""
                translated_welcome = translate_text(welcome_msg, user_sessions[sender]["language"])
                msg.body(translated_welcome)
                logger.info(f"Sent welcome message to {sender}")
            
        elif user_sessions[sender]["state"] == "waiting_for_image" and media_url:
            # User has sent an image, process it
            logger.info("Processing image for measurements...")
            processing_msg = """Processing your image... This may take up to 50 seconds.
Please wait while I analyze your measurements."""
            msg.body(translate_text(processing_msg, user_sessions[sender]["language"]))
            logger.info("Sent processing message")
            
            # Get measurements from API
            measurements = get_measurements_from_api(media_url)
            logger.info(f"Received measurements from API: {measurements}")
            
            if measurements == "timeout":
                error_msg = """The measurement process is taking longer than expected.
Please try again with a new photo.

Would you like to:
1. Try again with a new photo
2. Go back to main menu

Please select an option by sending its number."""
                msg.body(translate_text(error_msg, user_sessions[sender]["language"]))
                user_sessions[sender]["state"] = "welcome"
                logger.error(f"Measurement timeout for {sender}")
                response_str = str(resp)
                logger.info(f"Response to be sent: {response_str}")
                total_time = time.time() - start_time
                logger.info(f"Total webhook processing time: {total_time:.2f} seconds")
                return response_str
            
            if measurements:
                user_sessions[sender]["measurements"] = measurements
                sizes = calculateSize(measurements)
                
                # Format measurements response
                response = f"""Your measurements:
Height: {measurements['height']} cm
Chest: {measurements['chest']} cm
Waist: {measurements['waist']} cm
Hips: {measurements['hips']} cm
Shoulder Width: {measurements['shoulder width']} cm
Arm Length: {measurements['arm_length']} cm
Neck: {measurements['neck']} cm
Thigh: {measurements['thigh']} cm

Recommended sizes:
Shirt: {sizes['shirtSize']}
Pants: {sizes['pantsSize']}
Shoes: {sizes['shoeSize']}

Would you like to:
1. Get brand-specific recommendations
2. Take new measurements

Please select an option by sending its number."""
                
                translated_response = translate_text(response, user_sessions[sender]["language"])
                msg.body(translated_response)
                user_sessions[sender]["state"] = "welcome"
                logger.info(f"Sent measurements to {sender}")
            else:
                error_msg = """Sorry, I couldn't process your image. Please make sure:
1. The image is clear
2. Your full body is visible
3. You're standing straight
4. The lighting is good

Would you like to:
1. Try again with a new photo
2. Go back to main menu

Please select an option by sending its number."""
                msg.body(translate_text(error_msg, user_sessions[sender]["language"]))
                user_sessions[sender]["state"] = "welcome"
                logger.error(f"Failed to get measurements for {sender}")

        response_str = str(resp)
        logger.info(f"Response to be sent: {response_str}")
        total_time = time.time() - start_time
        logger.info(f"Total webhook processing time: {total_time:.2f} seconds")
        return response_str
        
    except Exception as e:
        logger.error(f"Error processing webhook: {str(e)}", exc_info=True)
        try:
            error_resp = MessagingResponse()
            error_resp.message("Sorry, there was an error processing your request. Please try again.")
            response_str = str(error_resp)
            logger.info(f"Error response to be sent: {response_str}")
            return response_str
        except Exception as e2:
            logger.error(f"Error creating error response: {str(e2)}", exc_info=True)
            return "Error processing request", 500

if __name__ == "__main__":
    # Verify environment variables
    required_vars = ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_PHONE_NUMBER", "SARVAM_API_KEY"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    if missing_vars:
        logger.error(f"Missing required environment variables: {', '.join(missing_vars)}")
        exit(1)
    
    logger.info("Starting bot server...")
    app.run(debug=True)
