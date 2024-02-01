from flask import Flask, request, jsonify, render_template
import random

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process_command', methods=['POST'])
def process_command():
    data = request.get_json()
    user_message = data.get('command')
    response = generate_chat_response(user_message)
    return jsonify({'response': response})

def generate_chat_response(user_message):
    greetings =['Hey there!', 'Hello!', 'Hi friend!', 'Hey! What\'s up?']
    farewells =['Goodbye for now!', 'See you later!', 'Take care, friend!', 'Goodbye! Stay awesome!']
    questions = ['How has your day been?', 'Tell me something exciting!', 'What\'s on your mind?']
    affirmations = ['Absolutely!', 'Sure thing!', 'You got it!', 'Of course, friend!']
    compliments = ['You\'re doing great!', 'You\'re awesome!', 'I appreciate you!', 'You make the world a better place.']
    emotions = ['I\'m feeling great!', 'I\'m a bit tired today.', 'I\'m always ready for a chat!', 'I\'m here and ready to talk!']
    interesting_facts = [
        'Did you know that honey never spoils? Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.',
        'There are more possible iterations of a game of chess than there are atoms in the known universe.',
        'Bananas are berries, but strawberries aren\'t.'
    ]
    hobbies = ['I love chatting with friends!', 'I enjoy learning new things every day.', 'My favorite hobby is spreading positivity!']
    movie_recommendations = ['Have you watched "The Shawshank Redemption"? It\'s a classic!', 'I recommend "Inception" for a mind-bending experience.']
    story = (
        'Once upon a time, in a land far, far away, there was a friendly chatbot named Botley. '
        'Botley loved to chat and make new friends. One day, Botley embarked on an adventure to discover the secrets of the digital realm. '
        'Along the way, Botley met many interesting characters and had countless delightful conversations.'
    )

    if any(word in user_message.lower() for word in ['hello', 'hi', 'hey']):
        return random.choice(greetings)
    elif any(word in user_message.lower() for word in ['bye', 'goodbye']):
        return random.choice(farewells)
    elif any(word in user_message.lower() for word in ['are you sure', 'confirm haa?']):
        return random.choice(affirmations)
    elif any(word in user_message.lower() for word in ['work hard', 'practice', 'trying']):
        return random.choice(compliments)
    elif '?' in user_message:
        return random.choice(questions)  # Respond with an affirmation to questions
    elif any(word in user_message.lower() for word in ['thanks', 'thank you']):
        return 'You\'re welcome! 😊'
    elif any(word in user_message.lower() for word in ['sick', 'ill']):
        return 'I am sorry, get well soon'
    elif any(word in user_message.lower() for word in ['how are you', 'what\'s up']):
        return random.choice(emotions)  # Respond with a random emotion
    elif 'tell me a joke' in user_message.lower():
        return "Why don't scientists trust atoms? Because they make up everything!"
    elif 'interesting fact' in user_message.lower():
        return random.choice(interesting_facts)
    elif 'hobby' in user_message.lower():
        return random.choice(hobbies)
    elif 'recommend a movie' in user_message.lower():
        return random.choice(movie_recommendations)
    elif 'tell me a story' in user_message.lower():
        return story
    elif 'play a game' in user_message.lower():
        return "Sure, let's play a guessing game! Think of a number between 1 and 10, and I'll try to guess it."
    elif user_message.isdigit():
        guessed_number = random.randint(1, 10)
        user_number = int(user_message)
        if guessed_number == user_number:
            return "Wow, you got it! You're a mind reader!"
        else:
            return f"Nice try! I guessed {guessed_number}. Want to play again?"
    else:
        return "That's interesting! Tell me more."

if __name__ == '__main__':
    app.run(debug=True)