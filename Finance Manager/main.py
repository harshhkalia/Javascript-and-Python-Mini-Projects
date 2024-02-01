from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

transactions = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/add_transaction', methods=['POST'])
def add_transaction():
    data = request.get_json()
    transactions.append(data)
    return jsonify({'message': 'Transaction added successfully!'})

@app.route('/get_transactions')
def get_transactions():
    return jsonify({'transactions': transactions})

if __name__ == '__main__':
    app.run(debug=True)
