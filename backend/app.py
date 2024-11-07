import base64
from flask import Flask, request, jsonify
import couchdb
from couchdb.http import ResourceNotFound, ResourceConflict, PreconditionFailed
from flask_cors import CORS
from datetime import datetime
from functools import wraps
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}}, supports_credentials=True, methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# Singleton-Klasse für die CouchDB-Verbindung
class DatabaseConnection:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabaseConnection, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance
    
    def _initialize(self):
        # CouchDB läuft auf Port 5984
        self.couch = couchdb.Server('http://localhost:5984/')
        self.couch.resource.credentials = ('dsadm', 'Leptop12')  # Zugangsdaten hier anpassen
        self.tickets_db = self._get_or_create_db('tickets')
        self.accounts_db = self._get_or_create_db('accounts')
    
    def _get_or_create_db(self, db_name: str) -> couchdb.Database:
        try:
            return self.couch.create(db_name)
        except PreconditionFailed:
            return self.couch[db_name]

# Globale Datenbankinstanz
db = DatabaseConnection()

@app.before_request
def handle_preflight():
    if request.method == 'OPTIONS':
        response = app.make_default_options_response()
        headers = None
        if 'Access-Control-Request-Headers' in request.headers:
            headers = request.headers['Access-Control-Request-Headers']
        response.headers.add('Access-Control-Allow-Headers', headers)
        response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
        return response

