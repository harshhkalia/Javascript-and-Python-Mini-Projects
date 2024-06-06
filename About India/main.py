from flask import Flask, render_template, request, redirect, session, jsonify
import mysql.connector
import bcrypt
import re

app = Flask(__name__)
app.secret_key = 'F\x14w\xc2q\xaa\xd6\x98c\x9c\x15I\xed\x8dS\xd6<\x12\x9b)\xd1\xae\x97'
db = mysql.connector.connect(
    host='localhost',
    user='sqluser',
    password='password',
    database='aboutindia'
)

def hash_password(password):
    salt = bcrypt.gensalt()
    password_hashed = bcrypt.hashpw(password.encode('UTF-8'), salt)
    return password_hashed

@app.route('/')
def index():
    success_message = request.args.get('success','')
    error_message = request.args.get('error','')
    return render_template('index.html', error_message = error_message, success_message = success_message)

@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/tweets')
def tweets():
    return render_template("tweets.html")

@app.route('/signup', methods=['POST'])
def signup():
    if request.method == 'POST':
        username = request.form['newUsernameInput']
        email = request.form['emailInput']
        password = request.form['newPasswordInput']
        confirm_password = request.form['confirmPasswordInput']

        error_message = None

        if ' ' in username:
            error_message = "No spaces are allowed in username, you can use underscores in place of spaces"
        elif len(password) < 8 or not re.search('[a-zA-Z]', password) or not re.search('[0-9]', password) or not re.search("[!@#$%^&*()_+=-{}[\];:'\"|<>,.?/`~]", password):
            error_message = "Password should be 8 characters long and should contain a mixture of symbols, digits, and letters."
        elif password != confirm_password:
            error_message = "Passwords do not match. Please re-enter them."
        else:
            cursor = db.cursor()
            cursor.execute('SELECT COUNT(*) FROM user_accounts WHERE username=%s', (username,))
            if cursor.fetchone()[0] > 0:
                error_message = "Username already exists. Please use a different one."
            
            cursor.execute('SELECT COUNT(*) FROM user_accounts WHERE email=%s', (email,))
            if cursor.fetchone()[0] > 0:
                error_message = "Email already exists. Please use a different email."
            
        if not error_message:
            try:
                password_hashed = hash_password(password)
                cursor.execute('INSERT into user_accounts(username, email, password_hashed) VALUES(%s, %s, %s)', (username, email, password_hashed))
                db.commit()
            except Exception as e:
                error_message = "An error occurred while signup. Please try again."
                print('Error:', e)
                db.rollback()
            finally: 
                cursor.close()

        if error_message:
            return redirect('/?error=' + error_message)
        else:
            return redirect('/?success=Your account has been created successfully, now you can login.')

@app.route('/login', methods=['POST'])
def login():
    if request.method =='POST':
        usernameoremail = request.form['usernameoremail']
        password = request.form['loginPassword']

        cursor = db.cursor()
        cursor.execute('SELECT user_id, username, password_hashed FROM user_accounts WHERE username = %s OR email = %s',(usernameoremail, usernameoremail))
        user = cursor.fetchone()
        if user:
            user_id, username, password_hashed = user
            if bcrypt.checkpw(password.encode('UTF-8'), password_hashed.encode('UTF-8')):
                session['user_id'] = user_id
                cursor.execute('SELECT username, email from user_accounts WHERE user_id = %s', (user_id,))
                user_info = cursor.fetchone()
                if user_info:
                    username, email = user_info
                    return render_template('home.html', username=username, email=email)
                else:
                    error_message = 'User information not found.'
            else:
                error_message = 'Incorrect password. Please check it and try again.'
        else:
            error_message = 'User not found. Please check your username/email and try again.'

        return redirect('/?error=' + error_message)

@app.route('/post_tweets', methods=['POST'])
def post_tweets():
    cursor = None
    try:
        if 'user_id' in session:
            user_id = session['user_id']
            tweet_text = request.json.get('tweet_text')

            email = request.json.get('email')
            password = request.json.get('password')

            cursor = db.cursor()
            cursor.execute('SELECT password_hashed FROM user_accounts WHERE user_id = %s', (user_id,))
            hashed_password = cursor.fetchone()[0]
            if bcrypt.checkpw(password.encode('UTF-8'), hashed_password.encode('UTF-8')):
                cursor.execute('INSERT into user_reviews(user_id, review_text, review_likes, review_reports, added_on) VALUES(%s, %s, 0, 0, CURDATE())', (user_id, tweet_text))
                db.commit()

                return jsonify({'message': 'Tweet posted successfully!'}), 200
            else:
                return jsonify({'error': 'Incorrect email or password'}), 401
        else:
            return jsonify({'error': 'User not logged in'}), 401
    except Exception as e:
        print('Error occurred while inserting tweet into database:', e)
        return jsonify({'error': 'Failed to post tweet. Please try again later.'}), 502
    finally:
        if cursor:
            cursor.close()

