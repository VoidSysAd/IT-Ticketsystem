from flask import Flask, request, jsonify
import os
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Füge dies hinzu, um CORS zu aktivieren
tickets_folder = 'tickets'

if not os.path.exists(tickets_folder):
    os.makedirs(tickets_folder)

@app.route('/api/tickets', methods=['GET'])
def get_tickets():
    tickets = []
    for ticket_id in os.listdir(tickets_folder):
        ticket_path = os.path.join(tickets_folder, ticket_id, 'ticket.json')
        if os.path.isfile(ticket_path):
            with open(ticket_path, 'r') as f:
                ticket_data = json.load(f)
                tickets.append(ticket_data)
    return jsonify(tickets)

# Vorherige POST-Methode zum Erstellen von Tickets
@app.route('/api/tickets', methods=['POST'])
def create_ticket():
    ticket_data = request.json
    ticket_id = ticket_data['id']

    # Ordner für das Ticket erstellen
    ticket_path = os.path.join(tickets_folder, ticket_id)
    if not os.path.exists(ticket_path):
        os.makedirs(ticket_path)

    # JSON-Datei speichern
    with open(os.path.join(ticket_path, 'ticket.json'), 'w') as f:
        json.dump(ticket_data, f)

    return jsonify({'message': 'Ticket erstellt', 'ticket_id': ticket_id}), 201

if __name__ == '__main__':
    app.run(debug=True)
