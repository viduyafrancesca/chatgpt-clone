from flask import Flask, request, jsonify, render_template
from flask_cors import CORS  # Import CORS
import requests
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)  # Apply CORS to the entire app

# Load openAI key from .env file
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    messages = []
    user_message = request.json.get('message')
    messages.append({'role': 'user', 'content': user_message})


    headers = {
        'Authorization': f'Bearer {OPENAI_API_KEY}',
        'Content-Type': 'application/json'
    }

    data = {
        'model': 'gpt-4o-mini',  # or whatever model you're using
        'messages': messages,
        'temperature': 0.7,  # Value = 0-1, lower = more deterministic, higher = more random
        'frequency_penalty': 0,  # Adjust frequency penalty (frequency of words used)
        'presence_penalty': 0,  # Adjust presence penalty (frequency of topics opened)
    }

    # Make a request to the OpenAI API
    response = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=data)

    if response.status_code == 200:
        reply = response.json()['choices'][0]['message']['content']
        return jsonify({'reply': reply})
    else:
        return jsonify({'reply': 'Error communicating with OpenAI API.'}), 500


if __name__ == '__main__':
    app.run(port=8000,debug=True)