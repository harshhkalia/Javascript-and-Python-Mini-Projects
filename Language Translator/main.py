from flask import Flask, render_template, request
from googletrans import Translator, LANGUAGES

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', language=LANGUAGES)

@app.route('/translate', methods=['POST'])
def translate():
    if request.method == 'POST':
        text_to_translate = request.form['text_to_translate']
        target_language = request.form['target_language']

        detected_language = Translator().detect(text_to_translate).lang

        translator = Translator()
        translation = translator.translate(text_to_translate, dest=target_language)

        return render_template('index.html', translation=translation.text, detected_language=LANGUAGES[detected_language], language =LANGUAGES)

if __name__ == '__main__':
    app.run(debug=True)
