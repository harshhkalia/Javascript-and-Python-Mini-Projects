from flask import Flask, render_template, request, session, jsonify
import mysql.connector
import bcrypt
import re
from datetime import datetime

app = Flask(__name__)
app.secret_key = b'\x8f\xa5\xa6\x12\xcd\xe9!\x85\x95\xd4w\x1eH<\x13m~\xdf[\x91\xdc\x84\xa5\xc2\x04\xdd\xfc\x1e\xf2'
app.config['localhost'] = 'localhost'
app.config['sqluser'] = 'sqluser'
app.config['password'] = 'password'
app.config['roustuf_messanger'] = 'roustuf_messanger'


db = mysql.connector.connect(
    host='localhost',
    user='sqluser',
    password='password',
    database='roustuf_messanger'
)

def insert_user_into_database(phone_number, email, password, username):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

    cursor = db.cursor()
    insert_query = """
    INSERT INTO user_account(user_id,phone_number, email, password_hash, password_salt, username)
    VALUES(DEFAULT, %s, %s, %s, %s, %s)
    """
    cursor.execute(insert_query, (phone_number, email, hashed_password, salt, username))
    db.commit()
    cursor.close()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/home')
def home():
    contacts = fetch_contacts_from_database()

    return render_template('home.html', contacts= contacts)

@app.route('/searchtext')
def searchtext():
    return render_template('searchtext.html')

@app.route('/initiallockedchatspage')
def initiallockedchatspage():
    return render_template('initiallockedchatspage.html')

@app.route('/lockedchats')
def lockedchats():
    return render_template('lockedchats.html')

@app.route('/managemedia')
def managemedia():
    return render_template('managemedia.html')

@app.route('/savedchats')
def savedChats():
    return render_template('savedchats.html')

@app.route('/userprofile')
def userprofile():
    return render_template('userprofile.html')

@app.route('/signup', methods=['POST'])
def signup():
    if request.method == 'POST':
        phone_number = request.form['signupUserPhoneNo']
        email = request.form['signupUserEmail']
        password = request.form['signupUserPassword']
        confirm_password = request.form['signupConfirmPass']
        username = request.form['signupUserName']

        if not re.match(r'^(?=.*[a-zA-Z])(?=.*[!@#$%^&*()-_=+{};:,<.>])(?=.*\d)[a-zA-Z!@#$%^&*()-_=+{};:,<.>\d]{8,}$', password):
            return '<script>alert("Password must be at least 8 characters long and contain at least one alphabet, one symbol, and one digit."); window.location.href="/";</script>'

        cursor = db.cursor()
        check_query = """
        SELECT phone_number, email
        FROM user_account
        WHERE phone_number = %s OR email = %s
        """
        cursor.execute(check_query, (phone_number, email))
        result = cursor.fetchone()

        if result:
            existing_phone_number = result[0]
            existing_email = result[1]
            if existing_phone_number == phone_number:
                return '<script>alert("This phone number is already in use. Please use a different one!"); window.location.href="/";</script>'
            if existing_email == email:
                return '<script>alert("This email is already in use. Please use a different one!"); window.location.href="/";</script>'

        if password != confirm_password:
            return '<script>alert("Passwords do not match."); window.location.href="/";</script>'
        
        session['username'] = username
        
        insert_user_into_database(phone_number, email, password, username)

        edit_name = '<script> var newName = prompt("Write your username here", ""); if(newName !== null && newName !== "") { window.location.href = "/editname?newName=" + encodeURIComponent(newName); } else { window.location.href = "/"; } </script>'
        
        return edit_name

@app.route('/editname')
def editname():
    new_name = request.args.get('newName')
    username = session.get('username')

    if new_name is not None:
        cursor = db.cursor()
        update_query = """
        UPDATE user_account
        SET username = %s
        WHERE username = %s
    """
        cursor.execute(update_query, (new_name, session['username']))
        db.commit()
        cursor.close()

        welcome_alert = "<script>alert('Welcome " + new_name + ", now you can login!'); window.location.href='/'; </script>"
        return welcome_alert
    else:
        second_alert = "<script>alert('welcome" + username +", now you can login!'); window.location.href='/';</script>"
        return second_alert
    
def get_user_by_emailAndPhone(username_or_email):
    cursor = db.cursor()
    check_query = """
        SELECT username, password_hash
        FROM user_account
        WHERE phone_number = %s OR email = %s
        """
    cursor.execute(check_query, (username_or_email, username_or_email))
    return cursor.fetchone()

