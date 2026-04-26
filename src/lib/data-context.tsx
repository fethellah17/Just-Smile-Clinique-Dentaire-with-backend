import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Patient, RendezVous, Acte, Category, PaymentRecord, PassageDirect } from "@/lib/mock-data";
import { actes as initialActes, passagesDirects as initialPassagesDirects } from "@/lib/mock-data";
import { categoryApi, patientApi, rendezVousApi, checkApiHealth } from "@/lib/api";

interface DataContextType {
  patients: Patient[];
  rendezVous: RendezVous[];
  passagesDirects: PassageDirect[];
  actes: Acte[];
  categories: Category[];
  isLoaded: boolean;
  apiError: string | null;
  
  // Patient operations
  addPatient: (patient: Omit<Patient, "id" | "dateCreation">) => Promise<Patient>;
  updatePatient: (id: string, updates: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  
  // Payment operations
  addPayment: (patientId: string, payment: Omit<PaymentRecord, "id" | "locked">) => PaymentRecord;
  
  // RendezVous operations
  addRendezVous: (rdv: Omit<RendezVous, "id">) => Promise<RendezVous>;
  updateRendezVous: (id: string, updates: Partial<RendezVous>) => Promise<void>;
  deleteRendezVous: (id: string) => Promise<void>;
  toggleRendezVousStatut: (id: string) => Promise<void>;
  archiveRendezVousByDate: (date: string) => void;
  
  // PassageDirect operations
  addPassageDirect: (passage: Omit<PassageDirect, "id">) => PassageDirect;
  updatePassageDirect: (id: string, updates: Partial<PassageDirect>) => void;
  deletePassageDirect: (id: string) => void;
  
  // Acte operations
  addActe: (acte: Omit<Acte, "id" | "resteAPayer">) => Acte;
  updateActe: (id: string, updates: Partial<Acte>) => void;
  deleteActe: (id: string) => void;
  
  // Category operations
  addCategory: (category: Omit<Category, "id">) => Promise<Category>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode}) {
  // State
  const [patients, setPatients] = useState<Patient[]>([]);
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([]);
  const [passagesDirects, setPassagesDirects] = useState<PassageDirect[]>(initialPassagesDirects ?? []);
  const [actes, setActes] = useState<Acte[]>(initialActes ?? []);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch all data from API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if API is online
        const isOnline = await checkApiHealth();
        if (!isOnline) {
          setApiError('Backend server is offline. Please start the API server.');
          setCategories([]);
          setPatients([]);
          setRendezVous([]);
          setIsLoaded(true);
          return;
        }

        // Fetch categories
        const categoriesData = await categoryApi.getAll();
        const categoriesWithDefaults = (categoriesData || []).map(cat => ({
          ...cat,
          types: Array.isArray(cat.types) ? cat.types : [],
          stages: Array.isArray(cat.stages) ? cat.stages : [],
        }));
        setCategories(categoriesWithDefaults);

        // Fetch patients
        const patientsData = await patientApi.getAll();
        setPatients(patientsData || []);

        // Fetch ALL rendez-vous (both active and archived)
        const [activeRdv, archivedRdv] = await Promise.all([
          rendezVousApi.getAll(false), // Active appointments
          rendezVousApi.getAll(true),  // Archived appointments
        ]);
        
        // Combine both active and archived appointments and remove duplicates by ID
        const allAppointments = [...(activeRdv || []), ...(archivedRdv || [])];
        const uniqueAppointments = allAppointments.filter((rdv, index, self) =>
          index === self.findIndex((r) => r.id === rdv.id)
        );
        
        setRendezVous(uniqueAppointments);

        setApiError(null);
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        
        // Force state reset on 500 errors
        setApiError('Failed to connect to backend. Please ensure the API server is running.');
        setCategories([]);
        setPatients([]);
        setRendezVous([]);
        setIsLoaded(true);
      }
    };

    fetchData();
  }, []);

  // Auto-clear passages directs when all are processed
  useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const todayPassages = (passagesDirects || []).filter((p) => p.date === todayStr);
    const pendingPassages = todayPassages.filter((p) => p.statut === "en attente");
    
    // If there are passages today but none pending, clear all today's passages
    if (todayPassages.length > 0 && pendingPassages.length === 0) {
      setPassagesDirects((prev) => (prev || []).filter((p) => p.date !== todayStr));
    }
  }, [passagesDirects]);

  // Patient operations
  const addPatient = async (patient: Omit<Patient, "id" | "dateCreation">) => {
    try {
      const newId = String(Math.max(...((patients || []).map(p => parseInt(p.id)) ?? [0]), 0) + 1);
      
      const patientData = {
        id: newId,
        ...patient,
        stepsCompleted: patient.stepsCompleted || [],
        dateCreation: new Date().toISOString().split('T')[0],
      };
      
      const newPatient = await patientApi.create(patientData);
      setPatients([newPatient, ...(patients || [])]);
      return newPatient;
    } catch (error) {
      console.error('Failed to add patient:', error);
      throw error;
    }
  };

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    try {
      const updated = await patientApi.update(id, updates);
      setPatients((patients || []).map(p => p.id === id ? updated : p));
    } catch (error) {
      console.error('Failed to update patient:', error);
      throw error;
    }
  };

  const deletePatient = async (id: string) => {
    try {
      await patientApi.delete(id);
      setPatients((patients || []).filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete patient:', error);
      throw error;
    }
  };

  // Payment operations
  const addPayment = (patientId: string, payment: Omit<PaymentRecord, "id" | "locked">) => {
    const paymentRecord: PaymentRecord = {
      ...payment,
      id: `payment-${Date.now()}`,
      locked: true, // Always locked when created
    };

    setPatients((patients ?? []).map(p => {
      if (p.id === patientId) {
        const newMontantPaye = (p.montantPaye || 0) + payment.amount;
        return {
          ...p,
          montantPaye: newMontantPaye,
          paymentHistory: [...(p.paymentHistory || []), paymentRecord],
        };
      }
      return p;
    }));

    return paymentRecord;
  };

  // RendezVous operations
  const addRendezVous = async (rdv: Omit<RendezVous, "id">) => {
    try {
      // Don't generate ID on frontend - let backend handle it
      const rendezVousData = {
        ...rdv,
      };
      
      const newRdv = await rendezVousApi.create(rendezVousData);
      
      // Check if appointment already exists in state (prevent ghost duplicates)
      const exists = rendezVous.some(r => r.id === newRdv.id);
      if (!exists) {
        setRendezVous([...(rendezVous || []), newRdv]);
      }
      
      return newRdv;
    } catch (error) {
      console.error('Failed to add rendez-vous:', error);
      throw error;
    }
  };

  const updateRendezVous = async (id: string, updates: Partial<RendezVous>) => {
    try {
      const updated = await rendezVousApi.update(id, updates);
      setRendezVous((rendezVous || []).map(r => r.id === id ? updated : r));
    } catch (error) {
      console.error('Failed to update rendez-vous:', error);
      throw error;
    }
  };

  const deleteRendezVous = async (id: string) => {
    try {
      await rendezVousApi.delete(id);
      setRendezVous((rendezVous || []).filter(r => r.id !== id));
    } catch (error) {
      console.error('Failed to delete rendez-vous:', error);
      throw error;
    }
  };

  const toggleRendezVousStatut = async (id: string) => {
    try {
      const rdv = rendezVous.find(r => r.id === id);
      if (!rdv) return;
      
      const newStatut = rdv.statut === "confirmé" ? "en attente" : "confirmé";
      await updateRendezVous(id, { statut: newStatut });
    } catch (error) {
      console.error('Failed to toggle rendez-vous status:', error);
      throw error;
    }
  };

  const archiveRendezVousByDate = async (date: string) => {
    try {
      await rendezVousApi.archiveByDate(date);
      
      // Update local state to reflect the archived appointments
      // Only archive appointments that are confirmed or cancelled (not pending)
      setRendezVous((rendezVous ?? []).map(r => {
        if (r.date === date && !r.archived && (r.statut === 'confirmé' || r.statut === 'annulé')) {
          return { ...r, archived: true };
        }
        return r;
      }));
    } catch (error) {
      console.error('Failed to archive rendez-vous:', error);
      throw error;
    }
  };

  // PassageDirect operations
  const addPassageDirect = (passage: Omit<PassageDirect, "id">) => {
    const newPassage: PassageDirect = {
      ...passage,
      id: String(Math.max(...(passagesDirects?.map(p => parseInt(p.id)) ?? [0]), 0) + 1),
    };
    setPassagesDirects([...(passagesDirects ?? []), newPassage]);
    return newPassage;
  };

  const updatePassageDirect = (id: string, updates: Partial<PassageDirect>) => {
    setPassagesDirects((passagesDirects ?? []).map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePassageDirect = (id: string) => {
    setPassagesDirects((passagesDirects ?? []).filter(p => p.id !== id));
  };

  // Acte operations
  const addActe = (acte: Omit<Acte, "id" | "resteAPayer">) => {
    const newActe: Acte = {
      ...acte,
      id: String(Math.max(...(actes?.map(a => parseInt(a.id)) ?? [0]), 0) + 1),
      resteAPayer: acte.montantTotal - acte.montantVerse,
    };
    setActes([...(actes ?? []), newActe]);
    return newActe;
  };

  const updateActe = (id: string, updates: Partial<Acte>) => {
    setActes((actes ?? []).map(a => {
      if (a.id === id) {
        const updated = { ...a, ...updates };
        return {
          ...updated,
          resteAPayer: updated.montantTotal - updated.montantVerse,
        };
      }
      return a;
    }));
  };

  const deleteActe = (id: string) => {
    setActes((actes ?? []).filter(a => a.id !== id));
  };

  // Category operations
  const addCategory = async (category: Omit<Category, "id">) => {
    try {
      // Generate a unique ID for the new category
      const newId = String(Math.max(...((categories || []).map(c => parseInt(c.id)) ?? [0]), 0) + 1);
      
      const categoryData = {
        id: newId,
        ...category,
      };
      
      const newCategory = await categoryApi.create(categoryData);
      
      // Ensure the response has the correct structure
      const categoryWithDefaults = {
        ...newCategory,
        types: Array.isArray(newCategory.types) ? newCategory.types : [],
        stages: Array.isArray(newCategory.stages) ? newCategory.stages : [],
      };
      
      // Update local state
      setCategories([...(categories || []), categoryWithDefaults]);
      return categoryWithDefaults;
    } catch (error) {
      console.error('Failed to add category:', error);
      throw error;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const updatedCategory = await categoryApi.update(id, updates);
      
      // Ensure the response has the correct structure
      const categoryWithDefaults = {
        ...updatedCategory,
        types: Array.isArray(updatedCategory.types) ? updatedCategory.types : [],
        stages: Array.isArray(updatedCategory.stages) ? updatedCategory.stages : [],
      };
      
      // Update local state with the full response from server
      setCategories((categories || []).map(c => c.id === id ? categoryWithDefaults : c));
    } catch (error) {
      console.error('Failed to update category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await categoryApi.delete(id);
      
      // Update local state
      setCategories((categories || []).filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw error;
    }
  };

  const value: DataContextType = {
    patients: patients ?? [],
    rendezVous: rendezVous ?? [],
    passagesDirects: passagesDirects ?? [],
    actes: actes ?? [],
    categories: categories ?? [],
    isLoaded,
    apiError,
    addPatient,
    updatePatient,
    deletePatient,
    addPayment,
    addRendezVous,
    updateRendezVous,
    deleteRendezVous,
    toggleRendezVousStatut,
    archiveRendezVousByDate,
    addPassageDirect,
    updatePassageDirect,
    deletePassageDirect,
    addActe,
    updateActe,
    deleteActe,
    addCategory,
    updateCategory,
    deleteCategory,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
