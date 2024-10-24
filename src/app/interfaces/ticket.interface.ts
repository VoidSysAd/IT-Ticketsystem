// interfaces/ticket.interface.ts
export interface Ticket {
  _id: string;
  titel: string;
  beschreibung: string; // Dies wird im HTML als 'description' verwendet
  ersteller: string;
  zugewiesenerBenutzer?: string;
  status: 'offen' | 'geschlossen';
  prioritaet: string; // Dies wird im HTML als 'level' verwendet
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
}
