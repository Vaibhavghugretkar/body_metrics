# Sarvastra AI - Smart Clothing Recommendation Bot

A Telegram bot that provides personalized clothing recommendations based on body measurements using AI and computer vision.

## Features

1. **Multi-language Support**
   - Supports 11 Indian languages including Hindi, Bengali, Gujarati, Kannada, Malayalam, Marathi, Odia, Punjabi, Tamil, and Telugu
   - Automatic translation of all bot responses

2. **Body Measurements**
   - Uses computer vision to analyze full-body photos
   - Provides accurate measurements for:
     - Height
     - Chest
     - Waist
     - Hips
     - Shoulder width
     - Arm length
     - Neck
     - Thigh

3. **Smart Size Recommendations**
   - Calculates recommended sizes for:
     - Shirts
     - Pants
     - Shoes
   - Based on Indian sizing standards

4. **AI-Powered Clothing Recommendations**
   - Gender-specific clothing options
   - Personalized recommendations using Google's Gemini AI
   - Direct shopping links

## Demo

Watch our demo video to see the bot in action:

[![Sarvastra AI Demo](https://img.youtube.com/vi/muZa_tBumNU/0.jpg)](https://youtu.be/muZa_tBumNU)

The demo showcases:
- Multi-language interaction
- Body measurement process
- Size recommendations
- AI-powered clothing suggestions
- 
## Technical Requirements

- Python 3.8+
- Telegram Bot Token
- SarvamAI API Key
- Google Gemini API Key
- Local Measurement API (running on port 5000)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd [repository-name]
```

2. Install required packages:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
Create a `.env` file with the following:
```
SARVAM_API_KEY=your_sarvam_api_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
GEMINI_API_KEY=your_gemini_api_key
```

## Usage

1. Start the local measurement API:
```bash
python measurement_api.py
```

2. Run the Telegram bot:
```bash
python telegram_bot.py
```

3. Open Telegram and start chatting with your bot using the `/start` command

## Bot Flow

1. **Initial Setup**
   - User starts bot with `/start`
   - Selects preferred language
   - Views main menu

2. **Getting Measurements**
   - User sends full-body photo
   - Bot processes image and returns measurements
   - Shows recommended sizes

3. **Clothing Recommendations**
   - User selects gender
   - Chooses clothing type
   - Receives personalized recommendations with shopping links

4. **Special Features**
   - Men's T-shirts: Curated Puma collection
   - Other clothing: AI-generated recommendations
   - Option to get recommendations for different clothing types

## API Integration

- **SarvamAI**: Handles translations and language processing
- **Google Gemini**: Generates personalized clothing recommendations
- **Measurement API**: Processes body measurements from photos
- **Myntra**: Provides shopping links for recommended items

## Error Handling

- Robust error handling for API failures
- Fallback recommendations when AI services are unavailable
- Clear error messages in user's preferred language
- Automatic retries for failed API calls

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request


## Contact
Email: official.beingbhaskar@gmail.com
