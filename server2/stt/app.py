from flask import Flask, jsonify, request
from sqlalchemy import create_engine, text

app = Flask(__name__)
app.config.from_pyfile('config.py')

database = create_engine(app.config['DB_URL'], encoding = 'utf-8')
app.database = database

@app.route('/stt')
def hello_word():
    rows = app.database.execute(text("""
        select * from device where analog=0x00
    """)).fetchall()
    res = [{
        'deviceId' : row['device_id'],
        'analog' : row['analog'],
        'deviceName' : row['device_name'],
        'currentStatusTitle' : row['current_status_title'],
        'currValue' : row['curr_value']
    } for row in rows]

    return jsonify(res), 200

if __name__ == '__main__':
    app.run()