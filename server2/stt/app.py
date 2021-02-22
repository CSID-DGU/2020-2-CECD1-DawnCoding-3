from flask import Flask, jsonify, request
from sqlalchemy import create_engine, text
from command import querySelector, start
app = Flask(__name__)
app.config.from_pyfile('config.py')

database = create_engine(app.config['DB_URL'], encoding='utf-8')
app.database = database


@app.route('/stt')
def hello_word():
    command, query = start()
    # command, query = ('어떤 커맨드라고 알려줘', 'aa')

    print(query)
    # rows = app.database.execute(text(query)).fetchall()
    rows = app.database.execute(text(
        '''
        select * from device where analog=0x01
        '''
    )).fetchall();
    res = [{
        'deviceId': row['device_id'],
        'analog': row['analog'],
        'deviceName': row['device_name'],
        'signalName' : row['signal_name'],
        'currentStatusTitle': row['current_status_title'],
        'currValue': row['curr_value']
    } for row in rows]
    returnRes = {
        "command": command,
        "query": res
    }
    return jsonify(returnRes), 200


if __name__ == '__main__':
    app.run()