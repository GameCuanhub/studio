
import { Book, FlaskConical, History, Landmark, LucideIcon, Sparkles, Scale, Languages, Handshake } from "lucide-react";

export const CLASS_LEVELS = [
    "SD Kelas 1",
    "SD Kelas 2",
    "SD Kelas 3",
    "SD Kelas 4",
    "SD Kelas 5",
    "SD Kelas 6",
    "SMP Kelas 7",
    "SMP Kelas 8",
    "SMP Kelas 9",
    "SMA Kelas 10",
    "SMA Kelas 11",
    "SMA Kelas 12"
];

export const SUBJECTS_BY_LEVEL = {
  "SD": [
    "Matematika",
    "Bahasa Indonesia",
    "Pendidikan Pancasila (PPKn)",
    "IPA (Sains)",
    "IPS (Sejarah, Geografi)",
    "Seni Budaya dan Prakarya (SBdP)",
    "Pendidikan Jasmani (PJOK)",
    "Lainnya",
  ],
  "SMP": [
    "Matematika",
    "IPA Terpadu (Fisika, Biologi)",
    "IPS Terpadu (Sejarah, Geografi, Ekonomi)",
    "Bahasa Indonesia",
    "Bahasa Inggris",
    "Pendidikan Pancasila (PPKn)",
    "Informatika (TIK)",
    "Seni Budaya",
    "Prakarya",
    "Pendidikan Jasmani (PJOK)",
    "Lainnya",
  ],
  "SMA": [
    "Matematika (Wajib)",
    "Bahasa Indonesia",
    "Bahasa Inggris",
    "Pendidikan Pancasila (PPKn)",
    "Sejarah Indonesia",
    "Pendidikan Agama",
    "--- Peminatan MIPA ---",
    "Matematika (Peminatan)",
    "Fisika",
    "Kimia",
    "Biologi",
    "--- Peminatan IPS ---",
    "Geografi",
    "Sejarah (Peminatan)",
    "Sosiologi",
    "Ekonomi",
    "--- Lainnya ---",
    "Informatika",
    "Seni Budaya",
    "Lainnya",
  ],
};

export interface ExamplePrompt {
    icon: string;
    title: string;
    prompt: string;
}

export const ICONS: { [key: string]: LucideIcon } = {
    Book,
    FlaskConical,
    History,
    Landmark,
    Sparkles,
    Scale,
    Languages,
    Handshake
};
