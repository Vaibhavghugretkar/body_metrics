from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, CallbackQueryHandler, ContextTypes, filters
import os
import requests
import json
import logging
import time
from sarvamai import SarvamAI
import google.generativeai as genai
from io import BytesIO

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# API Keys and Endpoints
SARVAM_API_KEY = "sk_o1kqn933_eKbVTUg0gwhvvwJyNV4LFUim"
TELEGRAM_BOT_TOKEN = "7508822154:AAGXFUJ3ncnsGCV6uXFde1eickqprYDFrtc"
MEASUREMENT_API_URL = "http://localhost:5000/predict/"
GEMINI_API_KEY = "AIzaSyBdLCUzTyxuMUEG_2vVLiGg87VNSgy-cCI"

# Initialize API clients
sarvam_client = SarvamAI(api_subscription_key=SARVAM_API_KEY)

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel('gemini-pro')

# Store user sessions
user_sessions = {}

# Supported languages
SUPPORTED_LANGUAGES = {
    "en": "en-IN",  # English
    "hi": "hi-IN",  # Hindi
    "bn": "bn-IN",  # Bengali
    "gu": "gu-IN",  # Gujarati
    "kn": "kn-IN",  # Kannada
    "ml": "ml-IN",  # Malayalam
    "mr": "mr-IN",  # Marathi
    "od": "od-IN",  # Odia
    "pa": "pa-IN",  # Punjabi
    "ta": "ta-IN",  # Tamil
    "te": "te-IN"   # Telugu
}

# Define gender options
GENDER_OPTIONS = {
    "1": "Male",
    "2": "Female"
}

# Define clothing types for each gender
CLOTHING_TYPES = {
    "male": {
        "1": "Shirt",
        "2": "T-Shirt",
        "3": "Trousers"
    },
    "female": {
        "1": "Top",
        "2": "Saree",
        "3": "Dress"
    }
}