def get_user_id(username_or_email):
    cursor = db.cursor()
    check_query = """
    SELECT user_id
    FROM user_account
    WHERE phone_number = %s OR email = %s
    """
    cursor.execute(check_query,(username_or_email, username_or_email))
    user = cursor.fetchone()
    cursor.close()
    return user[0] if user else None
    
@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        username_or_email = request.form['usernameOrEmail']
        password = request.form['userPassword']

        try:
            user = get_user_by_emailAndPhone(username_or_email)
            if user:
                saved_password_hash = user[1]
                if bcrypt.checkpw(password.encode('UTF-8'), saved_password_hash.encode('UTF-8')):
                    session['user_id'] = get_user_id(username_or_email)
                    username = user[0]
                    return f'<script>alert("Hey {username}, you logged in successfully!"); window.location.href="/home";</script>'
                else:
                    return '<script>alert("Incorrect password. Please try again."); window.location.href="/";</script>'
            else:
                return '<script>alert("User not found. Please register an account."); window.location.href="/";</script>'
        except Exception as e:
            return f'<script>alert("An error occurred: {str(e)}"); window.location.href="/";</script>'
        
@app.route('/add_contact', methods=['POST'])
def add_contact():
    if 'user_id' in session:
        user_id = session['user_id']
        contact_number = request.form['addNumber']
        contact_name = request.form['addName']

        
        cursor = db.cursor()
        insert_query = """
        INSERT INTO user_contacts(user_id, contact_name, contact_number)
        VALUES(%s, %s, %s)
        """
        cursor.execute(insert_query,(user_id, contact_name, contact_number))
        db.commit()
        cursor.close()

        return "<script>alert('The contact has been added!'); window.location.href='/home';</script>"
    else:
        return "<script>alert('Something is wrong with the given details. Please check them once and try again!'); window.location.href='/home';</script>"

@app.route('/fetch_contacts', methods=['GET'])
def fetch_contacts():
    contacts = fetch_contacts_from_database()
    if contacts is None:
        return('Failed to fetch contacts from database')

    return render_template('home.html', contacts=contacts)

def fetch_contacts_from_database():
    try:
        if 'user_id' not in session:
            return []
        
        db_connection = mysql.connector.connect(
            host = app.config['localhost'],
            user = app.config['sqluser'],
            password = app.config['password'],
            database = app.config['roustuf_messanger']
        )

        cursor = db_connection.cursor()
        query = 'SELECT contact_name FROM user_contacts WHERE user_id = %s'
        cursor.execute(query,(session['user_id'],))

        contacts = [row[0] for row in cursor.fetchall()]

        cursor.close()
        db_connection.close()
        return contacts
    
    except mysql.connector.Error as error:
        print('Error fetching the contacts from database:', error)
        return []
    
@app.route('/edit_contact', methods=['POST'])
def edit_contact():
    if request.method == 'POST':
        user_id = session.get('user_id')
        edited_number = request.form['editNumber']
        edited_name = request.form['editName']
        original_name = request.form['originalName']

        try:
            cursor = db.cursor()
            select_query = """
            SELECT 1 FROM user_contacts
            WHERE user_id = %s AND contact_name = %s
            """
            cursor.execute(select_query,(user_id, original_name))
            result = cursor.fetchone()
            
            if result:
                cursor = db.cursor()
                update_query = """
                  UPDATE user_contacts
                  SET contact_number = %s, contact_name = %s
                  WHERE user_id = %s AND contact_name = %s
                  """
                cursor.execute(update_query, (edited_number, edited_name, user_id, original_name))
                db.commit()
                cursor.close()
                return 'Contact updated successfully!', 200
            else:
                return jsonify({'error':'Original contact name not found'}), 404

        except Exception as e:
            print('Error editing the contact:', e)
            return 'Failed to edit the contact', 500

@app.route('/get_current_contact_info', methods=['POST'])
def get_current_contact_info():
    if request.method == 'POST':
        user_id = session.get('user_id')
        selected_contact_name = request.json.get('selectedContactName')

        try:
            cursor = db.cursor()
            select_query = """
            SELECT contact_number, contact_name
            FROM user_contacts
            WHERE user_id = %s AND contact_name = %s
            """
            cursor.execute(select_query, (user_id, selected_contact_name))
            contact_info = cursor.fetchone()
            cursor.close()

            if contact_info:
                return jsonify({'contactNumber': contact_info[0], 'contactName': contact_info[1]})
            else:
                return jsonify({'error': 'Contact not found'}), 404
        
        except Exception as e:
            print('Error fetching the specific contact information', e)
            return jsonify({'error': 'Failed to fetch the selected contact information'}), 500 

