from flask import Flask, render_template, flash, request, redirect, url_for, session, jsonify
import mysql.connector
import bcrypt
import re
import random

db = mysql.connector.connect(
    host = 'localhost',
    user = 'sqluser',
    password = 'password',
    database = 'travel_planner'
)

app = Flask (__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

@app.route('/', methods=['POST','GET'])
def index():
    if request.method == 'POST':
        return redirect(url_for('index'))
    
    cursor = db.cursor()
    cursor.execute('SELECT user_review.ReviewID, user_review.UserID, user_review.Location, user_review.ReviewText, user_review.Rating, user_account.UserName FROM user_review INNER JOIN user_account ON user_review.UserID = user_account.UserID')
    reviews = cursor.fetchall()
    cursor.close()

    if not reviews:
        random_review = None
    else:
        random_review = random.choice(reviews)
        session['random_review'] = random_review

        searched_review = session.get('searched_review', None)

    return render_template('index.html', random_review = random_review)


@app.route('/signup', methods=['POST'])
def signup():
    if  request.method == 'POST':
        name = request.form['newUserName']
        email = request.form['email']
        password = request.form['newPassword']

        if ' ' in name:
            flash('Username does not contain any space', 'error')
            return redirect(url_for('index'))
        
        if len(password) < 8 or not re.search('[a-zA-Z]', password) or not re.search('[0-9]', password) or not re.search("[!@#$%^&*()_+=-{}[\];:'\"|<>,.?/`~]", password):
            flash('Password should be 8 characters long and should contain a mixture of symbols, digits and letters.', 'error')
            return redirect(url_for('index'))


        cursor = db.cursor()
        cursor.execute('SELECT COUNT(*) FROM user_account WHERE Email = %s', (email,))
        result = cursor.fetchone()
        if result[0] > 0:
            flash('Email already exists in server. Please use a different one', 'error')
            return redirect(url_for('index'))
        
        cursor.execute('SELECT COUNT(*) FROM user_account WHERE UserName = %s', (name,))
        result = cursor.fetchone()
        if result[0] > 0:
            flash('This username is already in use. Try using a different username', 'error')
            return redirect(url_for('index'))
        
    salt = bcrypt.gensalt()
    password_hashed = bcrypt.hashpw(password.encode('UTF-8'), salt)

    try:
        cursor.execute('INSERT INTO user_account (UserName, Email, PasswordHash, PasswordSalt) VALUES (%s, %s, %s, %s)', (name, email, password_hashed, salt))
        db.commit()
        flash('Your account has been created successfully!', 'success')
       
    except Exception as e:
        flash('An error occured while signing in. Please try again later', 'error')
        print('Error:', e)
        db.rollback()
    finally:
        cursor.close()

    return redirect(url_for('index'))

@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        username = request.form['userName']
        password = request.form['password']

        cursor = db.cursor()
        cursor.execute('SELECT UserID, UserName, PasswordHash, PasswordSalt FROM user_account WHERE UserName = %s',(username,))
        user = cursor.fetchone()
        if user:
            user_id, name, password_hash, salt = user
            password_hashed = bcrypt.hashpw(password.encode('UTF-8'), salt.encode('UTF-8'))
            if bcrypt.checkpw(password.encode('UTF-8'),  password_hash.encode('UTF-8')):
                session['user_id'] = user_id
                flash(f'You logged in as {name}','success')
            else:
                flash('Incorrect username or password. Please try again')
        else:
            flash('Username does not exist. Please try with a valid username')

        cursor.close()

    return redirect(url_for('index'))

@app.route('/add_review', methods=['POST'])
def add_review():
    if 'user_id' not in session:
        flash('You must be logged in to add a review.', 'error')
        return redirect(url_for('index'))
    
    location = request.form.get('location-input')
    write_text = request.form.get('write-review')
    rating = request.form.get('rating')

    cursor = db.cursor()
    try:
        cursor.execute('INSERT INTO user_review (UserID, Location, ReviewText, Rating) VALUES (%s, %s, %s, %s)',(session['user_id'], location, write_text, rating))
        db.commit()
        flash('Your review has been added successfully!', 'success')
    except Exception as e:
        flash('An error occured while adding your review. Please try again later', 'error')
        print('Error:', e)
        db.rollback()
    finally:
        cursor.close()

        return redirect(url_for('index'))
    
@app.route('/add_note', methods=['POST'])
def add_note():
    if 'user_id' not in session:
        flash('You must log in to add a note.','error')
        return redirect(url_for('index'))
    
    tittle = request.form['tittleInput']
    date = request.form['dateInput']
    note_text = request.form['writeNotes']
    user_id = session['user_id']

    cursor = db.cursor()
    add_note_query = ('INSERT INTO user_notes''(UserID, Tittle, Date, NoteText, TimeAdded)''VALUES(%s, %s, %s, %s, NOW())')
    data_note = (user_id, tittle, date, note_text)
    cursor.execute(add_note_query, data_note)
    db.commit()
    cursor.close()

    return redirect(url_for('index'))

@app.route('/get_notes', methods=['GET'])
def get_notes():
    search_query = request.args.get('search','')

    cursor = db.cursor()
    get_notes_query = ('SELECT NoteID, Tittle, Date, NoteText, TimeAdded FROM user_notes WHERE UserID = %s AND Tittle LIKE %s')
    data_note = (session['user_id'], '%' + search_query + '%')
    cursor.execute(get_notes_query, data_note)
    notes = cursor.fetchall()
    cursor.close()

    return jsonify(notes)

@app.route('/edit_note', methods=['POST'])
def edit_note():
    note_id = request.form.get('note_id')
    new_content = request.form.get('new_content')

    cursor = db.cursor()
    update_query = ('UPDATE user_notes SET NoteText = %s WHERE NoteID = %s')
    data_note = (new_content, note_id)
    cursor.execute(update_query, data_note)
    db.commit()
    cursor.close()

    return jsonify({'status':'success'})

@app.route('/delete_note', methods=['POST'])
def delete_note():
    note_id = request.form.get('note_id')

    cursor = db.cursor()
    delete_query = ('DELETE FROM user_notes WHERE NoteID = %s')
    data_note = (note_id,)
    cursor.execute(delete_query, data_note)
    db.commit()
    cursor.close()

    return jsonify({'status':'success'})

@app.route('/get_reviews', methods=['GET'])
def get_reviews():
    location = request.args.get('location')
    cursor = db.cursor()
    try:
        cursor.execute('SELECT user_review.ReviewID, user_review.UserID, user_review.Location, user_review.ReviewText, user_review.Rating, user_account.UserName FROM user_review INNER JOIN user_account ON user_review.UserID = user_account.UserID WHERE user_review.Location = %s', (location,))
        reviews = cursor.fetchall()
        return jsonify(reviews)
    except Exception as e:
        print('Error Fetching The Review:', e)
        return jsonify({'Error':'Internal Server Error'}), 500
    finally:
        cursor.close()

@app.route('/searched_location_reviews', methods=['GET'])
def searched_location_reviews():
    location = request.args.get('location')
    cursor = db.cursor()
    try:
        cursor.execute('SELECT user_review.ReviewID, user_review.UserID, user_review.Location, user_review.ReviewText, user_review.Rating, user_account.UserName FROM user_review INNER JOIN user_account ON user_review.UserID = user_account.UserID WHERE user_review.Location = %s', (location,))
        reviews = cursor.fetchall()
        return jsonify(reviews)
    except Exception as e:
        print('Error In Fetching The Review:', e)
        return jsonify({'Error':'Internal Server Error'}), 500
    finally:
        cursor.close()

if __name__ == '__main__':
    app.run(debug=True)