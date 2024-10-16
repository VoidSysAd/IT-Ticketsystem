from flask import Flask, request, jsonify
import os
import json
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Füge dies hinzu, um CORS zu aktivieren
tickets_folder = 'tickets'

if not os.path.exists(tickets_folder):
    os.makedirs(tickets_folder)

@app.route('/api/tickets', methods=['POST'])
def create_ticket():
    ticket_data = request.json

    # Automatische ID-Erstellung
    existing_ids = [int(ticket_id) for ticket_id in os.listdir(tickets_folder) if ticket_id.isdigit()]
    new_id = str(max(existing_ids) + 1) if existing_ids else '1'

    # Attribute anpassen
    ticket_data['id'] = new_id
    ticket_data['erstellungsdatum'] = datetime.now().isoformat()  # Erstellungsdatum hinzufügen
    ticket_data['titel'] = ticket_data.pop('titel', '')  # Sicherstellen, dass 'titel' vorhanden ist
    ticket_data['status'] = 'offen'  # Standardstatus auf "offen" setzen
    ticket_data['schlussdatum'] = None  # Standardmäßig kein Schließungsdatum

    # Ordner für das Ticket erstellen
    ticket_path = os.path.join(tickets_folder, new_id)
    if not os.path.exists(ticket_path):
        os.makedirs(ticket_path)

# JSON-Datei speichern - create_ticket()
    with open(os.path.join(ticket_path, 'ticket.json'), 'w') as f:
        json.dump(ticket_data, f, indent=4)  # Mit Einzug (Indentation)

    return jsonify({'message': 'Ticket erstellt', 'ticket_id': new_id}), 201

@app.route('/api/tickets', methods=['GET'])
def get_tickets():
    status = request.args.get('status')  # Status als Query-Parameter (z.B. ?status=offen oder ?status=geschlossen)
    tickets = []

    for ticket_id in os.listdir(tickets_folder):
        ticket_path = os.path.join(tickets_folder, ticket_id, 'ticket.json')
        if os.path.isfile(ticket_path):
            with open(ticket_path, 'r') as f:
                ticket_data = json.load(f)
                if status is None or ticket_data['status'] == status:
                    tickets.append(ticket_data)
    
    return jsonify(tickets)


@app.route('/api/tickets/<ticket_id>', methods=['PUT'])
def update_ticket_status(ticket_id):
    ticket_path = os.path.join(tickets_folder, ticket_id, 'ticket.json')
    if not os.path.isfile(ticket_path):
        return jsonify({'message': 'Ticket nicht gefunden'}), 404

    # Ticket laden und aktualisieren
    with open(ticket_path, 'r') as f:
        ticket_data = json.load(f)

    # Den Status aktualisieren
    new_status = request.json.get('status')
    if new_status:
        ticket_data['status'] = new_status
        if new_status == 'geschlossen':
            ticket_data['schlussdatum'] = datetime.now().isoformat()  # Schließungsdatum setzen

    # Aktualisierte Daten in die JSON-Datei zurückschreiben
    with open(ticket_path, 'w') as f:
        json.dump(ticket_data, f)

    return jsonify({'message': 'Ticketstatus aktualisiert', 'ticket_id': ticket_id}), 200


@app.route('/api/tickets/<ticket_id>/comments', methods=['POST'])
def add_comment(ticket_id):
    ticket_path = os.path.join(tickets_folder, ticket_id, 'ticket.json')
    if not os.path.isfile(ticket_path):
        return jsonify({'message': 'Ticket nicht gefunden'}), 404

    # Ticket laden
    with open(ticket_path, 'r') as f:
        ticket_data = json.load(f)

    # Kommentar-Daten aus der Anfrage laden
    comment_data = request.json
    comment_id = str(len(ticket_data.get('kommentare', [])) + 1)

    # Neuer Kommentar hinzufügen
    new_comment = {
        'kommentar_id': comment_id,
        'inhalt': comment_data.get('inhalt'),
        'zeitstempel': datetime.now().isoformat(),
        'autor': 'admin'
    }

    if 'kommentare' not in ticket_data:
        ticket_data['kommentare'] = []
    ticket_data['kommentare'].append(new_comment)

# JSON-Datei speichern - add_comment()
    with open(ticket_path, 'w') as f:
        json.dump(ticket_data, f, indent=4)  # Mit Einzug (Indentation)

    return jsonify({'message': 'Kommentar hinzugefügt', 'comment': new_comment}), 201



if __name__ == '__main__':
    app.run(debug=True)
