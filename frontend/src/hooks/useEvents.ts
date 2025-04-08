import { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:3000/events";

export type Event = {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
};

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer tous les événements
  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error("Erreur lors de la récupération des événements");
      setEvents(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  // Créer un événement
  const createEvent = async (event: Omit<Event, "id">) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });
      if (!response.ok) throw new Error("Erreur lors de la création de l'événement");
      const newEvent = await response.json();
      setEvents(prev => [...prev, newEvent]);
    } catch (err) {
      setError("Impossible de créer l'événement.");
    }
  };

  // Mettre à jour un événement
  const updateEvent = async (event: Event) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${event.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour");
      const updatedEvent = await response.json();
      setEvents(prev => prev.map(evt => (evt.id === updatedEvent.id ? updatedEvent : evt)));
    } catch (err) {
      setError("Échec de la mise à jour.");
    }
  };

  // Supprimer un événement
  const deleteEvent = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Erreur de suppression");
      setEvents(prev => prev.filter(evt => evt.id !== id));
    } catch (err) {
      setError("Impossible de supprimer.");
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  return { events, isLoading, error, fetchEvents, createEvent, updateEvent, deleteEvent, setError };
}
