// interfaces/ticket.interface.ts
export interface Ticket {
  _id: string;
  titel: string;
  beschreibung: string;
  ersteller: string;
  zugewiesenerBenutzer?: string;
  status: 'offen' | 'geschlossen';
  prioritaet: string;
  erstellungsdatum: string;
  schlussdatum?: string;
  kommentare?: Array<{
    inhalt: string;
    ersteller: string;
    erstellungsdatum: string;
  }>;
  anhaenge?: Array<{
    filename: string;
    pfad: string;
  }>;
  
  bildBase64?: string;  // Füge dies hinzu, um das Base64-Bild zu speichern
}