# Define user flow states
FLOWS = {
    "MAIN_MENU": "main_menu",
    "GETTING_MEASUREMENTS": "getting_measurements",
    "GETTING_GENDER": "getting_gender",
    "SELECTING_CLOTHING": "selecting_clothing"
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

def get_measurements_from_api(image_file):
    """Get measurements from the measurement API"""
    try:
        start_time = time.time()
        logger.info("Processing image for measurements...")
        
        # Send the image to the measurement API
        logger.info(f"Sending request to measurement API: {MEASUREMENT_API_URL}")
        
        # Create a BytesIO object from the image bytes
        image_io = BytesIO(image_file)
        
        # Prepare the file for upload - using 'image' as the key name
        files = {
            'image': ('image.jpg', image_io, 'image/jpeg')
        }
        
        logger.info("Making POST request to measurement API with file upload...")
        api_start_time = time.time()
        
        # Make the request
        response = requests.post(
            MEASUREMENT_API_URL,
            files=files,
            timeout=50  # 50 second timeout as per your Flask server
        )
        
        api_time = time.time() - api_start_time
        logger.info(f"API request completed in {api_time:.2f} seconds")
        
        logger.info(f"API Response Status Code: {response.status_code}")
        logger.info(f"API Response Headers: {dict(response.headers)}")
        logger.info(f"API Response Content: {response.text[:500]}...")
        
        if response.status_code == 200:
            try:
                json_response = response.json()
                logger.info("Successfully parsed JSON response")
                total_time = time.time() - start_time
                logger.info(f"Total processing time: {total_time:.2f} seconds")
                
                # Convert the response to match the expected format
                measurements = {
                    'height': float(json_response.get('height', '0').replace(' cm', '')),
                    'chest': float(json_response.get('chest', '0').replace(' cm', '')),
                    'waist': float(json_response.get('waist', '0').replace(' cm', '')),
                    'hips': float(json_response.get('hips', '0').replace(' cm', '')),
                    'shoulder width': float(json_response.get('shoulder width', '0').replace(' cm', '')),
                    'arm_length': float(json_response.get('arm length', '0').replace(' cm', '')),
                    'neck': float(json_response.get('neck', '0').replace(' cm', '')),
                    'thigh': float(json_response.get('thigh', '0').replace(' cm', ''))
                }
                return measurements
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

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Send a message when the command /start is issued."""
    user_id = update.effective_user.id
    user_sessions[user_id] = {
        "language": "en-IN",
        "flow": FLOWS["MAIN_MENU"],
        "measurements": None,
        "gender": None,
        "clothing_type": None
    }
    
    # Create language selection keyboard
    keyboard = [
        [InlineKeyboardButton("English", callback_data="lang_en")],
        [InlineKeyboardButton("हिंदी (Hindi)", callback_data="lang_hi")],
        [InlineKeyboardButton("বাংলা (Bengali)", callback_data="lang_bn")],
        [InlineKeyboardButton("ગુજરાતી (Gujarati)", callback_data="lang_gu")],
        [InlineKeyboardButton("ಕನ್ನಡ (Kannada)", callback_data="lang_kn")],
        [InlineKeyboardButton("മലയാളം (Malayalam)", callback_data="lang_ml")],
        [InlineKeyboardButton("मराठी (Marathi)", callback_data="lang_mr")],
        [InlineKeyboardButton("ଓଡ଼ିଆ (Odia)", callback_data="lang_od")],
        [InlineKeyboardButton("ਪੰਜਾਬੀ (Punjabi)", callback_data="lang_pa")],
        [InlineKeyboardButton("தமிழ் (Tamil)", callback_data="lang_ta")],
        [InlineKeyboardButton("తెలుగు (Telugu)", callback_data="lang_te")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "Welcome to Sarvastra AI! Please select your preferred language:",
        reply_markup=reply_markup
    )

async def language_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle language selection."""
    query = update.callback_query
    await query.answer()
    
    user_id = query.from_user.id
    language_code = query.data.split('_')[1]
    
    if language_code in SUPPORTED_LANGUAGES:
        user_sessions[user_id]["language"] = SUPPORTED_LANGUAGES[language_code]
        user_sessions[user_id]["flow"] = FLOWS["MAIN_MENU"]
        
        # Send main menu after language selection
        await send_welcome_menu(query.message, user_sessions[user_id]["language"])

async def get_gemini_recommendations(measurements, gender, clothing_type):
    """Get shopping recommendations from Gemini"""
    try:
        # Create a simpler prompt with essential measurements and reduce complexity
        prompt = f"""You are a fashion advisor for an Indian shopping assistant.
        
For a {gender} with these measurements:
- Height: {measurements['height']} cm
- Chest: {measurements['chest']} cm
- Waist: {measurements['waist']} cm
- Hips: {measurements['hips']} cm

Please recommend 3 specific {clothing_type} options from popular Indian shopping websites (Amazon India, Myntra, or Flipkart).

For each recommendation, include:
1. Product name
2. Brief description (1-2 sentences)
3. Why it would fit their body type well
4. A fictional link (e.g., www.myntra.com/product123)

Format as:
1. [Product Name] - [Website]
   [Brief Description]
   [Link]

2. [Product Name] - [Website]
   [Brief Description]
   [Link]

3. [Product Name] - [Website]
   [Brief Description]
   [Link]"""

        # Add timeout and retry logic
        max_retries = 3
        retry_count = 0
        
        while retry_count < max_retries:
            try:
                # Set generation parameters to be more reliable
                response = gemini_model.generate_content(
                    prompt,
                    generation_config={
                        "temperature": 0.7,
                        "top_p": 0.8,
                        "top_k": 40,
                        "max_output_tokens": 1024,
                    },
                    timeout=30  # 30 second timeout
                )
                
                # Check if we got a valid response
                if response and hasattr(response, 'text') and response.text:
                    return response.text
                else:
                    logger.warning(f"Empty response from Gemini on attempt {retry_count + 1}")
                    retry_count += 1
                    time.sleep(1)  # Wait 1 second before retrying
            except Exception as inner_e:
                logger.error(f"Error on attempt {retry_count + 1}: {inner_e}")
                retry_count += 1
                time.sleep(1)  # Wait 1 second before retrying
        
        # If we've exhausted retries, return fallback recommendations
        return get_fallback_recommendations(gender, clothing_type)
    except Exception as e:
        logger.error(f"Error getting Gemini recommendations: {e}")
        return get_fallback_recommendations(gender, clothing_type)

def get_fallback_recommendations(gender, clothing_type):
    """Provide fallback recommendations when Gemini API fails"""
    # Predefined recommendations for different gender and clothing type combinations
    recommendations = {
        "male": {
            "Shirt": """1. Classic Oxford Shirt - Myntra
   A timeless blue Oxford cotton shirt with a regular fit, perfect for formal and casual occasions.
   www.myntra.com/shirts/classic-oxford

2. Slim Fit Check Shirt - Amazon India
   Modern slim-fit shirt with subtle check pattern that complements various body types.
   www.amazon.in/slim-fit-check-shirt

3. Pure Cotton Casual Shirt - Flipkart
   Breathable 100% cotton casual shirt ideal for daily wear with comfortable fit.
   www.flipkart.com/cotton-casual-shirt""",
            
            "T-Shirt": """1. Essential Crew Neck T-Shirt - Myntra
   Soft cotton t-shirt with medium fit that works well for various body types.
   www.myntra.com/essential-crew-tshirt

2. Athleisure Sports T-Shirt - Amazon India
   Moisture-wicking fabric perfect for active wear with stretchy comfortable fit.
   www.amazon.in/athleisure-tshirt

3. Henley Neck Cotton T-Shirt - Flipkart
   Stylish Henley neck design with comfortable fabric in a versatile color.
   www.flipkart.com/henley-cotton-tshirt""",
            
            "Trousers": """1. Slim Fit Chinos - Myntra
   Classic khaki chinos with comfortable waistband and tapered leg for a modern look.
   www.myntra.com/slim-fit-chinos

2. Formal Wool Blend Trousers - Amazon India
   Professional-looking trousers with perfect drape and comfortable fit.
   www.amazon.in/formal-wool-trousers

3. Casual Cotton Trousers - Flipkart
   Weekend-ready cotton trousers with slightly relaxed fit in versatile navy blue.
   www.flipkart.com/casual-cotton-trousers"""
        },
        "female": {
            "Top": """1. Floral Print Blouse - Myntra
   Lightweight blouse with floral pattern and flattering V-neck design.
   www.myntra.com/floral-print-blouse

2. Essential Cotton Top - Amazon India
   Versatile cotton top with comfortable fit and timeless design for everyday wear.
   www.amazon.in/essential-cotton-top

3. Embroidered Casual Top - Flipkart
   Beautiful embroidered detailing on a comfortable regular fit casual top.
   www.flipkart.com/embroidered-casual-top""",
            
            "Saree": """1. Traditional Silk Saree - Myntra
   Elegant silk saree with intricate zari work in a vibrant color palette.
   www.myntra.com/traditional-silk-saree

2. Cotton Handloom Saree - Amazon India
   Breathable handloom cotton saree perfect for daily wear with simple border design.
   www.amazon.in/cotton-handloom-saree

3. Designer Georgette Saree - Flipkart
   Lightweight georgette saree with modern prints, suitable for parties and special occasions.
   www.flipkart.com/designer-georgette-saree""",
            
            "Dress": """1. A-Line Midi Dress - Myntra
   Flattering A-line silhouette that cinches at the waist for a feminine look.
   www.myntra.com/a-line-midi-dress

2. Wrap Dress with Belt - Amazon India
   Adjustable wrap style that fits various body types with elegant drape.
   www.amazon.in/wrap-dress-belt

3. Floral Maxi Dress - Flipkart
   Comfortable full-length dress with floral pattern and flowy material.
   www.flipkart.com/floral-maxi-dress"""
        }
    }
    
    try:
        return recommendations[gender.lower()][clothing_type]
    except KeyError:
        # If the specific combination doesn't exist, return a generic message
        return """Sorry, I couldn't generate personalized recommendations at this time. Here are some general options:

1. [Product Name] - Myntra
   A high-quality item that would suit your measurements.
   www.myntra.com/product

2. [Product Name] - Amazon India
   Comfortable fit with good reviews from customers with similar body types.
   www.amazon.in/product

3. [Product Name] - Flipkart
   Stylish option with versatile design for various occasions.
   www.flipkart.com/product"""

# Helper functions for sending messages
async def send_photo_instructions(message, language: str):
    """Send photo instructions to user"""
    response_text = """Please send a full-body photo of yourself standing straight.
Make sure:
1. You're standing against a plain wall
2. Your full body is visible
3. You're wearing fitted clothes
4. The lighting is good

Send the photo and I'll analyze your measurements."""
    translated_text = translate_text(response_text, language)
    await message.reply_text(translated_text)

async def send_welcome_menu(message, language: str):
    """Send welcome menu to user"""
    welcome_msg = """Welcome to Sarvastra AI! I can help you with:

1. Get body measurements
2. Get size recommendations

Please select an option by sending its number."""
    translated_welcome = translate_text(welcome_msg, language)
    
    # Check if the message is a callback query result
    if hasattr(message, "edit_message_text"):
        await message.edit_message_text(translated_welcome)
    else:
        await message.reply_text(translated_welcome)

async def send_gender_selection(message, language: str):
    """Send gender selection options to user"""
    gender_msg = """Please select your gender:
1. Male
2. Female"""
    translated_gender = translate_text(gender_msg, language)
    await message.reply_text(translated_gender)

async def send_clothing_options(message, language: str, gender: str):
    """Send clothing type options based on gender"""
    clothing_options = CLOTHING_TYPES[gender.lower()]
    clothing_msg = f"""Please select the type of clothing you're interested in:
1. {clothing_options['1']}
2. {clothing_options['2']}
3. {clothing_options['3']}"""
    translated_clothing = translate_text(clothing_msg, language)
    await message.reply_text(translated_clothing)

async def handle_photo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle incoming photos."""
    user_id = update.effective_user.id
    
    # Create session if it doesn't exist
    if user_id not in user_sessions:
        user_sessions[user_id] = {
            "language": "en-IN",
            "flow": FLOWS["GETTING_MEASUREMENTS"],
            "measurements": None,
            "gender": None,
            "clothing_type": None
        }
    else:
        # Update flow state
        user_sessions[user_id]["flow"] = FLOWS["GETTING_MEASUREMENTS"]
    
    # Get the photo file
    photo = update.message.photo[-1]  # Get the largest photo
    file = await context.bot.get_file(photo.file_id)
    
    # Download the photo
    photo_bytes = await file.download_as_bytearray()
    
    # Send processing message
    processing_msg = """Processing your image... This may take up to 50 seconds.
Please wait while I analyze your measurements."""
    translated_processing = translate_text(processing_msg, user_sessions[user_id]["language"])
    processing_message = await update.message.reply_text(translated_processing)
    
    try:
        # Get measurements from API
        measurements = get_measurements_from_api(photo_bytes)
        
        if measurements == "timeout":
            error_msg = """The measurement process is taking longer than expected.
Please try again with a new photo."""
            translated_error = translate_text(error_msg, user_sessions[user_id]["language"])
            await processing_message.edit_text(translated_error)
            return
        
        if measurements:
            # Store measurements in session
            user_sessions[user_id]["measurements"] = measurements
            sizes = calculateSize(measurements)
            
            # Prepare response with measurements and sizes
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

What would you like to do next?
1. Get clothing recommendations
2. Return to main menu"""
            
            translated_response = translate_text(response, user_sessions[user_id]["language"])
            await processing_message.edit_text(translated_response)
        else:
            # Handle error in measurement processing
            error_msg = """Sorry, I couldn't process your image. Please make sure:
1. The image is clear
2. Your full body is visible
3. You're standing straight
4. The lighting is good

Please try again with a new photo."""
            translated_error = translate_text(error_msg, user_sessions[user_id]["language"])
            await processing_message.edit_text(translated_error)
    except Exception as e:
        logger.error(f"Error processing photo: {e}")
        error_msg = """An error occurred while processing your image.
Please try again with a new photo."""
        translated_error = translate_text(error_msg, user_sessions[user_id]["language"])
        await processing_message.edit_text(translated_error)

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle incoming messages."""
    user_id = update.effective_user.id
    message_text = update.message.text.strip()
    
    # Initialize session if first message or "Hi"/"hi"
    if user_id not in user_sessions or message_text.lower() == "hi":
        await start(update, context)
        return
    
    # Get current flow and language from user session
    current_flow = user_sessions[user_id]["flow"]
    language = user_sessions[user_id]["language"]
    
    # After measurements are taken and user is choosing what to do next
    if user_sessions[user_id].get("measurements") and current_flow == FLOWS["GETTING_MEASUREMENTS"]:
        if message_text == "1":  # Get clothing recommendations
            user_sessions[user_id]["flow"] = FLOWS["GETTING_GENDER"]
            await send_gender_selection(update.message, language)
        elif message_text == "2":  # Return to main menu
            user_sessions[user_id]["flow"] = FLOWS["MAIN_MENU"]
            await send_welcome_menu(update.message, language)
        return
    
    # Handle main menu options
    if current_flow == FLOWS["MAIN_MENU"]:
        if message_text == "1":  # Get body measurements
            user_sessions[user_id]["flow"] = FLOWS["GETTING_MEASUREMENTS"]
            await send_photo_instructions(update.message, language)
        elif message_text == "2":  # Get size recommendations
            if user_sessions[user_id].get("measurements"):
                user_sessions[user_id]["flow"] = FLOWS["GETTING_GENDER"]
                await send_gender_selection(update.message, language)
            else:
                # If no measurements, ask for a photo first
                msg = "I need your measurements first. Please send a full-body photo."
                translated_msg = translate_text(msg, language)
                await update.message.reply_text(translated_msg)
                user_sessions[user_id]["flow"] = FLOWS["GETTING_MEASUREMENTS"]
                await send_photo_instructions(update.message, language)
        else:
            # Invalid option, resend menu
            await send_welcome_menu(update.message, language)
    
    # Handle gender selection
    elif current_flow == FLOWS["GETTING_GENDER"]:
        if message_text in GENDER_OPTIONS:
            user_sessions[user_id]["gender"] = GENDER_OPTIONS[message_text]
            user_sessions[user_id]["flow"] = FLOWS["SELECTING_CLOTHING"]
            await send_clothing_options(update.message, language, user_sessions[user_id]["gender"])
        else:
            # Invalid option, resend gender selection
            await send_gender_selection(update.message, language)
    
    # Handle clothing type selection
    elif current_flow == FLOWS["SELECTING_CLOTHING"]:
        gender = user_sessions[user_id]["gender"].lower()
        clothing_options = CLOTHING_TYPES[gender]
        
        if message_text in clothing_options:
            selected_clothing = clothing_options[message_text]
            user_sessions[user_id]["clothing_type"] = selected_clothing
            
            # Let user know we're generating recommendations
            processing_msg = f"Generating {selected_clothing} recommendations for you. This may take a moment..."
            translated_processing = translate_text(processing_msg, language)
            processing_message = await update.message.reply_text(translated_processing)
            
            try:
                # Get recommendations from Gemini with increased timeout
                recommendations = await get_gemini_recommendations(
                    user_sessions[user_id]["measurements"],
                    gender,
                    selected_clothing
                )
                
                # Split recommendations into chunks if they're too long
                if len(recommendations) > 3000:  # Telegram has ~4096 char limit
                    chunks = [recommendations[i:i+3000] for i in range(0, len(recommendations), 3000)]
                    for chunk in chunks:
                        translated_chunk = translate_text(chunk, language)
                        await update.message.reply_text(translated_chunk)
                else:
                    translated_recommendations = translate_text(recommendations, language)
                    await update.message.reply_text(translated_recommendations)
                
                # Delete processing message
                await processing_message.delete()
                
                # Ask if user wants to continue
                continuation_msg = """Would you like to:
1. Get recommendations for another clothing type
2. Return to main menu"""
                translated_continuation = translate_text(continuation_msg, language)
                await update.message.reply_text(translated_continuation)
                
                # Set flow to main menu for next steps
                user_sessions[user_id]["flow"] = FLOWS["MAIN_MENU"]
                
            except Exception as e:
                logger.error(f"Error handling recommendations: {e}")
                error_msg = "Sorry, I had trouble generating recommendations. Would you like to try another clothing type?"
                translated_error = translate_text(error_msg, language)
                await processing_message.edit_text(translated_error)
                
                # Keep in clothing selection flow
                user_sessions[user_id]["flow"] = FLOWS["SELECTING_CLOTHING"]
        else:
            # Invalid option, resend clothing options
            await send_clothing_options(update.message, language, gender)

def main():
    """Start the bot."""
    # Create the Application
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()

    # Add handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CallbackQueryHandler(language_callback, pattern="^lang_"))
    application.add_handler(MessageHandler(filters.PHOTO, handle_photo))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    # Start the Bot
    application.run_polling()

if __name__ == "__main__":
    main()