@app.route('/', methods=['POST','GET'])
def index():
    if request.method == 'POST':
        return redirect(url_for('index'))
    
    review = session.get('review', None)
    cursor = db.cursor()
    cursor.execute('SELECT user_review.ReviewID, user_review.UserID, user_review.Location, user_review.ReviewText, user_review.Rating, user_account.UserName FROM user_review INNER JOIN user_account ON user_review.UserID = user_account.UserID')
    reviews = cursor.fetchall()
    cursor.close()

    if not reviews:
        review = None
    else:
        review = random.choice(reviews)
    return render_template('index.html', review = review)

@app.route('/search', methods=['POST'])
def search():
    location = request.form.get('location')
    cursor = db.cursor()
    cursor.execute('SELECT user_review.ReviewID, user_review.UserID, user_review.Location, user_review.ReviewText, user_review.Rating, user_account.UserName FROM user_review INNER JOIN user_account ON user_review.UserID = user_account.UserID WHERE user_review.Location = %s', (location,))
    reviews = cursor.fetchall()
    cursor.close()

    if not reviews:
        review = None
    else:
        review = random.choice(reviews)
        session['review'] = review
    return redirect(url_for('index'))