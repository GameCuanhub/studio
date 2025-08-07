
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

export const EXAMPLE_PROMPTS: { [level: string]: { [subject: string]: ExamplePrompt[] } | ExamplePrompt[] } = {
    Umum: [
        { icon: "Book", title: "Buatkan soal esai", prompt: "Buatkan soal esai tentang sejarah proklamasi kemerdekaan Indonesia." },
        { icon: "FlaskConical", title: "Jelaskan konsep sulit", prompt: "Jelaskan konsep relativitas dengan bahasa yang mudah dipahami." },
        { icon: "Landmark", title: "Beri ide proyek", prompt: "Beri saya 3 ide proyek tentang keragaman budaya di Indonesia." },
        { icon: "History", title: "Buat ringkasan", prompt: "Ringkas bab 5 buku paket Sejarah tentang pendudukan Jepang." }
    ],
    SD: {
        "Matematika": [
            { icon: "Book", title: "Soal cerita penjumlahan", prompt: "Ibu punya 5 apel, ayah memberinya 3 apel lagi. Berapa total apel ibu? Buatkan 3 soal serupa." },
            { icon: "FlaskConical", title: "Jelaskan bangun datar", prompt: "Jelaskan perbedaan antara persegi dan persegi panjang dengan gambar sederhana." },
            { icon: "Landmark", title: "Game menghitung", prompt: "Beri ide permainan seru untuk belajar berhitung sampai 20." },
            { icon: "History", title: "Konsep perkalian", prompt: "Jelaskan konsep perkalian sebagai penjumlahan berulang untuk anak kelas 2." }
        ],
        "IPA (Sains)": [
            { icon: "Book", title: "Bagian tubuh tumbuhan", prompt: "Sebutkan bagian-bagian utama dari tumbuhan (akar, batang, daun) dan fungsinya." },
            { icon: "FlaskConical", title: "Mengapa siang dan malam?", prompt: "Jelaskan dengan sederhana mengapa ada siang dan malam." },
            { icon: "Landmark", title: "Proyek siklus air", prompt: "Buat langkah-langkah membuat diorama sederhana siklus air." },
            { icon: "History", title: "Kelompokkan hewan", prompt: "Kelompokkan hewan berdasarkan jenis makanannya (herbivora, karnivora, omnivora)." }
        ],
        "Pendidikan Pancasila (PPKn)": [
            { icon: "Handshake", title: "Contoh Sila ke-2", prompt: "Sebutkan 3 contoh sikap menolong teman di sekolah yang sesuai sila kedua Pancasila." },
            { icon: "Scale", title: "Aturan di Rumah", prompt: "Apa saja aturan yang harus dipatuhi di rumah? Sebutkan tiga." },
            { icon: "Landmark", title: "Arti simbol Bintang", prompt: "Jelaskan arti dari simbol bintang pada sila pertama Pancasila." },
            { icon: "History", title: "Manfaat hidup rukun", prompt: "Apa manfaatnya jika kita hidup rukun dengan semua teman?" }
        ],
        "Bahasa Indonesia": [
            { icon: "Book", title: "Menyusun kalimat", prompt: "Susun kata-kata acak berikut menjadi kalimat yang benar: 'bermain - saya - bola - di - lapangan'." },
            { icon: "Languages", title: "Huruf Kapital", prompt: "Kapan kita harus menggunakan huruf kapital? Berikan 3 contoh." },
            { icon: "History", title: "Tulis cerita pendek", prompt: "Buatkan cerita pendek 3 paragraf tentang liburan ke kebun binatang." },
            { icon: "Landmark", title: "Tulis puisi", prompt: "Buatkan puisi 2 bait tentang cita-citaku menjadi dokter." }
        ],
        "IPS (Sejarah, Geografi)": [
             { icon: "History", title: "Keluarga Inti", prompt: "Siapa saja yang termasuk dalam anggota keluarga inti? Jelaskan perannya." },
             { icon: "Landmark", title: "Arah Mata Angin", prompt: "Sebutkan 8 arah mata angin." },
             { icon: "Book", title: "Peta Lingkungan Sekolah", prompt: "Buatlah denah sederhana dari ruang kelas menuju ke perpustakaan." },
             { icon: "FlaskConical", title: "Pakaian Adat", prompt: "Sebutkan 3 nama pakaian adat di Indonesia beserta asalnya." }
        ],
        "Seni Budaya dan Prakarya (SBdP)": [
            { icon: "Sparkles", title: "Membuat kolase", prompt: "Beri langkah-langkah membuat kolase dari biji-bijian dengan tema hewan." },
            { icon: "Book", title: "Alat musik ritmis", prompt: "Apa itu alat musik ritmis? Sebutkan 3 contohnya." },
            { icon: "Landmark", title: "Menggambar ekspresif", prompt: "Gambarkan ekspresi wajah orang yang sedang sedih, senang, dan marah." },
            { icon: "History", title: "Lagu daerah", prompt: "Tuliskan lirik lagu daerah 'Ampar-Ampar Pisang'." }
        ],
        "Pendidikan Jasmani (PJOK)": [
            { icon: "Sparkles", title: "Gerak Lokomotor", prompt: "Jelaskan apa itu gerak lokomotor dan berikan 3 contohnya." },
            { icon: "Book", title: "Manfaat pemanasan", prompt: "Mengapa kita harus melakukan pemanasan sebelum berolahraga?" },
            { icon: "Landmark", title: "Permainan bola kasti", prompt: "Jelaskan cara melempar dan menangkap bola dalam permainan kasti." },
            { icon: "History", title: "Senam lantai dasar", prompt: "Bagaimana cara melakukan gerakan roll depan yang benar dan aman?" }
        ],
        "Umum": [
            { icon: "Book", title: "Buat puisi", prompt: "Buatkan puisi pendek tentang persahabatan untuk anak SD." },
            { icon: "FlaskConical", title: "Jelaskan gotong royong", prompt: "Apa arti penting dari gotong royong di masyarakat?" },
            { icon: "Landmark", title: "Tugas PPKn", prompt: "Sebutkan 3 contoh sikap yang sesuai dengan sila pertama Pancasila." },
            { icon: "History", title: "Cerita fabel", prompt: "Buatkan cerita fabel singkat tentang kancil yang cerdik." }
        ]
    },
    SMP: {
        "Matematika": [
            { icon: "Book", title: "Soal aljabar", prompt: "Buatkan 3 soal persamaan linear satu variabel dan cara menyelesaikannya untuk kelas 7." },
            { icon: "FlaskConical", title: "Teorema Pythagoras", prompt: "Jelaskan pembuktian Teorema Pythagoras dan berikan contoh soalnya." },
            { icon: "Landmark", title: "Proyek bangun ruang", prompt: "Beri ide proyek membuat jaring-jaring tabung dan kerucut beserta rumusnya." },
            { icon: "History", title: "Peluang Empirik", prompt: "Apa perbedaan antara peluang empirik dan peluang teoretis? Berikan contohnya." }
        ],
        "IPA Terpadu (Fisika, Biologi)": [
            { icon: "Book", title: "Sistem peredaran darah", prompt: "Jelaskan mekanisme peredaran darah besar dan peredaran darah kecil pada manusia." },
            { icon: "FlaskConical", title: "Konsep pemuaian", prompt: "Jelaskan 3 jenis pemuaian (panjang, luas, volume) dan berikan contohnya dalam kehidupan sehari-hari." },
            { icon: "Landmark", title: "Percobaan getaran", prompt: "Rancang sebuah percobaan sederhana untuk mengukur frekuensi dan periode sebuah bandul." },
            { icon: "History", title: "Pewarisan sifat", prompt: "Jelaskan hukum Mendel I tentang segregasi dengan contoh persilangan monohibrid." }
        ],
        "Pendidikan Pancasila (PPKn)": [
            { icon: "Scale", title: "Norma dalam Masyarakat", prompt: "Analisis perbedaan sanksi antara norma hukum dan norma kesopanan." },
            { icon: "Landmark", title: "Bentuk Kedaulatan", prompt: "Bagaimana pelaksanaan kedaulatan rakyat dalam sistem demokrasi Pancasila di Indonesia?" },
            { icon: "Handshake", title: "Peran Indonesia di PBB", prompt: "Jelaskan peran Indonesia dalam misi perdamaian dunia di bawah naungan PBB." },
            { icon: "History", title: "Sejarah Perumusan Pancasila", prompt: "Jelaskan perbedaan usulan dasar negara dari Moh. Yamin, Soepomo, dan Ir. Soekarno." }
        ],
        "IPS Terpadu (Sejarah, Geografi, Ekonomi)": [
            { icon: "History", title: "Kerajaan Islam", prompt: "Bandingkan corak kehidupan politik dan ekonomi kesultanan Demak dan Mataram Islam." },
            { icon: "Landmark", title: "Interaksi Sosial", prompt: "Jelaskan dua bentuk interaksi sosial (asosiatif dan disosiatif) beserta contohnya." },
            { icon: "Book", title: "Kegiatan Ekonomi", prompt: "Jelaskan hubungan antara produksi, distribusi, dan konsumsi dalam kegiatan ekonomi." },
            { icon: "FlaskConical", title: "Letak Geologis Indonesia", prompt: "Jelaskan dampak dari letak Indonesia pada pertemuan tiga lempeng tektonik dunia." }
        ],
         "Bahasa Inggris": [
            { icon: "Book", title: "Simple Present Tense", prompt: "Create 5 sentences using the Simple Present Tense to describe daily routines." },
            { icon: "Languages", title: "Descriptive Text", prompt: "Write a short descriptive text about your favorite pet." },
            { icon: "History", title: "Recount Text", prompt: "Write a recount text about your last holiday experience in 3 paragraphs." },
            { icon: "Landmark", title: "Asking for and Giving Opinion", prompt: "Create a short dialogue about asking for and giving an opinion about a new movie." }
        ],
        "Umum": [
            { icon: "Book", title: "Debat tentang media sosial", prompt: "Berikan 3 argumen pro dan 3 argumen kontra tentang penggunaan media sosial bagi remaja." },
            { icon: "FlaskConical", title: "Pemanasan global", prompt: "Apa penyebab utama pemanasan global dan apa dampaknya bagi bumi?" },
            { icon: "Landmark", title: "Ide mading sekolah", prompt: "Beri 5 ide tema untuk mading sekolah yang menarik." },
            { icon: "History", title: "Perang Diponegoro", prompt: "Ringkas secara singkat latar belakang dan akhir dari Perang Diponegoro." }
        ]
    },
    SMA: {
        "Fisika": [
            { icon: "Book", title: "Soal Dinamika Rotasi", prompt: "Sebuah silinder pejal berotasi. Buatkan soal untuk menghitung momen inersia dan momentum sudutnya." },
            { icon: "FlaskConical", title: "Konsep Efek Doppler", prompt: "Jelaskan bagaimana Efek Doppler berlaku pada gelombang suara dan gelombang cahaya." },
            { icon: "Landmark", title: "Praktikum Rangkaian RLC", prompt: "Berikan rancangan dan tujuan dari praktikum untuk mencari frekuensi resonansi pada rangkaian RLC seri." },
            { icon: "History", title: "Inti Atom dan Radioaktivitas", prompt: "Jelaskan apa itu peluruhan alfa, beta, dan gamma beserta daya tembusnya." }
        ],
        "Kimia": [
            { icon: "Book", title: "Soal Stoikiometri", prompt: "Berapa gram gas oksigen yang dibutuhkan untuk membakar 12 gram karbon hingga habis? Buatkan perhitungannya." },
            { icon: "FlaskConical", title: "Jelaskan sistem koloid", prompt: "Apa perbedaan antara sol, emulsi, dan buih dalam sistem koloid? Beri masing-masing contoh." },
            { icon: "Landmark", title: "Praktikum Titrasi Asam-Basa", prompt: "Jelaskan langkah kerja dan fungsi indikator fenolftalein dalam titrasi asam-basa." },
            { icon: "History", title: "Hibridisasi Orbital", prompt: "Jelaskan proses hibridisasi sp3 pada molekul metana (CH4)." }
        ],
        "Sejarah (Peminatan)": [
            { icon: "Book", title: "Analisis Perang Dingin", prompt: "Buatlah analisis mengenai dampak Perang Dingin terhadap perpolitikan di kawasan Asia Tenggara." },
            { icon: "FlaskConical", title: "Bandingkan Renaisans dan Aufklärung", prompt: "Bandingkan karakteristik utama gerakan Renaisans dan Aufklärung di Eropa." },
            { icon: "Landmark", title: "Historiografi", prompt: "Apa perbedaan antara historiografi tradisional, kolonial, dan modern di Indonesia?" },
            { icon: "History", title: "Peran Indonesia di OKI", prompt: "Jelaskan peran penting Indonesia dalam Organisasi Kerjasama Islam (OKI)." }
        ],
        "Pendidikan Pancasila (PPKn)": [
            { icon: "Scale", title: "Sistem Hukum di Indonesia", prompt: "Jelaskan hierarki peraturan perundang-undangan di Indonesia menurut UU No. 12 Tahun 2011." },
            { icon: "Landmark", title: "Hubungan Internasional", prompt: "Analisis pentingnya perjanjian ekstradisi antara Indonesia dengan negara lain." },
            { icon: "Handshake", title: "Ancaman Integrasi Nasional", prompt: "Analisis ancaman di bidang sosial budaya yang dapat mengganggu integrasi nasional." },
            { icon: "History", title: "Dinamika Demokrasi", prompt: "Jelaskan perbedaan utama antara demokrasi parlementer, terpimpin, dan Pancasila di Indonesia." }
        ],
        "Ekonomi": [
            { icon: "Book", title: "Elastisitas Permintaan", prompt: "Jelaskan perbedaan antara permintaan elastis, inelastis, dan uniter. Berikan contoh barangnya." },
            { icon: "FlaskConical", title: "APBN dan APBD", prompt: "Jelaskan fungsi alokasi, distribusi, dan stabilisasi dalam APBN." },
            { icon: "Landmark", title: "Akuntansi Perusahaan Jasa", prompt: "Buatkan contoh jurnal umum untuk transaksi 'pembayaran sewa dibayar di muka'." },
            { icon: "History", title: "Pendapatan Nasional", prompt: "Jelaskan 3 pendekatan dalam perhitungan pendapatan nasional (produksi, pendapatan, pengeluaran)." }
        ],
        "Bahasa Inggris": [
            { icon: "Book", title: "Conditional Sentences", prompt: "Create one example sentence for each type of conditional sentence (Type 1, 2, and 3)." },
            { icon: "Languages", title: "Analytical Exposition Text", prompt: "Write a thesis statement and three supporting arguments for an analytical exposition text about the importance of breakfast." },
            { icon: "History", title: "Passive Voice", prompt: "Change the following active sentence into passive voice: 'The government has just launched a new program'." },
            { icon: "Landmark", title: "Job Application Letter", prompt: "Write the opening paragraph of a job application letter for a graphic designer position." }
        ],
        "Umum": [
            { icon: "Book", title: "Tulis esai argumentatif", prompt: "Tulis sebuah esai argumentatif dengan tema 'Pentingnya Literasi Digital di Era Informasi'." },
            { icon: "FlaskConical", title: "Analisis SWOT diri", prompt: "Bagaimana cara melakukan analisis SWOT (Strengths, Weaknesses, Opportunities, Threats) untuk rencana studi lanjut ke perguruan tinggi?" },
            { icon: "Landmark", "title": "Proposal kegiatan OSIS", "prompt": "Buatkan kerangka proposal untuk kegiatan 'Pekan Olahraga dan Seni' di sekolah." },
            { icon: "History", "title": "Isu kesehatan mental", "prompt": "Jelaskan pentingnya menjaga kesehatan mental bagi siswa SMA dan cara-caranya." }
        ]
    }
};
