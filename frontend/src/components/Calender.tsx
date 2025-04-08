

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useRef, useCallback, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XCircle, Trash2, Edit2, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EventContent } from "./admin/EventContent";

// Palette de couleurs basée sur #6F42C1 (violet Bootstrap)

const COLOR_PALETTE = {
  primary: "#6F42C1",
  primaryLight: "#9D72E3",
  primaryDark: "#4D2D91",
  secondary: "#F8F9FA",
  accent: "#20C997",
  danger: "#DC3545",
  text: "#212529",
  lightText: "#F8F9FA"
};

const EVENT_TYPE_COLORS: Record<string, string> = {
  meeting: COLOR_PALETTE.primary,
  conference: COLOR_PALETTE.accent,
  workshop: "#FF9F43",
  other: "#6C757D"
};

type Event = {
  _id?: string;
  title: string;
  description: string;
  date_start: string;
  date_end: string;
  location: string;
  eventType: string;
  createdBy?: string;
  eventImage?: string;
  participants?: string[];
};

const API_BASE_URL = "http://localhost:3000/events";

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [modalData, setModalData] = useState<{ 
    event: Event | null; 
    isCreating: boolean 
  }>({ 
    event: null, 
    isCreating: false 
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const calendarRef = useRef<FullCalendar>(null);

  // Convertir les événements pour FullCalendar
  const formatEventsForCalendar = (events: Event[]) => {
    return events.map(event => ({
      id: event._id,
      title: event.title,
      start: event.date_start,
      end: event.date_end,
      color: EVENT_TYPE_COLORS[event.eventType] || COLOR_PALETTE.primary,
      extendedProps: {
        description: event.description,
        location: event.location,
        eventType: event.eventType
      }
    }));
  };

  // Convertir pour l'API
  const formatEventForAPI = (event: any): Event => {
    return {
      title: event.title,
      description: event.extendedProps?.description || '',
      date_start: event.start,
      date_end: event.end,
      location: event.extendedProps?.location || '',
      eventType: event.extendedProps?.eventType || 'meeting'
    };
  };

  // Charger les événements
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error("Erreur lors de la récupération");
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Créer un événement
  const createEvent = useCallback(async (event: Event) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });
      if (!response.ok) throw new Error("Erreur création");
      return await response.json();
    } catch (err) {
      throw err;
    }
  }, []);

  // Mettre à jour un événement
  const updateEvent = useCallback(async (id: string, event: Event) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });
      if (!response.ok) throw new Error("Erreur mise à jour");
      return await response.json();
    } catch (err) {
      throw err;
    }
  }, []);

  // Supprimer un événement
  const deleteEvent = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erreur suppression");
    } catch (err) {
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleEventDrop = useCallback(async ({ event }: any) => {
    const updatedEvent = formatEventForAPI(event);
    try {
      await updateEvent(event.id, updatedEvent);
      await fetchEvents();
    } catch (err) {
      setError("Erreur lors du déplacement");
      await fetchEvents();
    }
  }, [updateEvent, fetchEvents]);

  const handleEventClick = useCallback(({ event }: any) => {
    setModalData({ 
      event: {
        _id: event.id,
        title: event.title,
        description: event.extendedProps.description,
        date_start: event.startStr,
        date_end: event.endStr,
        location: event.extendedProps.location,
        eventType: event.extendedProps.eventType
      },
      isCreating: false 
    });
  }, []);

  const handleDeleteEvent = useCallback(async () => {
    if (!modalData.event?._id) return;
    
    try {
      await deleteEvent(modalData.event._id);
      await fetchEvents();
      setModalData({ event: null, isCreating: false });
    } catch (err) {
      setError("Erreur suppression");
    }
  }, [modalData, deleteEvent, fetchEvents]);

  const handleDateSelect = useCallback(({ startStr, endStr }: any) => {
    setModalData({ 
      event: { 
        title: "",
        description: "",
        date_start: startStr,
        date_end: endStr,
        location: "",
        eventType: "meeting"
      }, 
      isCreating: true 
    });
  }, []);

  const handleSaveEvent = useCallback(async () => {
    if (!modalData.event || !modalData.event.title.trim()) return;

    try {
      if (modalData.isCreating) {
        await createEvent(modalData.event);
      } else if (modalData.event._id) {
        await updateEvent(modalData.event._id, modalData.event);
      }
      await fetchEvents();
      setModalData({ event: null, isCreating: false });
    } catch (err) {
      setError("Erreur enregistrement");
    }
  }, [modalData, createEvent, updateEvent, fetchEvents]);

  const changeView = useCallback((view: string) => {
    calendarRef.current?.getApi()?.changeView(view);
  }, []);

  return (
    <div className="p-4 m-5 min-h-screen w-full" >
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=""
      >
        {/* En-tête et boutons */}
        <div className="flex flex-wrap gap-3 mb-6 items-center justify-between">
         
          
          <div className="flex flex-wrap gap-2">
            {["dayGridMonth", "timeGridWeek", "timeGridDay", "listWeek"].map((view, index) => (
              <motion.button
                key={view}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.5 }}
                onClick={() => changeView(view)}
                className="px-4 py-2 rounded-md  hover:shadow-md"
                style={{
                  backgroundColor: COLOR_PALETTE.primary,
                  color: COLOR_PALETTE.lightText
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {view === "dayGridMonth" ? "Mois" : 
                 view === "timeGridWeek" ? "Semaine" : 
                 view === "timeGridDay" ? "Jour" : "Agenda"}
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={() => setModalData({ 
              event: { 
                title: "",
                description: "",
                date_start: new Date().toISOString(),
                date_end: new Date(Date.now() + 3600000).toISOString(),
                location: "",
                eventType: "meeting"
              }, 
              isCreating: true 
            })}
            className="px-4 py-2 rounded-md transition-all flex items-center gap-2 hover:shadow-md"
            style={{
              backgroundColor: COLOR_PALETTE.accent,
              color: COLOR_PALETTE.text
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={16} /> Nouvel événement
          </motion.button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-3 rounded-md flex justify-between items-center"
              style={{ backgroundColor: COLOR_PALETTE.danger, color: COLOR_PALETTE.lightText }}
            >
              <span>{error}</span>
              <button 
                onClick={() => setError(null)} 
                className="hover:opacity-80 transition-opacity"
              >
                <X size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <motion.div 
            className="flex justify-center items-center h-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="rounded-full h-12 w-12 border-t-2 border-b-2"
              style={{ borderColor: COLOR_PALETTE.primary }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              editable
              selectable
              selectMirror
              dayMaxEvents
              weekends
              nowIndicator
              select={handleDateSelect}
              eventDrop={handleEventDrop}
              eventClick={handleEventClick}
              events={formatEventsForCalendar(events)}
              headerToolbar={false}
              height="70vh"
              eventClassNames="cursor-pointer hover:shadow-md "
              eventContent={(arg) => (
                <EventContent event={arg.event}
                timeText={arg.timeText}/>
    

              )}
            />
          </motion.div>
        )}

        {/* Modal */}
        <Transition appear show={!!modalData.event} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setModalData({ event: null, isCreating: false })}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div 
                className="fixed inset-0 bg-opacity-50 backdrop-blur-sm" 
                style={{ backgroundColor: `${COLOR_PALETTE.primaryDark}30` }}
              />
            </Transition.Child>
            
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel 
                  className="w-full max-w-md rounded-2xl shadow-xl p-6 relative overflow-hidden"
                  style={{ backgroundColor: COLOR_PALETTE.secondary }}
                >
                  <motion.div
                    className="absolute top-0 left-0 w-full h-1"
                    style={{ backgroundColor: EVENT_TYPE_COLORS[modalData.event?.eventType || 'meeting'] }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  
                  <motion.button
                    onClick={() => setModalData({ event: null, isCreating: false })}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <XCircle size={24} />
                  </motion.button>
                  
                  <Dialog.Title 
                    className="text-xl font-bold mb-4"
                    style={{ color: COLOR_PALETTE.primary }}
                  >
                    {modalData.isCreating ? "Nouvel événement" : "Modifier événement"}
                  </Dialog.Title>
                  
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-medium mb-1" style={{ color: COLOR_PALETTE.text }}>Titre*</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:outline-none transition-all"
                        style={{
                          borderColor: COLOR_PALETTE.primaryLight,
                          
                        }}
                        value={modalData.event?.title || ""}
                        onChange={(e) => setModalData(prev => ({ 
                          ...prev, 
                          event: { ...prev.event!, title: e.target.value } 
                        }))}
                        required
                      />
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <label className="block text-sm font-medium mb-1" style={{ color: COLOR_PALETTE.text }}>Description*</label>
                      <textarea
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:outline-none transition-all"
                        style={{
                          borderColor: COLOR_PALETTE.primaryLight,
                        
                        }}
                        value={modalData.event?.description || ""}
                        onChange={(e) => setModalData(prev => ({ 
                          ...prev, 
                          event: { ...prev.event!, description: e.target.value } 
                        }))}
                        required
                      />
                    </motion.div>
                    
                    <motion.div
                      className="grid grid-cols-2 gap-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: COLOR_PALETTE.text }}>Début*</label>
                        <input
                          type="datetime-local"
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:outline-none transition-all"
                          style={{
                            borderColor: COLOR_PALETTE.primaryLight,
                            
                          }}
                          value={modalData.event?.date_start.substring(0, 16) || ''}
                          onChange={(e) => setModalData(prev => ({ 
                            ...prev, 
                            event: { ...prev.event!, date_start: e.target.value } 
                          }))}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: COLOR_PALETTE.text }}>Fin*</label>
                        <input
                          type="datetime-local"
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:outline-none transition-all"
                          style={{
                            borderColor: COLOR_PALETTE.primaryLight,
                           
                          }}
                          value={modalData.event?.date_end.substring(0, 16) || ''}
                          onChange={(e) => setModalData(prev => ({ 
                            ...prev, 
                            event: { ...prev.event!, date_end: e.target.value } 
                          }))}
                          required
                        />
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <label className="block text-sm font-medium mb-1" style={{ color: COLOR_PALETTE.text }}>Lieu*</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:outline-none transition-all"
                        style={{
                          borderColor: COLOR_PALETTE.primaryLight,
                       
                        }}
                        value={modalData.event?.location || ""}
                        onChange={(e) => setModalData(prev => ({ 
                          ...prev, 
                          event: { ...prev.event!, location: e.target.value } 
                        }))}
                        required
                      />
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-sm font-medium mb-1" style={{ color: COLOR_PALETTE.text }}>Type d'événement*</label>
                      <select
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:outline-none transition-all appearance-none"
                        style={{
                          borderColor: COLOR_PALETTE.primaryLight,
                        
                          backgroundColor: COLOR_PALETTE.secondary
                        }}
                        value={modalData.event?.eventType || "meeting"}
                        onChange={(e) => setModalData(prev => ({ 
                          ...prev, 
                          event: { ...prev.event!, eventType: e.target.value } 
                        }))}
                        required
                      >
                        <option value="meeting">Réunion</option>
                        <option value="conference">Conférence</option>
                        <option value="workshop">Atelier</option>
                        <option value="other">Autre</option>
                      </select>
                    </motion.div>
                  </div>
                  
                  <div className="mt-6 flex justify-end gap-3">
                    {!modalData.isCreating && (
                      <motion.button
                        onClick={handleDeleteEvent}
                        className="px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2"
                        style={{ backgroundColor: COLOR_PALETTE.danger }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 size={16} /> Supprimer
                      </motion.button>
                    )}
                    <motion.button
                      onClick={handleSaveEvent}
                      disabled={!modalData.event?.title || 
                               !modalData.event.description || 
                               !modalData.event.date_start || 
                               !modalData.event.date_end || 
                               !modalData.event.location || 
                               !modalData.event.eventType}
                      className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 ${
                        modalData.event?.title && 
                        modalData.event.description && 
                        modalData.event.date_start && 
                        modalData.event.date_end && 
                        modalData.event.location && 
                        modalData.event.eventType
                          ? 'hover:shadow-md' 
                          : 'cursor-not-allowed'
                      }`}
                      style={{
                        backgroundColor: modalData.event?.title && 
                                        modalData.event.description && 
                                        modalData.event.date_start && 
                                        modalData.event.date_end && 
                                        modalData.event.location && 
                                        modalData.event.eventType
                                          ? COLOR_PALETTE.primary
                                          : `${COLOR_PALETTE.primary}80`
                      }}
                      whileHover={{
                        scale: modalData.event?.title && 
                               modalData.event.description && 
                               modalData.event.date_start && 
                               modalData.event.date_end && 
                               modalData.event.location && 
                               modalData.event.eventType
                                 ? 1.05 
                                 : 1
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit2 size={16} /> {modalData.isCreating ? "Créer" : "Enregistrer"}
                    </motion.button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </motion.div>
    </div>
  );
}