@app.route('/get_username', methods=['GET'])
def get_username():
    user_id = session.get('user_id')
    if user_id:
        try:
            cursor = db.cursor()
            cursor.execute("""
            SELECT username FROM user_account WHERE user_id = %s
""",(user_id,))
            username = cursor.fetchone()[0]
            cursor.close()
            return jsonify({'username':username}), 200
        except Exception as e:
            print('Error to fetch the username:', e)
            return jsonify({'error':'Failed to fetch the username from backend'}),500
    else:
        return jsonify({'error':'User is not authenticate with the system'}), 400

@app.route('/send_message', methods=['POST'])
def send_message():
    if request.method == 'POST':
        sender_id = session.get('user_id')
        receiver_id = request.json.get('contact_id')
        message_text = request.json.get('message')

        try:
            cursor = db.cursor()
            insert_query = """
            INSERT INTO messages(sender_id, reciever_id, message_text, timestamp)
            VALUES(%s, %s, %s, %s)
            """
            cursor.execute(insert_query,(sender_id, receiver_id, message_text, datetime.now()))
            db.commit()
            cursor.close()

            return jsonify({'message':'Message stored successfully in database!'}), 200
        except Exception as e:
            print('Error in storing the message in database:', e)
            return jsonify({'error':'An error occured while storing the message'}), 404

@app.route('/get_contact_id', methods=['POST'])
def get_contact_id():
    contact_name = request.json.get('contactName')
    if contact_name:
        try:
            cursor = db.cursor()
            select_query = """
            SELECT contact_number from user_contacts WHERE contact_name = %s
            """
            cursor.execute(select_query,(contact_name,))
            contact_id = cursor.fetchone()
            if contact_id:
                return jsonify({'contactId': contact_id[0]}), 200
            else:
                return jsonify({'error':'Contact not found'}), 404
        except Exception as e:
            print('Error getting the contact id:', e)
            return jsonify({'error':'Failed to fetch the contact'}), 414
    else:
        return jsonify({'error':'Contact name is not provided'}), 500

from flask import jsonify, request

@app.route('/fetch_messages', methods=['POST'])
def fetch_messages():
    contact_name = request.json.get('contactName')
    try:
        cursor = db.cursor()
        cursor.execute("""
        SELECT message_text 
        FROM messages 
        WHERE reciever_id = (SELECT contact_number FROM user_contacts WHERE contact_name = %s)
        """, (contact_name,))

        messages = [row[0] for row in cursor.fetchall()]
        cursor.close()
        return jsonify({'messages':messages}), 200
    except Exception as e:
        print('Error fetching the messages from backend:', e)
        return jsonify({'error':'Failed to fetch messages'}), 404
    
@app.route('/new_pin', methods=['POST'])
def new_pin():
    user_id = session.get('user_id')
    pin_number = request.json.get('new_pin')

    if user_id:
        try:
            cursor = db.cursor()
            
            cursor.execute('SELECT locked_pin FROM user_account WHERE user_id = %s', (user_id,))
            existing_pin = cursor.fetchone()

            if existing_pin[0]:
                return jsonify({'error': 'User already has a PIN set up'}), 414

            update_query = """
                UPDATE user_account
                SET locked_pin = %s
                WHERE user_id = %s
            """
            cursor.execute(update_query, (pin_number, user_id))
            db.commit()
            cursor.close()

            return jsonify({'success': 'The PIN has been added'}), 200
        except Exception as e:
            print('Error in adding PIN to the account:', e)
            return jsonify({'error': 'Failed to add PIN to account'}), 500
    else:
        return jsonify({'error': 'User not logged in'}), 401

@app.route('/forget_pin', methods=['POST'])
def forget_pin():
    mobile_number = request.form.get('mobilenumber')
    username = request.form.get('username')
    try:
        cursor = db.cursor()
        cursor.execute('SELECT user_id FROM user_account WHERE phone_number = %s AND username = %s',(mobile_number, username))
        user_id = cursor.fetchone()
        if user_id:
            return jsonify({'success': True, 'user_id': user_id[0]}), 200
        else:
            return jsonify({'success': False, 'message':'Failed to fetch account details'}), 500
    except Exception as e:
        print('Error to fetch the details of account:', e)
        return jsonify({'error':'Failed to fetch the details of your account'}), 404
    finally:
        cursor.close()

