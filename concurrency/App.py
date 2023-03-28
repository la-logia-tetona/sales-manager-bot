from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import threading 

app = Flask(__name__)
CORS(app)
resources = {r"/api/*": {"origins": "*"}}
app.config["CORS_HEADERS"] = "Content-Type"
app.config['JSON_SORT_KEYS'] = False

# Declraing a lock
lock = threading.Lock()
available = True

@app.route('/lock')
def lockGet():
    global available
    lock.acquire()
    if (available):
        available = False
        lock.release()
        return jsonify({"Message":"available"})
    else:
        lock.release() 
        return jsonify({"Message":"notAvailable"})

@app.route('/unlock')
def unlock():
    global available
    lock.acquire()
    available = True
    lock.release()
    return jsonify({"Message":"unlocked"})


if __name__ == "__main__":
    app.run(debug = True, host='0.0.0.0', port=7007)