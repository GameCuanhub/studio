
import { Book, FlaskConical, History, Landmark, LucideIcon, Sparkles } from "lucide-react";

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
    "IPA (Sains)",
    "IPS (Sejarah, Geografi)",
    "Bahasa Indonesia",
    "Bahasa Inggris",
    "Pendidikan Pancasila (PPKn)",
    "Lainnya",
  ],
  "SMP": [
    "Matematika",
    "IPA Terpadu (Fisika, Biologi)",
    "IPS Terpadu (Sejarah, Geografi, Ekonomi)",
    "Bahasa Indonesia",
    "Bahasa Inggris",
    "Pendidikan Pancasila (PPKn)",
    "Informatika",
    "Seni Budaya",
    "Lainnya",
  ],
  "SMA": [
    "Matematika (Wajib)",
    "Matematika (Peminatan)",
    "Fisika",
    "Kimia",
    "Biologi",
    "Geografi",
    "Sejarah",
    "Sosiologi",
    "Ekonomi",
    "Bahasa Indonesia",
    "Bahasa Inggris",
    "Informatika",
    "Lainnya",
  ],
};

export interface ExamplePrompt {
    icon: string;
    title: string;
    prompt: string;
}

export const EXAMPLE_PROMPTS: { [level: string]: { [subject: string]: ExamplePrompt[] } | ExamplePrompt[] } = {
    Umum: [
        { icon: "Book", title: "Buatkan soal esai", prompt: "Buatkan soal esai tentang sejarah proklamasi kemerdekaan Indonesia." },
        { icon: "FlaskConical", title: "Jelaskan konsep sulit", prompt: "Jelaskan konsep relativitas dengan bahasa yang mudah dipahami." },
        { icon: "Landmark", title: "Beri ide proyek", prompt: "Beri saya 3 ide proyek tentang keragaman budaya di Indonesia." },
        { icon: "History", title: "Buat ringkasan", prompt: "Ringkas bab 5 buku paket Sejarah tentang pendudukan Jepang." }
    ],
    SD: {
        "Matematika": [
            { icon: "Book", title: "Soal cerita perkalian", prompt: "Buatkan 5 soal cerita tentang perkalian untuk anak kelas 3 SD." },
            { icon: "FlaskConical", title: "Jelaskan pecahan", prompt: "Jelaskan apa itu bilangan pecahan dengan contoh kue." },
            { icon: "Landmark", title: "Game matematika", prompt: "Beri ide permainan untuk belajar penjumlahan di kelas 1 SD." },
            { icon: "History", title: "Ringkas bangun datar", prompt: "Sebutkan dan jelaskan ciri-ciri persegi, lingkaran, dan segitiga." }
        ],
        "IPA (Sains)": [
            { icon: "Book", title: "Siklus hidup kupu-kupu", prompt: "Jelaskan tahapan siklus hidup kupu-kupu." },
            { icon: "FlaskConical", title: "Mengapa pelangi muncul?", prompt: "Jelaskan mengapa pelangi bisa muncul setelah hujan." },
            { icon: "Landmark", title: "Proyek tanam kecambah", prompt: "Buat langkah-langkah untuk proyek menanam biji kacang hijau di kapas." },
            { icon: "History", title: "Kelompokkan hewan", prompt: "Kelompokkan hewan berikut berdasarkan makanannya: singa, sapi, beruang, kelinci." }
        ],
        "Umum": [
            { icon: "Book", title: "Buat puisi", prompt: "Buatkan puisi pendek tentang ibu untuk anak SD." },
            { icon: "FlaskConical", title: "Jelaskan gotong royong", prompt: "Apa arti penting dari gotong royong di masyarakat?" },
            { icon: "Landmark", title: "Tugas PPKn", prompt: "Sebutkan 3 contoh sikap yang sesuai dengan sila pertama Pancasila." },
            { icon: "History", title: "Cerita fabel", prompt: "Buatkan cerita fabel singkat tentang kancil dan buaya." }
        ]
    },
    SMP: {
        "Matematika": [
            { icon: "Book", title: "Soal aljabar", prompt: "Buatkan 3 soal persamaan linear dua variabel dan cara menyelesaikannya." },
            { icon: "FlaskConical", title: "Teorema Pythagoras", prompt: "Jelaskan Teorema Pythagoras dan berikan contoh soalnya." },
            { icon: "Landmark", title: "Proyek bangun ruang", prompt: "Beri ide proyek membuat jaring-jaring kubus dan balok dari karton." },
            { icon: "History", title: "Ringkas materi statistik", prompt: "Apa perbedaan antara mean, median, dan modus? Berikan contohnya." }
        ],
        "IPA Terpadu (Fisika, Biologi)": [
            { icon: "Book", title: "Sistem pernapasan", prompt: "Jelaskan organ-organ dalam sistem pernapasan manusia beserta fungsinya." },
            { icon: "FlaskConical", title: "Konsep fotosintesis", prompt: "Jelaskan proses fotosintesis pada tumbuhan dengan bahasa sederhana." },
            { icon: "Landmark", title: "Percobaan tekanan udara", prompt: "Rancang sebuah percobaan sederhana untuk membuktikan adanya tekanan udara." },
            { icon: "History", title: "Rantai makanan", prompt: "Gambarkan contoh rantai makanan di ekosistem sawah." }
        ],
        "Umum": [
            { icon: "Book", title: "Debat tentang media sosial", prompt: "Berikan 3 argumen pro dan 3 argumen kontra tentang penggunaan media sosial bagi remaja." },
            { icon: "FlaskConical", title: "Pemanasan global", prompt: "Apa penyebab utama pemanasan global dan apa dampaknya bagi bumi?" },
            { icon: "Landmark", title: "Ide mading sekolah", prompt: "Beri 5 ide tema untuk mading sekolah yang menarik." },
            { icon: "History", title: "Perang Diponegoro", prompt: "Ringkas secara singkat latar belakang terjadinya Perang Diponegoro." }
        ]
    },
    SMA: {
        "Fisika": [
            { icon: "Book", title: "Soal Hukum Newton", prompt: "Buatkan soal essay mengenai penerapan Hukum II Newton dalam kehidupan sehari-hari." },
            { icon: "FlaskConical", title: "Konsep dualisme gelombang-partikel", prompt: "Jelaskan konsep dualisme gelombang-partikel pada cahaya." },
            { icon: "Landmark", title: "Proyek roket air", prompt: "Berikan rancangan dan prinsip fisika di balik pembuatan roket air sederhana." },
            { icon: "History", title: "Ringkas teori relativitas khusus", prompt: "Apa saja postulat utama dalam teori relativitas khusus Einstein?" }
        ],
        "Kimia": [
            { icon: "Book", title: "Penyetaraan reaksi redoks", prompt: "Setarakan reaksi redoks berikut: MnO4- + C2O4^2- -> Mn^2+ + CO2." },
            { icon: "FlaskConical", title: "Jelaskan ikatan hidrogen", prompt: "Apa itu ikatan hidrogen dan mengapa ia penting? Berikan contoh senyawanya." },
            { icon: "Landmark", title: "Praktikum laju reaksi", prompt: "Rancang percobaan untuk mengetahui faktor-faktor yang memengaruhi laju reaksi." },
            { icon: "History", title: "Model atom", prompt: "Jelaskan perkembangan model atom dari Dalton hingga mekanika kuantum." }
        ],
        "Sejarah": [
            { icon: "Book", title: "Analisis dampak Revolusi Industri", prompt: "Buatlah analisis mengenai dampak sosial dan ekonomi dari Revolusi Industri di Eropa." },
            { icon: "FlaskConical", title: "Bandingkan Orde Lama dan Orde Baru", prompt: "Bandingkan kebijakan politik luar negeri Indonesia pada masa Orde Lama dan Orde Baru." },
            { icon: "Landmark", title: "Ide riset sejarah lokal", prompt: "Berikan 3 ide penelitian sejarah yang bisa dilakukan di lingkungan sekitar tempat tinggalku." },
            { icon: "History", title: "Peran Indonesia di GNB", prompt: "Jelaskan peran penting Indonesia dalam pendirian Gerakan Non-Blok." }
        ],
        "Umum": [
            { icon: "Book", title: "Tulis esai argumentatif", prompt: "Tulis sebuah esai argumentatif dengan tema 'Pentingnya Literasi Digital di Era Informasi'." },
            { icon: "FlaskConical", title: "Analisis SWOT diri", prompt: "Bagaimana cara melakukan analisis SWOT (Strengths, Weaknesses, Opportunities, Threats) untuk pengembangan diri?" },
            { icon: "Landmark", title: "Proposal kegiatan OSIS", prompt: "Buatkan kerangka proposal untuk kegiatan 'Pekan Olahraga dan Seni' di sekolah." },
            { icon: "History", title: "Isu kesehatan mental", prompt: "Jelaskan pentingnya menjaga kesehatan mental bagi siswa SMA dan cara-caranya." }
        ]
    }
};

    