
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
            { icon: "Book", title: "Soal cerita perkalian", prompt: "Buatkan 5 soal cerita tentang perkalian untuk anak kelas 3 SD." },
            { icon: "FlaskConical", title: "Jelaskan pecahan", prompt: "Jelaskan apa itu bilangan pecahan dengan contoh kue." },
            { icon: "Landmark", title: "Game matematika", prompt: "Beri ide permainan untuk belajar penjumlahan di kelas 1 SD." },
            { icon: "History", title: "Ciri-ciri bangun datar", prompt: "Sebutkan dan jelaskan ciri-ciri persegi, lingkaran, dan segitiga." }
        ],
        "IPA (Sains)": [
            { icon: "Book", title: "Siklus hidup kupu-kupu", prompt: "Jelaskan tahapan siklus hidup kupu-kupu." },
            { icon: "FlaskConical", title: "Mengapa pelangi muncul?", prompt: "Jelaskan mengapa pelangi bisa muncul setelah hujan." },
            { icon: "Landmark", title: "Proyek tanam kecambah", prompt: "Buat langkah-langkah untuk proyek menanam biji kacang hijau di kapas." },
            { icon: "History", title: "Kelompokkan hewan", prompt: "Kelompokkan hewan berikut berdasarkan makanannya: singa, sapi, beruang, kelinci." }
        ],
        "Pendidikan Pancasila (PPKn)": [
            { icon: "Handshake", title: "Contoh Sila Pertama", prompt: "Sebutkan 3 contoh sikap di sekolah yang sesuai dengan sila pertama Pancasila." },
            { icon: "Scale", title: "Hak dan Kewajiban", prompt: "Apa hak dan kewajiban seorang siswa di rumah?" },
            { icon: "Landmark", title: "Simbol Sila Pancasila", prompt: "Jelaskan arti dari simbol padi dan kapas pada sila kelima Pancasila." },
            { icon: "History", title: "Musyawarah", prompt: "Mengapa musyawarah penting dalam mengambil keputusan bersama di kelas?" }
        ],
        "Bahasa Indonesia": [
            { icon: "Book", title: "Buat kalimat tanya", prompt: "Buatlah 5 kalimat tanya menggunakan kata tanya 'apa', 'siapa', 'kapan', 'di mana', dan 'mengapa'." },
            { icon: "Languages", title: "Antonim dan Sinonim", prompt: "Apa sinonim dari kata 'senang' dan antonim dari kata 'besar'?" },
            { icon: "History", title: "Ringkas cerita", prompt: "Ringkas cerita 'Malin Kundang' dalam 3 kalimat." },
            { icon: "Landmark", title: "Tulis puisi", prompt: "Buatkan puisi pendek 2 bait tentang sekolahku." }
        ],
        "IPS (Sejarah, Geografi)": [
             { icon: "History", title: "Pahlawan Nasional", prompt: "Ceritakan secara singkat perjuangan Pangeran Diponegoro." },
             { icon: "Landmark", title: "Kenampakan Alam", prompt: "Apa perbedaan antara gunung dan pegunungan?" },
             { icon: "Book", title: "Kegiatan Ekonomi", prompt: "Sebutkan 3 contoh kegiatan jual beli yang ada di pasar." },
             { icon: "FlaskConical", title: "Peta Indonesia", prompt: "Sebutkan 5 pulau besar di Indonesia." }
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
            { icon: "Landmark", title: "Proyek bangun ruang", prompt: "Beri ide proyek membuat jaring-jaring limas dan prisma." },
            { icon: "History", title: "Mean, Median, Modus", prompt: "Apa perbedaan antara mean, median, dan modus? Berikan contohnya pada sebuah data." }
        ],
        "IPA Terpadu (Fisika, Biologi)": [
            { icon: "Book", title: "Sistem pernapasan", prompt: "Jelaskan organ-organ dalam sistem pernapasan manusia beserta fungsinya." },
            { icon: "FlaskConical", title: "Konsep fotosintesis", prompt: "Jelaskan reaksi kimia dan proses fotosintesis pada tumbuhan." },
            { icon: "Landmark", title: "Percobaan tekanan udara", prompt: "Rancang sebuah percobaan sederhana untuk membuktikan adanya tekanan udara." },
            { icon: "History", title: "Rantai makanan", prompt: "Gambarkan contoh jaring-jaring makanan di ekosistem laut." }
        ],
        "Pendidikan Pancasila (PPKn)": [
            { icon: "Scale", title: "Norma dalam Masyarakat", prompt: "Jelaskan 4 jenis norma yang berlaku di masyarakat beserta contohnya." },
            { icon: "Landmark", title: "Bentuk Kedaulatan", prompt: "Apa yang dimaksud dengan kedaulatan rakyat dan bagaimana penerapannya di Indonesia?" },
            { icon: "Handshake", title: "Peran Indonesia di ASEAN", prompt: "Jelaskan peran Indonesia dalam organisasi ASEAN." },
            { icon: "History", title: "Sejarah Perumusan UUD", prompt: "Ceritakan secara singkat proses perumusan UUD 1945 oleh BPUPKI." }
        ],
        "IPS Terpadu (Sejarah, Geografi, Ekonomi)": [
            { icon: "History", title: "Kerajaan Hindu-Buddha", prompt: "Bandingkan corak kehidupan ekonomi kerajaan Sriwijaya dan Majapahit." },
            { icon: "Landmark", title: "Letak Astronomis Indonesia", prompt: "Jelaskan dampak dari letak astronomis Indonesia terhadap iklim." },
            { icon: "Book", title: "Permintaan dan Penawaran", prompt: "Apa faktor-faktor yang mempengaruhi permintaan dan penawaran dalam ekonomi?" },
            { icon: "FlaskConical", title: "Perubahan Sosial Budaya", prompt: "Berikan contoh perubahan sosial budaya akibat globalisasi." }
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
            { icon: "Book", title: "Soal Hukum Newton", prompt: "Buatkan soal essay mengenai penerapan Hukum II Newton dalam sistem katrol." },
            { icon: "FlaskConical", title: "Konsep dualisme gelombang-partikel", prompt: "Jelaskan konsep dualisme gelombang-partikel pada cahaya menurut de Broglie." },
            { icon: "Landmark", title: "Proyek roket air", prompt: "Berikan rancangan dan prinsip fisika di balik pembuatan roket air sederhana." },
            { icon: "History", title: "Teori relativitas khusus", prompt: "Apa saja postulat utama dalam teori relativitas khusus Einstein dan jelaskan implikasinya." }
        ],
        "Kimia": [
            { icon: "Book", title: "Penyetaraan reaksi redoks", prompt: "Setarakan reaksi redoks berikut dengan metode setengah reaksi: MnO4- + C2O4^2- -> Mn^2+ + CO2." },
            { icon: "FlaskConical", title: "Jelaskan ikatan hidrogen", prompt: "Apa itu ikatan hidrogen dan mengapa ia menyebabkan titik didih air tinggi? Berikan contoh." },
            { icon: "Landmark", title: "Praktikum laju reaksi", prompt: "Rancang percobaan untuk mengetahui pengaruh konsentrasi terhadap laju reaksi." },
            { icon: "History", title: "Model atom", prompt: "Jelaskan kelemahan model atom Rutherford dan bagaimana model atom Bohr memperbaikinya." }
        ],
        "Sejarah (Peminatan)": [
            { icon: "Book", title: "Analisis dampak Revolusi Industri", prompt: "Buatlah analisis mengenai dampak sosial dan ekonomi dari Revolusi Industri 4.0 di Indonesia." },
            { icon: "FlaskConical", title: "Bandingkan Orde Lama dan Orde Baru", prompt: "Bandingkan kebijakan politik luar negeri Indonesia pada masa Orde Lama dan Orde Baru." },
            { icon: "Landmark", title: "Ide riset sejarah lokal", prompt: "Berikan 3 ide penelitian sejarah yang bisa dilakukan di lingkungan sekitar tempat tinggalku." },
            { icon: "History", title: "Peran Indonesia di GNB", prompt: "Jelaskan peran penting Indonesia dalam pendirian Gerakan Non-Blok." }
        ],
        "Pendidikan Pancasila (PPKn)": [
            { icon: "Scale", title: "Sistem Pembagian Kekuasaan", prompt: "Jelaskan konsep Trias Politika dan bagaimana penerapannya dalam sistem pemerintahan Indonesia." },
            { icon: "Landmark", title: "Hubungan Internasional", prompt: "Apa landasan idiil dan konstitusional politik luar negeri Indonesia yang bebas aktif?" },
            { icon: "Handshake", title: "Ancaman Terhadap NKRI", prompt: "Analisis ancaman di bidang ideologi dan politik yang dihadapi bangsa Indonesia saat ini." },
            { icon: "History", title: "Kasus Pelanggaran HAM", prompt: "Sebutkan dan jelaskan salah satu contoh kasus pelanggaran HAM berat di Indonesia dan upaya penyelesaiannya." }
        ],
        "Ekonomi": [
            { icon: "Book", title: "Masalah Kelangkaan", prompt: "Jelaskan apa itu kelangkaan (scarcity) dan bagaimana hubungannya dengan biaya peluang (opportunity cost)." },
            { icon: "FlaskConical", title: "Inflasi dan Kebijakan Moneter", prompt: "Bagaimana Bank Indonesia menggunakan kebijakan moneter untuk mengendalikan inflasi?" },
            { icon: "Landmark", title: "Pasar Modal", prompt: "Apa perbedaan antara saham dan obligasi sebagai instrumen investasi di pasar modal?" },
            { icon: "History", title: "Pendapatan Nasional", prompt: "Jelaskan perbedaan antara konsep GDP dan GNP dalam perhitungan pendapatan nasional." }
        ],
        "Umum": [
            { icon: "Book", title: "Tulis esai argumentatif", prompt: "Tulis sebuah esai argumentatif dengan tema 'Pentingnya Literasi Digital di Era Informasi'." },
            { icon: "FlaskConical", title: "Analisis SWOT diri", prompt: "Bagaimana cara melakukan analisis SWOT (Strengths, Weaknesses, Opportunities, Threats) untuk rencana studi lanjut ke perguruan tinggi?" },
            { icon: "Landmark", "title": "Proposal kegiatan OSIS", "prompt": "Buatkan kerangka proposal untuk kegiatan 'Pekan Olahraga dan Seni' di sekolah." },
            { icon: "History", "title": "Isu kesehatan mental", "prompt": "Jelaskan pentingnya menjaga kesehatan mental bagi siswa SMA dan cara-caranya." }
        ]
    }
};

    