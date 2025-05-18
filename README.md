
# NMIT HACKS-2025 - AIML - TEAM SARVASVA

![NMIT Hacks Logo](https://nmithacks.com/assets/nh_landing_svg-B_uFqCIp.webp)

# Sarvastra AI: An AI-Powered Body Measurement & Virtual Try-On Platform

## Overview

Sarvastra AI is an innovative platform that leverages advanced machine learning, computer vision, and AR technologies to deliver fast, accurate body measurements and virtual try-on experiences. The system is designed for seamless integration across web and Telegram, making it accessible and user-friendly.

## 🎥 Demo

<div align="center">
  <h3>📱 Web Interface Demo</h3>
  <a href="https://youtu.be/E2trJlwhTy8">
    <img src="https://private-user-images.githubusercontent.com/128846566/444849121-a9073404-f868-49f2-9a2c-790c7cb6011d.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDc1NDI0NTMsIm5iZiI6MTc0NzU0MjE1MywicGF0aCI6Ii8xMjg4NDY1NjYvNDQ0ODQ5MTIxLWE5MDczNDA0LWY4NjgtNDlmMi05YTJjLTc5MGM3Y2I2MDExZC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwNTE4JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDUxOFQwNDIyMzNaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT04NGMyODA4M2JjOWYzNTY2Y2M1NWQ3NzBmNDI2ZjRkNGRlYmViYWFmYTljNTRjNTc5ZDBhNWFmMGUzNWZhMzQ1JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.OYuJTpjFXkw0wVZOx3jGD-AppYYyuy8w9dJQzlG5gXs" alt="Web Interface Demo" width="560" height="315">
  </a>
  
  <h3>🤖 Telegram Bot Demo</h3>
  <a href="https://youtu.be/muZa_tBumNU">
    <img src="https://private-user-images.githubusercontent.com/128846566/444849175-78a71ace-ffaa-4cf4-8526-587c1de3edc0.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDc1NDI1NDEsIm5iZiI6MTc0NzU0MjI0MSwicGF0aCI6Ii8xMjg4NDY1NjYvNDQ0ODQ5MTc1LTc4YTcxYWNlLWZmYWEtNGNmNC04NTI2LTU4N2MxZGUzZWRjMC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwNTE4JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDUxOFQwNDI0MDFaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1mYjA4YzJkMWExMzIxMjlkZGY3YmNhZDExZGY3MDhlODMzZThkOWM5YTM2MjY3ZGI4ZTUyNjJmOTc4OWNkNTk3JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.LyG4kazBgprF-wnIEAvs1HtQAiQzsWKRq08nI4jKxTE" alt="Telegram Bot Demo" width="560" height="315">
  </a>
</div>

## ✨ Key Features

### 1. AI Body Measurement
- *Custom ML Model*: Utilizes a lightweight, fast custom model for body measurement
- *Pose Estimation*: Employs OpenPose for key point detection (18-25 body, 70 face, 21 hands, 6 foot keypoints)
- *Single-Pose Input*: Requires only one full-body image for accurate measurement
- *Precise Measurements*: Delivers accurate measurements for:
  - Height
  - Chest
  - Waist
  - Hips
  - Shoulder width
  - Arm length
  - Neck
  - Thigh

### 2. Multi-Language Telegram Bot
- *11 Indian Languages Support*: Hindi, Bengali, Gujarati, Kannada, Malayalam, Marathi, Odia, Punjabi, Tamil, and Telugu
- *Smart Size Recommendations*: Calculates recommended sizes for shirts, pants, and shoes based on Indian sizing standards
- *AI-Powered Clothing Recommendations*:
  - Gender-specific clothing options
  - Personalized recommendations using Google's Gemini AI
  - Direct shopping links to Myntra
  - Special curated recommendations for men's T-shirts

### 3. AR Virtual Try-On
- *Universal Clothing Support*: Supports all kinds of upper wear clothes for both men and women
- *Accurate Cloth Extraction*: Advanced deep learning models for precise cloth extraction and fitting
- *Simple Interface*: Elegant and easy-to-use web application
- *Fast Processing*: Delivers quick, realistic try-on results
- *Result Caching*: Improved performance through caching
- *Responsive Design*: Modern and user-friendly interface

## 🔧 How It Works

### Virtual Try-On Process

#### 1. Input Processing
- *User Image*: Single front-facing image of the user
- *Clothing Images*: Front and back views of the clothing item
- *Image Preprocessing*: Standardization and normalization of input images

#### 2. Pose Estimation
- *OpenPose Integration*: Extracts 25 key body points
- *Keypoint Detection*: Identifies critical body landmarks for clothing alignment
- *Pose Analysis*: Determines optimal clothing placement based on body position

#### 3. Feature Extraction
- *CLIP Model*: Extracts semantic features from both user and clothing images
- *Transformer Blocks*: Processes spatial relationships between features
- *Soft-Selection Mechanism*: Intelligently selects the appropriate clothing view (front/back)
- *Feature Fusion*: Combines user appearance with clothing characteristics

#### 4. Image Synthesis
- *U-Net Architecture*: Deep learning model for image generation
- *Multi-Stage Processing*:
  1. User pose features integration
  2. Clothing feature alignment
  3. Appearance preservation
- *AR Integration*: Generated image used for augmented reality visualization

### Measurement Process
1. *Cloth Extraction*: Uses a custom DeepLab model to extract clothing from source images
2. *Pose Estimation*: Employs pretrained OpenPose body_25 model to locate shoulder points
3. *Smart Blending*: Intelligently blends extracted clothing into profile images based on shoulder location
4. *Real-time Preview*: Instantly shows how the clothing would look on the user

## 🏗 Technical Architecture

### Repository Structure
- *backend/*: Node.js/Express server for API, authentication, image upload, and business logic
- *frontend/*: Modern web frontend (Vite + React.js, Tailwind CSS) for user interaction
- *Telegram Bot/*: Python-based Telegram bot for chat-based measurement
- *ML Model*: Custom model running locally on localhost:5001 for pose estimation

### Technologies Used
- *Backend*: Node.js, Express, Multer
- *Frontend*: Vite, Tailwind CSS, React.js
- *ML Model*: 
  - Custom DeepLab model for cloth segmentation
  - OpenPose body_25 model for pose estimation
- *Telegram Bot*: Python, python-telegram-bot
- *AR Try-On*: Custom AR model for image generation
- *APIs*: SarvamAI, Google Gemini, Measurement API

## 📊 Dataset
- *DeepFashion2 Dataset*: Used for training the cloth segmentation model

## 🚀 Getting Started

### Prerequisites
- Node.js, Python 3.8+
- Conda (recommended for environment management)
- Required API Keys:
  - Telegram Bot Token
  - SarvamAI API Key
  - Google Gemini API Key

### Installation

1. *Clone the Repository* <br>
  `git clone https://github.com/Vaibhavghugretkar/body_metrics.git` <br>
  `cd body-metrics`


3. *Backend Setup* <br>
  `cd backend` <br>
  `npm install` <br>
  `npm run dev`


4. *Frontend Setup* <br>
  `cd frontend` <br>
  `npm install` <br>
  `npm run dev`


5. *Telegram Bot Setup* <br>
  `cd "Telegram Bot"` <br>
  `pip install -r requirements.txt` <br>
  `python bot.py` <br>


6. *Environment Variables* <br>
  Create a .env file with: <br>
  `SARVAM_API_KEY=your_sarvam_api_key` <br>
  `TELEGRAM_BOT_TOKEN=your_telegram_bot_token` <br>
  `GEMINI_API_KEY=your_gemini_api_key`


## 🔌 API Endpoints

### Web Application
- / - Home page
- /dashboard - User / Business dashboard
- /dashboard/capture - Source image upload
- /tryon - Try-on interface
- /dashboard/history - Measurements history

### Telegram Bot Commands
- /start - Initialize bot and select language
- Send full-body photo for measurements
- Select clothing type for recommendations

## 🔒 Security Features
- Secure filename handling
- Session-based user state management
- Restricted file access
- Input validation
- Error handling
- Robust API error handling with fallbacks

## 📚 References
- DeepLab: https://github.com/tensorflow/models/tree/master/research/deeplab
- DeepFashion2 Dataset: https://github.com/switchablenorms/DeepFashion2
- OpenPose: https://github.com/CMU-Perceptual-Computing-Lab/openpose

## 👥 Contributors

<div align="center">
  <table>
    <tr>
      <td align="center">
        <a href="https://github.com/yashdivya5">
          <img src="https://github.com/yashdivya5.png" width="100px;" alt="Yash Divya"/>
          <br />
          <sub><b>Yash Divya</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/bhaskar-nie/">
          <img src="https://github.com/bhaskar-nie.png" width="100px;" alt="Bhaskar Anand"/>
          <br />
          <sub><b>Bhaskar Anand</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/rahulks01">
          <img src="https://github.com/rahulks01.png" width="100px;" alt="Rahul Kumar Singh"/>
          <br />
          <sub><b>Rahul Kumar Singh</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/Vaibhavghugretkar">
          <img src="https://github.com/Vaibhavghugretkar.png" width="100px;" alt="Vaibhav Ghugretkar"/>
          <br />
          <sub><b>Vaibhav Ghugretkar</b></sub>
        </a>
      </td>
    </tr>
  </table>
</div>