@app.route('/update_pin', methods=['POST'])
def update_pin():
    user_id = request.form.get('user_id')
    newPin = request.form.get('newPin')
    try:
        cursor = db.cursor()
        update_query = """
        UPDATE user_account
        SET locked_pin = %s
        WHERE user_id = %s
    """
        cursor.execute(update_query,(newPin, user_id))
        db.commit()
        return jsonify({'success':'PIN updated successfully!'}), 200
    except Exception as e:
        print('Error in updating the PIN of your account', e)
        return jsonify({'error':'Failed to update the PIN'}), 404
    finally:
        cursor.close()

@app.route('/check_pin', methods=['POST'])
def check_pin():
    user_id = session.get('user_id')
    entered_pin = str(request.json.get('enteredPin'))
    
    if user_id:
        try:
            cursor = db.cursor()
            cursor.execute('SELECT locked_pin FROM user_account WHERE user_id = %s', (user_id,))
            locked_pin = cursor.fetchone()

            if locked_pin:
                locked_pin = str(locked_pin[0])

                if locked_pin == entered_pin:
                    return jsonify({'success': True, 'message': 'Correct PIN entered'}), 200
                else:
                    return jsonify({'success': False, 'message': 'Incorrect PIN entered'}), 404
            else:
                return jsonify({'error': 'No PIN found for this user'}), 420
        except Exception as e:
            print("Error in checking details of your account:", e)
            return jsonify({'error': 'Failed to check PIN'}), 414
        finally:
            cursor.close()
    else:
        return jsonify({'error': 'User not authorized'}), 500

@app.route('/get_user_info', methods=['GET'])
def get_user_info():
    user_id = session.get('user_id')
    if user_id:
        try:
            cursor = db.cursor()
            cursor.execute('SELECT username, phone_number, email FROM user_account WHERE user_id = %s',(user_id,))
            user_info = cursor.fetchone()
            if user_info:
                username, phone_number, email = user_info
                return jsonify({'success':True, 'username': username, 'phone_number':phone_number, 'email':email}), 200
            else:
                return jsonify({'success':False, 'Message':'Can not able to fetch the details of your profile'}), 404
        except Exception as e:
            print('Error in fetching user profile details:', e)
            return jsonify({'error':'Failed to fetch the requested details'}), 500
        finally:
            cursor.close()
    else:
        return jsonify({'error':'User is not authenticate with system'}), 414

import bcrypt

@app.route('/update_username', methods=['POST'])
def update_username():
    user_id = session.get('user_id')
    if user_id:
        try:
            cursor = db.cursor()
            password = request.json.get('password')
            new_username = request.json.get('newUsername')
            cursor.execute('SELECT password_hash, password_salt FROM user_account WHERE user_id = %s', (user_id,))
            result = cursor.fetchone()
            if result:
                hashed_password, salt = result
                hashed_entered_password = bcrypt.hashpw(password.encode('utf-8'), salt.encode('utf-8'))
                if bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8')):
                    cursor.execute("UPDATE user_account SET username = %s WHERE user_id = %s", (new_username, user_id))
                    db.commit()
                    return jsonify({'success': True, 'message': 'Username updated successfully!'}), 200
                else:
                    return jsonify({'success': False, 'message': 'Incorrect password, unable to update the username'}), 401
            else:
                return jsonify({'success': False, 'message': 'User not found'}), 404
        except Exception as e:
            print('Error in updating the username:', e)
            return jsonify({'success': False, 'message': 'Error in updating the username'}), 500
        finally:
            cursor.close()
    else:
        return jsonify({'success': False, 'message': 'User not authenticated'}), 414