@app.route('/get_tweets', methods=['GET'])
def get_tweets():
    try:
        cursor = db.cursor()
        cursor.execute('SELECT r.review_text, u.username, r.review_likes, r.review_id, r.added_on FROM user_reviews r JOIN user_accounts u ON r.user_id = u.user_id')
        reviews = cursor.fetchall()
        tweets = [{'text': review[0], 'username': review[1], 'likes': review[2], 'id': review[3],'date':review[4]} for review in reviews]
        return jsonify({'tweets': tweets}), 200
    except Exception as e:
        print('Error in getting reviews to display:', e)
        return jsonify({'error':'Failed to fetch tweets. Please try agin later.'}), 401
    finally:
        if cursor:
            cursor.close()

@app.route('/like_tweet/<int:review_id>', methods=['POST'])
def like_tweet(review_id):
    try:
        if 'user_id' in session:
            cursor = db.cursor()
            cursor.execute('UPDATE user_reviews SET review_likes = review_likes + 1 WHERE review_id = %s', (review_id,))
            db.commit()

            cursor.execute('SELECT review_likes FROM user_reviews WHERE review_id = %s', (review_id,))
            likes = cursor.fetchone()[0]
            return jsonify({'likes': likes}), 200
        else:
            return jsonify({'error': 'User not logged in.'}), 401
    except Exception as e:
        print('Error in liking the tweet because:', e)
        return jsonify({'error':'Failed to liked the tweet'}), 500
    finally:
        if cursor:
            cursor.close()

@app.route('/report_tweet/<int:review_id>', methods=['POST'])
def report_tweet(review_id):
    try:
        if 'user_id' in session:
            return jsonify({'message': 'Tweet reported successfully!'}), 200
        else:
            return jsonify({'error': 'User not logged in.'}), 401
    except Exception as e:
        print('Error in reporting the tweet:', e)
        return jsonify({'error': 'Failed to report tweet.'}), 500

@app.route('/get_user_tweets', methods=['GET'])
def get_user_tweets():
    try:
        if 'user_id' in session:
            user_id = session['user_id']
            cursor = db.cursor()
            cursor.execute('SELECT r.review_id, r.review_text, u.username, r.review_likes, r.added_on FROM user_reviews r JOIN user_accounts u ON r.user_id = u.user_id WHERE r.user_id = %s',(user_id,))
            reviews = cursor.fetchall()
            tweets = [{'review_id':review[0], 'text':review[1], 'username':review[2], 'likes':review[3], 'date': review[4]} for review in reviews]
            return jsonify({'tweets': tweets}), 200
        else:
            return jsonify({'error':'User not logged in'}), 404
    except Exception as e:
        print('Error in getting users own tweets:', e)
        return jsonify({'error':'Failed to get user own uploaded tweets.'}), 414
    finally:
        if cursor:
            cursor.close()

@app.route('/edit_tweet/<int:review_id>', methods=['POST'])
def edit_tweet(review_id):
    try:
        if 'user_id' in session:
            user_id = session['user_id']
            new_text = request.json.get('text')

            cursor = db.cursor()
            cursor.execute('UPDATE user_reviews SET review_text = %s WHERE review_id = %s AND user_id = %s',(new_text, review_id, user_id))
            db.commit()

            return jsonify({'message':'Tweet updated successfully!'}), 200
        else:
            return jsonify({'error':'User not logged in'}), 414
    except Exception as e:
        print('Error in updating the tweet:', e)
        return jsonify({'error':'Failed to update the tweet'}), 510
    finally:
        if cursor:
            cursor.close()

@app.route('/delete_tweet/<int:review_id>', methods=['DELETE'])
def delete_tweet(review_id):
    try:
        if 'user_id' in session:
            user_id = session['user_id']

            cursor = db.cursor()
            cursor.execute('DELETE FROM user_reviews WHERE review_id = %s AND user_id = %s',(review_id, user_id))
            db.commit()

            return jsonify({'message':'Tweet deleted successfully!'}), 200
        else:
            return jsonify({'error':'User not logged in'}), 404
    except Exception as e:
        print('Error in deleting the tweet:', e)
        return jsonify({'error':'Failed to delete the tweet'}), 512
    finally:
        if cursor:
            cursor.close()

if __name__ == '__main__':
    app.run(debug=True)