# Dekorator für Fehlerbehandlung
def error_handler(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except ResourceNotFound:
            return jsonify({'error': 'Ressource nicht gefunden'}), 404
        except ResourceConflict:
            return jsonify({'error': 'Konflikt bei der Ressource'}), 409
        except Exception as e:
            app.logger.error(f"Fehler: {str(e)}")
            return jsonify({'error': 'Interner Serverfehler'}), 500
    return decorated_function

@app.route('/api/tickets/<ticket_id>/assign', methods=['PUT'])
@error_handler
def assign_ticket(ticket_id):
    try:
        ticket = db.tickets_db[ticket_id]
        user_id = request.json.get('userId')
        if not user_id:
            return jsonify({'error': 'Benutzer-ID ist erforderlich'}), 400
        
        user = db.accounts_db.get(user_id)
        if not user:
            return jsonify({'error': 'Benutzer nicht gefunden'}), 404
            
        ticket['zugewiesenerBenutzer'] = user['name']
        db.tickets_db.save(ticket)
        
        return jsonify({
            'message': 'Ticket erfolgreich zugewiesen',
            'ticket_id': ticket_id,
            'assigned_to': user['name']
        }), 200
        
    except ResourceNotFound:
        return jsonify({'error': 'Ticket nicht gefunden'}), 404


# Endpunkt für den Login
@app.route('/api/login', methods=['POST'])
@error_handler
def login():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')

    print(f"Login attempt: name={name}, email={email}")

    if not name or not email:
        return jsonify({
            'success': False,
            'message': 'Name und E-Mail sind erforderlich.'
        }), 400

    for account_id in db.accounts_db:
        account_data = db.accounts_db[account_id]
        print(f"Checking account: {account_data}")
        if account_data.get('name') == name and account_data.get('email') == email:
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


# Endpunkt zum Abrufen aller Benutzer
@app.route('/api/users', methods=['GET'])
@error_handler
def get_users():
    try:
        users = []
        for doc_id in db.accounts_db:
            user = db.accounts_db[doc_id]
            users.append({
                '_id': user['_id'],
                'name': user['name'],
                'email': user['email'],
                'abteilung': user.get('abteilung'),
                'role': user.get('role')
            })
        return jsonify(users), 200
    except Exception as e:
        app.logger.error(f"Fehler beim Abrufen der Benutzer: {str(e)}")
        return jsonify({'error': 'Fehler beim Abrufen der Benutzer'}), 500


@app.route('/api/tickets', methods=['POST'])
@error_handler
def create_ticket():
    try:
        data = request.json
        titel = data.get('titel')
        beschreibung = data.get('beschreibung')
        prioritaet = data.get('prioritaet')
        erstellungsdatum = data.get('erstellungsdatum')
        status = data.get('status')
        bild_base64 = data.get('bildBase64')  # Base64-encoded image
        ersteller = data.get('ersteller')  # Neu hinzugefügt

        app.logger.info(f"Ticket-Daten: Titel={titel}, Beschreibung={beschreibung}, Priorität={prioritaet}, Status={status}, BildBase64 vorhanden: {bool(bild_base64)}")

        if not titel or not beschreibung or not prioritaet:
            app.logger.error("Fehlende Ticket-Daten")
            return jsonify({'error': 'Titel, Beschreibung und Priorität sind erforderlich'}), 400

        # Bild in Base64 speichern
        bild_pfad = None
        if bild_base64:
            bild_pfad = bild_base64  # Das Bild bleibt im Base64-Format und wird direkt in der Datenbank gespeichert.

        # Ticket erstellen
        new_ticket = {
            '_id': str(datetime.now().timestamp()),
            'titel': titel,
            'beschreibung': beschreibung,
            'prioritaet': prioritaet,
            'status': status,
            'erstellungsdatum': erstellungsdatum,
            'bild_base64': bild_pfad,  # Bild in der Datenbank als Base64-String speichern
            'ersteller': ersteller  # Neu hinzugefügt
        }

        db.tickets_db.save(new_ticket)

        return jsonify({'message': 'Ticket erfolgreich erstellt', 'ticket_id': new_ticket['_id']}), 201

    except Exception as e:
        app.logger.error(f"Fehler beim Erstellen des Tickets: {str(e)}")
        return jsonify({'error': 'Fehler beim Erstellen des Tickets'}), 500


@app.route('/api/tickets', methods=['GET'])
@error_handler
def get_tickets():
    try:
        tickets = []
        for doc_id in db.tickets_db:
            ticket = db.tickets_db[doc_id]
            app.logger.info(f"Ticket {ticket['_id']} - Bild vorhanden: {'bild_base64' in ticket}")
            tickets.append({
                '_id': ticket['_id'],
                'titel': ticket.get('titel', 'Kein Titel'),
                'beschreibung': ticket.get('beschreibung', 'Keine Beschreibung'),
                'prioritaet': ticket.get('prioritaet', 'normal'),
                'status': ticket.get('status', 'offen'),
                'erstellungsdatum': ticket.get('erstellungsdatum', ''),
                'zugewiesenerBenutzer': ticket.get('zugewiesenerBenutzer', 'Niemand'),
                'schlussdatum': ticket.get('schlussdatum', None),
                'kommentare': ticket.get('kommentare', []),
                'bildBase64': ticket.get('bild_base64', None),  # Hier wird jetzt 'bild_base64' verwendet
                'ersteller': ticket.get('ersteller', 'Unbekannt')
            })
        return jsonify(tickets), 200
    except Exception as e:
        app.logger.error(f"Fehler beim Abrufen der Tickets: {str(e)}")
        return jsonify({'error': 'Fehler beim Abrufen der Tickets'}), 500




@app.route('/api/tickets/<ticket_id>/comments', methods=['POST'])
def add_comment(ticket_id):
    try:
        ticket = db.tickets_db[ticket_id]
        comment = request.json.get('inhalt', '').strip()
        current_user = request.json.get('current_user', 'Anonymous')

        if not comment:
            return jsonify({'error': 'Leerer Kommentar'}), 400
        
        comment_data = {
            'inhalt': comment,
            'ersteller': current_user,
            'erstellungsdatum': datetime.now().isoformat()
        }

        if 'kommentare' not in ticket:
            ticket['kommentare'] = []

        ticket['kommentare'].append(comment_data)
        db.tickets_db.save(ticket)

        return jsonify({'comment': comment_data}), 200
    except ResourceNotFound:
        return jsonify({'error': 'Ticket nicht gefunden'}), 404
    except Exception as e:
        return jsonify({'error': 'Fehler beim Hinzufügen des Kommentars', 'details': str(e)}), 500


@app.route('/api/tickets/<ticket_id>', methods=['PUT'])
@error_handler
def update_ticket(ticket_id):
    try:
        ticket = db.tickets_db[ticket_id]
        update_data = request.json

        # Aktualisiere den Status des Tickets
        if 'status' in update_data:
            ticket['status'] = update_data['status']
            if update_data['status'] == 'geschlossen':
                ticket['schlussdatum'] = datetime.now().isoformat()
            else:
                ticket['schlussdatum'] = None

        # Aktualisiere weitere Felder falls notwendig
        db.tickets_db.save(ticket)
        return jsonify(ticket), 200
    except ResourceNotFound:
        return jsonify({'error': 'Ticket nicht gefunden'}), 404

@app.route('/api/accounts', methods=['POST'])
@error_handler
def create_account():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    abteilung = data.get('abteilung')
    role = data.get('role', 'user')  # Standardrolle 'user', falls nicht angegeben

    if not name or not email or not abteilung:
        return jsonify({'error': 'Name, Abteilung und E-Mail sind erforderlich'}), 400

    # Erstelle das Account-Dokument
    new_account = {
        '_id': str(datetime.now().timestamp()),
        'name': name,
        'email': email,
        'abteilung': abteilung,
        'role': role
    }

    try:
        db.accounts_db.save(new_account)
        return jsonify({'message': 'Account erfolgreich erstellt', 'account_id': new_account['_id']}), 201
    except ResourceConflict:
        return jsonify({'error': 'Ein Account mit dieser ID existiert bereits'}), 409
    except Exception as e:
        app.logger.error(f"Fehler beim Erstellen des Accounts: {str(e)}")
        return jsonify({'error': 'Fehler beim Erstellen des Accounts'}), 500


# Flask wird auf Port 5000 ausgeführt
if __name__ == '__main__':
    app.run(debug=True, port=5000)