@app.route('/update_phonenumber', methods=['POST'])
def update_phonenumber():
    user_id = session.get('user_id')
    if user_id:
        try:
            cursor = db.cursor()
            password = request.json.get('password')
            new_number = request.json.get('newPhonenumber')
            cursor.execute('SELECT password_hash, password_salt FROM user_account WHERE user_id = %s',(user_id,))
            result = cursor.fetchone()
            if result:
                hashed_password, salt = result
                hashed_password_entered = bcrypt.hashpw(password.encode('utf-8'), salt.encode('utf-8'))
                if bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8')):
                    cursor.execute('UPDATE user_account SET phone_number = %s WHERE user_id = %s',(new_number, user_id))
                    db.commit()
                    return jsonify({'success': True, 'message':'Phone number updated successfully!'}), 200
                else:
                    return jsonify({'success': False, 'message':'Incorrect password entered. Please enter the correct password'}), 404
            else:
                return jsonify({'success':False, 'message':'Result not found'}), 414
        except Exception as e:
            print('Error updating the phone number:', e)
            return jsonify({'success': False, 'message':'An error occured in updating your phone number'}), 401
        finally:
            cursor.close()
    else:
        return jsonify({'message':'User not authenticate with the system'}), 500

@app.route('/update_email', methods=['POST'])
def update_email():
    user_id = session.get('user_id')
    if user_id:
        try:
            cursor = db.cursor()
            password = request.json.get('password')
            new_email = request.json.get('newEmail')
            cursor.execute('SELECT password_hash, password_salt FROM user_account WHERE user_id = %s',(user_id,))
            result = cursor.fetchone()
            if result:
                hashed_password, salt = result
                hashed_password_entered = bcrypt.hashpw(password.encode('utf-8'), salt.encode('utf-8'))
                if bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8')):
                    cursor.execute("UPDATE user_account SET email = %s WHERE user_id = %s",(new_email, user_id))
                    db.commit()
                    return jsonify({'success': True, 'message':'Email update successfully!'}), 200
                else:
                    return jsonify({'success': False, 'message':'Incorrect password entered. Please enter a correct password and try again'}), 404
            else:
                return jsonify({'message':'Result obtained is not what you desired'}), 414
        except Exception as e:
            print('Error in updating the email of user:', e)
            return jsonify({'message':'Failed to update the email of user'}), 519
        finally:
            cursor.close()
    else:
        return jsonify({'message':'Failed to update the email of user'}), 500

@app.route('/update_password', methods=['POST'])
def update_password():
    user_id = session.get('user_id')
    if user_id:
        try:
            cursor = db.cursor()
            password = request.json.get('password')
            new_password = request.json.get('newPassword')
            cursor.execute('SELECT password_hash, password_salt FROM user_account WHERE user_id = %s', (user_id,))
            result = cursor.fetchone()
            if result:
                hashed_password, salt = result
                hashed_password_entered = bcrypt.hashpw(password.encode('utf-8'), salt.encode('utf-8'))
                if bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8')):
                    new_salt = bcrypt.gensalt().decode('utf-8')
                    new_hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), new_salt.encode('utf-8'))
                    cursor.execute('UPDATE user_account SET password_hash = %s, password_salt = %s WHERE user_id = %s', (new_hashed_password, new_salt, user_id))
                    db.commit()
                    return jsonify({'success': True, 'message':'Your password has been updated'}), 200
                else:
                    return jsonify({'success': False, 'message': 'You entered an incorrect password. Please enter correct password and try again'}), 404
            else:
                return jsonify({'message':'Undesired result obtained'}), 414
        except Exception as e:
            print('Error in updating the password:', e)
            return jsonify({'message':'Failed to update the password of this account'}), 519
        finally:
            cursor.close()
    else:
        return jsonify({'message':'User not authenticate with the system'}), 500

@app.route('/delete_account', methods=['DELETE'])
def delete_account():
    user_id = session.get('user_id')
    if user_id:
        try:
            cursor = db.cursor()
            password = request.json.get('password')
            cursor.execute("SELECT password_hash, password_salt FROM user_account WHERE user_id = %s", (user_id,))
            result = cursor.fetchone()
            if result:
                hashed_password, salt = result
                hashed_entered_password = bcrypt.hashpw(password.encode('utf-8'), salt.encode('utf-8'))
                if bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8')):
                    cursor.execute("DELETE FROM user_account WHERE user_id = %s", (user_id,))
                    db.commit()
                    return jsonify({'success': True, 'message': 'Your account has been successfully deleted'}), 200
                else:
                    return jsonify({'success': False, 'message': 'Incorrect password, unable to delete the account'}), 400
            else:
                return jsonify({'success': False, 'message': 'User not found'}), 404
        except Exception as e:
            print('Error deleting the account:', e)
            return jsonify({'success': False, 'message': 'Error deleting the account'}), 500
        finally:
            cursor.close()
    else:
        return jsonify({'success': False, 'message': 'User not authenticated'}), 414

if __name__ == '__main__':
    app.run(debug=True)
