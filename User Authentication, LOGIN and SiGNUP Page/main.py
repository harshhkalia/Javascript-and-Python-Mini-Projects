from flask import Flask, render_template, request, redirect, url_for, flash
import mysql.connector
import bcrypt

db = mysql.connector.connect(
    host = 'localhost',
    user = 'sqluser',
    password = 'password',
    database = 'practice_field'
)

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/signup', methods =['POST'])
def signup():
    if request.method == 'POST':
        name = request.form['userName']
        email = request.form['userEmail']
        password = request.form['userPassword']

        cursor = db.cursor()
        cursor.execute('SELECT COUNT(*) FROM user_data WHERE email = %s', (email,))
        result = cursor.fetchone()
        if result[0] > 0:
            flash('Email already exists. Please use a different email', 'error')
            return redirect(url_for('index'))
        
        cursor.execute('SELECT COUNT(*) FROM user_data WHERE name = %s', (name,))
        result = cursor.fetchone()
        if result[0] > 0:
            flash('Username already exists. Please try a different one', 'error')
            return redirect(url_for('index'))

        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('UTF-8'), salt)

    try:
        cursor.execute('INSERT INTO user_data (name, email, password_hash, password_salt) VALUES (%s, %s, %s, %s)', (name, email, hashed_password, salt))
        db.commit()
        flash('Your account has been created successfully!', 'success')
    except Exception as e:
        flash('An error occur while signing in. Please try again later')
        print('Error:', e)
        db.rollback()
    finally:
        cursor.close()
    
    return redirect(url_for('index'))

@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        cursor = db.cursor()
        cursor.execute('SELECT name, password_hash, password_salt FROM user_data WHERE email = %s', (email,))
        user = cursor.fetchone()
        if user:
            name, stored_hash, salt = user
            hashed_password = bcrypt.hashpw(password.encode('UTF-8'), salt.encode('UTF-8'))
            if bcrypt.checkpw(password.encode('UTF-8'), stored_hash.encode('UTF-8')):
                flash(f'You logged in as {name}', 'success')
            else:
                flash('Incorrect email or password. Please try again later', 'error')
        else:
            flash('Email not found. Please enter a valid email address', 'error')
           
        cursor.close()

        return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)