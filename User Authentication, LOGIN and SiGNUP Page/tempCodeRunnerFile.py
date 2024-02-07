from flask import Flask, render_template, request, redirect, url_for
import mysql.connector
import bcrypt

db = mysql.connector.connect(
    host = 'localhost',
    user = 'sqluser',
    password = 'password',
    database = 'practice_field'
)

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/signup', methods =['POST'])
def signup():
    if request.method == 'POST':
        name = request.form['userName']
        email = request.form['userEmail']
        password = request.form['userPassword']

        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('UTF-8'), salt)

        cursor = db.cursor()
        cursor.execute('INSERT INTO user_data (name, email, password_hash, password_salt) VALUES (%s, %s, %s, %s)', (name, email, hashed_password, salt))

        db.commit()
        cursor.close()

        return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)