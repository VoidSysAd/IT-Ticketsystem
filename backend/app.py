from flask import Flask, request, jsonify
from flask_cors import CORS
import couchdb
from couchdb.http import ResourceNotFound, ResourceConflict, PreconditionFailed
from datetime import datetime
from werkzeug.utils import secure_filename
import base64
from functools import wraps
import os
from typing import List, Dict, Optional, Union

app = Flask(__name__)
CORS(app)

# Konfigurationskonstanten
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB ddassa
COUCH_URL = 'http://localhost:5984/'
COUCH_USER = 'dsadm'
COUCH_PASSWORD = 'Leptop12'

class DatabaseConnection:
    def __init__(self):
        self.couch = couchdb.Server(COUCH_URL)
        self.couch.resource.credentials = (COUCH_USER, COUCH_PASSWORD)
        self.tickets_db = self._get_or_create_db('tickets')
        self.accounts_db = self._get_or_create_db('accounts')

    def _get_or_create_db(self, db_name: str) -> couchdb.Database:
        try:
            return self.couch.create(db_name)
        except PreconditionFailed:
            return self.couch[db_name]

db = DatabaseConnection()

def error_handler(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except ResourceNotFound:
            return jsonify({'error': 'Ressource nicht gefunden'}), 404
        except ResourceConflict:
            return jsonify({'error': 'Ressourcenkonflikt'}), 409
        except Exception as e:
            app.logger.error(f"Fehler: {str(e)}")
            return jsonify({'error': 'Interner Serverfehler'}), 500
    return decorated_function

def validate_image(file) -> bool:
    return (file and
            allowed_file(file.filename) and
            file.content_length is None or
            file.content_length <= MAX_IMAGE_SIZE)

def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_image(image) -> Optional[Dict]:
    if not validate_image(image):
        return None
    
    filename = secure_filename(image.filename)
    image_data = image.read()
    encoded_image = base64.b64encode(image_data).decode('utf-8')
    return {
        'filename': filename,
        'data': encoded_image
    }

@app.route('/api/tickets', methods=['POST'])
@error_handler
def create_ticket():
    ticket_data = request.get_json() if request.is_json else request.form.to_dict()
    
    # Basis-Ticket-Daten
    ticket_data.update({
        '_id': str(datetime.now().timestamp()),
        'erstellungsdatum': datetime.now().isoformat(),
        'status': 'offen',
        'schlussdatum': None,
        'kommentare': []  # Initialisiere leeres Kommentar-Array
    })

    # Bilder verarbeiten
    encoded_images = []
    if 'images' in request.files:
        for image in request.files.getlist('images'):
            if processed_image := process_image(image):
                encoded_images.append(processed_image)
    elif 'image' in request.files:
        if processed_image := process_image(request.files['image']):
            encoded_images.append(processed_image)

    if encoded_images:
        ticket_data['images'] = encoded_images

    db.tickets_db.save(ticket_data)
    return jsonify({
        'message': 'Ticket erstellt',
        'ticket_id': ticket_data['_id']
    }), 201

@app.route('/api/tickets', methods=['GET'])
@error_handler
def get_tickets():
    status = request.args.get('status')
    tickets = [
        ticket_data for doc_id in db.tickets_db
        if (ticket_data := db.tickets_db.get(doc_id)) and
        (status is None or ticket_data.get('status') == status)
    ]
    return jsonify(tickets)

@app.route('/api/tickets/<ticket_id>', methods=['PUT'])
@error_handler
def update_ticket_status(ticket_id: str):
    ticket_data = db.tickets_db[ticket_id]
    
    if new_status := request.json.get('status'):
        ticket_data.update({
            'status': new_status,
            'schlussdatum': request.json.get('schlussdatum')
        })
        db.tickets_db.save(ticket_data)
    
    return jsonify({
        'message': 'Ticketstatus aktualisiert',
        'ticket_id': ticket_id
    }), 200

@app.route('/api/tickets/<ticket_id>/comments', methods=['POST'])
@error_handler
def add_comment(ticket_id: str):
    ticket_data = db.tickets_db[ticket_id]
    kommentare = ticket_data.get('kommentare', [])
    
    new_comment = {
        'kommentar_id': str(len(kommentare) + 1),
        'inhalt': request.json.get('inhalt'),
        'zeitstempel': datetime.now().isoformat(),
        'autor': request.json.get('autor', 'admin')
    }
    
    kommentare.append(new_comment)
    ticket_data['kommentare'] = kommentare
    db.tickets_db.save(ticket_data)
    
    return jsonify({
        'message': 'Kommentar hinzugefügt',
        'comment': new_comment
    }), 201

@app.route('/accounts', methods=['POST'])
@error_handler
def register_account():
    account_data = request.get_json()
    if not account_data or not account_data.get('name'):
        return jsonify({'error': 'Name ist erforderlich'}), 400

    # Überprüfen auf existierende Accounts
    if any(doc for doc in db.accounts_db 
           if db.accounts_db[doc].get('name') == account_data['name']):
        return jsonify({'error': 'Account existiert bereits'}), 400

    account_data['_id'] = str(datetime.now().timestamp())
    db.accounts_db.save(account_data)
    
    return jsonify({'message': 'Account erfolgreich registriert'}), 200

@app.route('/login', methods=['POST'])
@error_handler
def login():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')

    if not all([name, email]):
        return jsonify({
            'success': False,
            'message': 'Name und E-Mail sind erforderlich.'
        }), 400

    # Account suchen
    for account in db.accounts_db:
        account_data = db.accounts_db[account]
        if (account_data.get('name') == name and 
            account_data.get('email') == email):
            return jsonify({
                'success': True,
                'message': 'Anmeldung erfolgreich.',
                'name': account_data['name'],
                'abteilung': account_data.get('abteilung'),
                'email': account_data['email'],
                'role': account_data.get('role')
            }), 200

    return jsonify({
        'success': False,
        'message': 'Ungültige Anmeldedaten.'
    }), 401

if __name__ == '__main__':
    app.run(debug=True)