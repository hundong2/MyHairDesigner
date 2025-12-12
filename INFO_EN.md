# My Hair Designer (Your Personal AI Hair Stylist) 💇‍♀️✨

**My Hair Designer** is a next-generation beauty application utilizing the latest Google Gemini AI technology to analyze your face shape, recommend the best-suiting hairstyles, and simulate how they look on you in real-life quality.

Far beyond simple overlays, it uses generative AI to provide studio-quality styling images. It connects you with an interactive AI stylist for fine-tuning and even helps you book appointments at local salons.

---

## 🌟 Key Features

### 1. AI Face Analysis & Personalized Recommendations
*   **Gemini Vision Multimodal** technology precisely analyzes the face shape (Oval, Round, Square, etc.) from your uploaded selfie.
*   Based on the analysis, it automatically identifies **'Best Match'** styles from our trending hairstyle database and highlights them visually.
*   **Gender Selection (Male/Female)** allows users to explore 10 specific trending styles curated for each gender.

### 2. High-Fidelity Virtual Try-On
*   Generates photorealistic images of you with the selected hairstyle using the **Gemini Imagen** model.
*   Advanced in-painting technology maintains your original facial features and expressions while seamlessly changing only the hair.
*   **Before / After Comparison**: Press and hold the button to instantly compare your original photo with the new look to see the transformation clearly.

### 3. Interactive AI Chat Consultant
*   Chat directly with an AI stylist on the result screen.
*   **Function Calling**: If you ask "Make it shorter", "Dye it blonde", or "Add bangs", the AI understands your intent and calls the **'modify_hairstyle'** tool to update the image immediately.
*   Get professional advice on styling tips, hair care maintenance, and product recommendations.

### 4. Smart Guide & Style Card (UX & Sharing)
*   **Smart Guide**: Provides context-aware tips and guidance at every step (Analysis -> Selection -> Generation).
*   **Style Card**: Generates a sleek, shareable card containing your new look, face shape analysis, and match score to share with friends.

### 5. Location-Based Salon Finder (via Grounding)
*   Uses **Google Maps Grounding** technology to find top-rated salons nearby based on your current location (Geolocation).
*   It doesn't just list them; it provides a summary of the top 3 salons sorted by rating, including names, addresses, and specific reasons why they are good for your chosen style.
*   View Google Maps directly within the app.

---

## 🛠 Tech Stack

Built with modern web technologies and the Google Generative AI ecosystem.

*   **Frontend**: React 19, TypeScript, Tailwind CSS
*   **AI Model**:
    *   `gemini-2.5-flash`: Fast response for face analysis, chat, and salon search (Grounding).
    *   `gemini-2.5-flash-image`: High-quality hairstyle image generation and modification.
*   **Key AI Features**:
    *   **Multimodal Vision**: Combining image input with text prompts for analysis.
    *   **Function Calling**: Converting natural language commands into code to control image modification.
    *   **Google Search/Maps Grounding**: Providing real-time salon data based on location.
*   **Markdown Rendering**: Using `react-markdown` to display AI analysis results beautifully.

---

## 📱 User Flow

1.  **Upload Photo**: Upload a selfie on the main screen.
2.  **Auto Analysis**: AI analyzes your face shape and informs you of the results.
3.  **Select Style**: Choose a recommended style (green border) or any other style you like.
4.  **AI Generation**: Click 'Generate Look' to apply the style.
5.  **View & Modify**: Check your new look. Use the AI chat to request changes (color, cut, etc.) or ask for advice.
6.  **Find Salon**: Find nearby salons that can create this look for you.
7.  **Share**: Generate a Style Card and share it on social media.
