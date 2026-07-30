// ============================================
// 1. KONFIGURASI FIREBASE
// ============================================
const firebaseConfig = {
    apiKey: "AIzaSyBYb9zFaKSASEmpQK2NKChv7aj9tSTTGIM",
    authDomain: "galeri-kegiatan-ende.firebaseapp.com",
    projectId: "galeri-kegiatan-ende",
    storageBucket: "galeri-kegiatan-ende.firebasestorage.app",
    messagingSenderId: "1036576141299",
    appId: "1:1036576141299:web:89d70636e1f91850916c86",
    measurementId: "G-9QTLLP3YC3"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// ============================================
// 2. DATA 334 SEKOLAH (Untuk Filter di Galeri)
// ============================================
const schoolsData = [
    {"name": "SD GMIT ENDE 4", "kecamatan": "Ende Utara"},
    {"name": "SD INPRES AEDARI", "kecamatan": "Detukeli"},
    {"name": "SD INPRES AEKORA", "kecamatan": "Detukeli"},
    {"name": "SD INPRES AEMAU", "kecamatan": "Maurole"},
    {"name": "SD INPRES AEREA", "kecamatan": "Ndori"},
    {"name": "SD INPRES AETEKE", "kecamatan": "Lio Timur"},
    {"name": "SD INPRES BARAI 1", "kecamatan": "Ende Utara"},
    {"name": "SD INPRES BARAI 2", "kecamatan": "Ende Utara"},
    {"name": "SD INPRES BELANGGO", "kecamatan": "Wolowaru"},
    {"name": "SD INPRES BHOANAWA 1", "kecamatan": "Ende Selatan"},
    {"name": "SD INPRES BHOANAWA 2", "kecamatan": "Ende Selatan"},
    {"name": "SD INPRES DETUBELO", "kecamatan": "Lio Timur"},
    {"name": "SD INPRES DETUENA", "kecamatan": "Kelimutu"},
    {"name": "SD INPRES DETUETE", "kecamatan": "Wewaria"},
    {"name": "SD INPRES DETUSOKO", "kecamatan": "Detusoko"},
    {"name": "SD INPRES DETUWIRA", "kecamatan": "Detusoko"},
    {"name": "SD INPRES EKOLEA", "kecamatan": "Wewaria"},
    {"name": "SD INPRES EKOTARU", "kecamatan": "Wewaria"},
    {"name": "SD INPRES ENDE 10", "kecamatan": "Ende Tengah"},
    {"name": "SD INPRES ENDE 11", "kecamatan": "Ende Utara"},
    {"name": "SD INPRES ENDE 12", "kecamatan": "Ende Utara"},
    {"name": "SD INPRES ENDE 13", "kecamatan": "Ende Tengah"},
    {"name": "SD INPRES ENDE 14", "kecamatan": "Ende Timur"},
    {"name": "SD INPRES ENDE 15", "kecamatan": "Ende Utara"},
    {"name": "SD INPRES ENDE 16", "kecamatan": "Ende Timur"},
    {"name": "SD INPRES ENDE 7", "kecamatan": "Ende Timur"},
    {"name": "SD INPRES ENDE 9", "kecamatan": "Ende Utara"},
    {"name": "SD INPRES FEORIA", "kecamatan": "Detukeli"},
    {"name": "SD INPRES HOBAKUA", "kecamatan": "Ndori"},
    {"name": "SD INPRES ILIWODO 1", "kecamatan": "Ndori"},
    {"name": "SD INPRES ILIWODO 2", "kecamatan": "Ndori"},
    {"name": "SD INPRES JOPU 4", "kecamatan": "Wolowaru"},
    {"name": "SD INPRES JOPU 5", "kecamatan": "Wolowaru"},
    {"name": "SD INPRES KEKAKEU", "kecamatan": "Nangapanda"},
    {"name": "SD INPRES KEKAWII", "kecamatan": "Ende"},
    {"name": "SD INPRES KELITEMBU", "kecamatan": "Wewaria"},
    {"name": "SD INPRES KOAGATA", "kecamatan": "Ndona"},
    {"name": "SD INPRES KOAWENA", "kecamatan": "Ende Timur"},
    {"name": "SD INPRES KOLIKAPA", "kecamatan": "Maukaro"},
    {"name": "SD INPRES KOTABARU", "kecamatan": "Kota Baru"},
    {"name": "SD INPRES KURUMBORO", "kecamatan": "Ende Timur"},
    {"name": "SD INPRES LEWAGARE", "kecamatan": "Detukeli"},
    {"name": "SD INPRES LIANGGERE", "kecamatan": "Ende"},
    {"name": "SD INPRES LIGALEJO", "kecamatan": "Kota Baru"},
    {"name": "SD INPRES LOKOBOKO", "kecamatan": "Ndona"},
    {"name": "SD INPRES LOWOKETO", "kecamatan": "Kota Baru"},
    {"name": "SD INPRES LOWORONGGA", "kecamatan": "Ndona"},
    {"name": "SD INPRES MALAWARU", "kecamatan": "Nangapanda"},
    {"name": "SD INPRES MAUAU", "kecamatan": "Pulau Ende"},
    {"name": "SD INPRES MAUROLE", "kecamatan": "Maurole"},
    {"name": "SD INPRES MAURONGGA", "kecamatan": "Nangapanda"},
    {"name": "SD INPRES MAUTENDA", "kecamatan": "Wewaria"},
    {"name": "SD INPRES MBONGAWANI", "kecamatan": "Ende Selatan"},
    {"name": "SD INPRES MBOTUJITA", "kecamatan": "Detusoko"},
    {"name": "SD INPRES MBUJALOO", "kecamatan": "Wolojita"},
    {"name": "SD INPRES MBULILOO", "kecamatan": "Wolowaru"},
    {"name": "SD INPRES METINUMBA 1", "kecamatan": "Pulau Ende"},
    {"name": "SD INPRES METINUMBA 2", "kecamatan": "Pulau Ende"},
    {"name": "SD INPRES MUNDINGGASA", "kecamatan": "Maukaro"},
    {"name": "SD INPRES NANGANIO", "kecamatan": "Maurole"},
    {"name": "SD INPRES NANGAPANDA 2", "kecamatan": "Nangapanda"},
    {"name": "SD INPRES NANGAPANDA 3", "kecamatan": "Nangapanda"},
    {"name": "SD INPRES NDETUFEO", "kecamatan": "Nangapanda"},
    {"name": "SD INPRES NDETUNDORA 1", "kecamatan": "Ende"},
    {"name": "SD INPRES NDETUNDORA 2", "kecamatan": "Ende"},
    {"name": "SD INPRES NDETUWARU", "kecamatan": "Nangapanda"},
    {"name": "SD INPRES NDITO", "kecamatan": "Detusoko"},
    {"name": "SD INPRES NDONA 3", "kecamatan": "Ndona"},
    {"name": "SD INPRES NDONA 4", "kecamatan": "Ndona"},
    {"name": "SD INPRES NGALUPOLO", "kecamatan": "Ndona"},
    {"name": "SD INPRES NGALUROGA", "kecamatan": "Ndona"},
    {"name": "SD INPRES NGGELA 2", "kecamatan": "Wolojita"},
    {"name": "SD INPRES NGGEMO", "kecamatan": "Maukaro"},
    {"name": "SD INPRES NIONIBA", "kecamatan": "Maurole"},
    {"name": "SD INPRES NIOSANGGO", "kecamatan": "Wewaria"},
    {"name": "SD INPRES NIRANUSA", "kecamatan": "Maurole"},
    {"name": "SD INPRES NUAJA", "kecamatan": "Ende"},
    {"name": "SD INPRES NUAMURI 2", "kecamatan": "Kelimutu"},
    {"name": "SD INPRES NUANAGA", "kecamatan": "Kota Baru"},
    {"name": "SD INPRES NUAPU", "kecamatan": "Ndona Timur"},
    {"name": "SD INPRES NUATU", "kecamatan": "Wolowaru"},
    {"name": "SD INPRES NUMBA 1", "kecamatan": "Nangapanda"},
    {"name": "SD INPRES NUMBA 2", "kecamatan": "Nangapanda"},
    {"name": "SD INPRES ONEKORE 3", "kecamatan": "Ende Tengah"},
    {"name": "SD INPRES ONEKORE 4", "kecamatan": "Ende Utara"},
    {"name": "SD INPRES ONEKORE 5", "kecamatan": "Ende Tengah"},
    {"name": "SD INPRES ONEKORE 6", "kecamatan": "Ende Tengah"},
    {"name": "SD INPRES OTOMBAMBA", "kecamatan": "Ndona"},
    {"name": "SD INPRES PANALATO", "kecamatan": "Kota Baru"},
    {"name": "SD INPRES PASADOO", "kecamatan": "Detusoko"},
    {"name": "SD INPRES PAUPANDA 1", "kecamatan": "Ende Selatan"},
    {"name": "SD INPRES PAUPANDA 2", "kecamatan": "Ende Selatan"},
    {"name": "SD INPRES PAUPANDA 3", "kecamatan": "Ende Selatan"},
    {"name": "SD INPRES PUUDHOMBO", "kecamatan": "Ende"},
    {"name": "SD INPRES PUUKUNGU", "kecamatan": "Nangapanda"},
    {"name": "SD INPRES PUUPAU", "kecamatan": "Nangapanda"},
    {"name": "SD INPRES RAAWEKA", "kecamatan": "Wewaria"},
    {"name": "SD INPRES RABURIA", "kecamatan": "Ende"},
    {"name": "SD INPRES RANGGATALO", "kecamatan": "Lio Timur"},
    {"name": "SD INPRES RATESUBA", "kecamatan": "Maukaro"},
    {"name": "SD INPRES REDA", "kecamatan": "Ende"},
    {"name": "SD INPRES RENDOMAUPANDI", "kecamatan": "Pulau Ende"},
    {"name": "SD INPRES ROA", "kecamatan": "Detusoko"},
    {"name": "SD INPRES ROJA 2", "kecamatan": "Ende Selatan"},
    {"name": "SD INPRES ROJABAI", "kecamatan": "Kota Baru"},
    {"name": "SD INPRES ROPA", "kecamatan": "Maurole"},
    {"name": "SD INPRES ROWORENA 2", "kecamatan": "Ende Utara"},
    {"name": "SD INPRES SOKOLOO", "kecamatan": "Lepembusu Kelisoke"},
    {"name": "SD INPRES SOKORIA", "kecamatan": "Maurole"},
    {"name": "SD INPRES TANARHI", "kecamatan": "Nangapanda"},
    {"name": "SD INPRES TETANDARA", "kecamatan": "Ende Tengah"},
    {"name": "SD INPRES TIWEREA", "kecamatan": "Nangapanda"},
    {"name": "SD INPRES WAKA", "kecamatan": "Wewaria"},
    {"name": "SD INPRES WATUBEWA", "kecamatan": "Wolowaru"},
    {"name": "SD INPRES WATUJARA", "kecamatan": "Ende Timur"},
    {"name": "SD INPRES WATUMESI", "kecamatan": "Maurole"},
    {"name": "SD INPRES WATUMOTO", "kecamatan": "Wolojita"},
    {"name": "SD INPRES WELAMOSA", "kecamatan": "Wewaria"},
    {"name": "SD INPRES WEWARIA", "kecamatan": "Wewaria"},
    {"name": "SD INPRES WOLOARA", "kecamatan": "Kelimutu"},
    {"name": "SD INPRES WOLOGAI", "kecamatan": "Ende"},
    {"name": "SD INPRES WOLOJITA", "kecamatan": "Wolojita"},
    {"name": "SD INPRES WOLOKOLI", "kecamatan": "Wewaria"},
    {"name": "SD INPRES WOLOLA", "kecamatan": "Lepembusu Kelisoke"},
    {"name": "SD INPRES WOLOMAGE", "kecamatan": "Wewaria"},
    {"name": "SD INPRES WOLOOJA 1", "kecamatan": "Wolowaru"},
    {"name": "SD INPRES WOLOOJA 3", "kecamatan": "Wolowaru"},
    {"name": "SD INPRES WOLOTOPO", "kecamatan": "Ndona"},
    {"name": "SD INPRES WOLOWARU 4", "kecamatan": "Wolowaru"},
    {"name": "SD INPRES WOLOWARU 5", "kecamatan": "Wolowaru"},
    {"name": "SD INPRES WOLOWONA 1", "kecamatan": "Ende Timur"},
    {"name": "SD INPRES WOLOWONA 2", "kecamatan": "Ende Timur"},
    {"name": "SD INPRES WONDA", "kecamatan": "Ndori"},
    {"name": "SD INPRES WOROJA", "kecamatan": "Ende Utara"},
    {"name": "SD INPRES WOROPAPA", "kecamatan": "Ende"},
    {"name": "SD INPRES WUKARIA", "kecamatan": "Wewaria"},
    {"name": "SD KATOLIK AEBARA", "kecamatan": "Ndori"},
    {"name": "SD KATOLIK AEFEO", "kecamatan": "Ende"},
    {"name": "SD KATOLIK AEISA", "kecamatan": "Ende Utara"},
    {"name": "SD KATOLIK AEKORO", "kecamatan": "Ende"},
    {"name": "SD KATOLIK AEWORA", "kecamatan": "Maurole"},
    {"name": "SD KATOLIK ANARANDA", "kecamatan": "Wewaria"},
    {"name": "SD KATOLIK ASE", "kecamatan": "Lio Timur"},
    {"name": "SD KATOLIK BOAFEO", "kecamatan": "Maukaro"},
    {"name": "SD KATOLIK BUUBEI", "kecamatan": "Ende"},
    {"name": "SD KATOLIK BUUNGENDA", "kecamatan": "Detusoko"},
    {"name": "SD KATOLIK DEDU", "kecamatan": "Ndona"},
    {"name": "SD KATOLIK DETUARA", "kecamatan": "Lepembusu Kelisoke"},
    {"name": "SD KATOLIK DETUBELA 1", "kecamatan": "Wewaria"},
    {"name": "SD KATOLIK DETUDENU", "kecamatan": "Lepembusu Kelisoke"},
    {"name": "SD KATOLIK DETUELU", "kecamatan": "Lepembusu Kelisoke"},
    {"name": "SD KATOLIK DETUKOU", "kecamatan": "Kota Baru"},
    {"name": "SD KATOLIK DETUMBAWA", "kecamatan": "Ende Timur"},
    {"name": "SD KATOLIK DETUMBEWA", "kecamatan": "Detukeli"},
    {"name": "SD KATOLIK DETUPERA", "kecamatan": "Lio Timur"},
    {"name": "SD KATOLIK DETUWULU", "kecamatan": "Maurole"},
    {"name": "SD KATOLIK DILE", "kecamatan": "Detusoko"},
    {"name": "SD KATOLIK EKOAE", "kecamatan": "Wewaria"},
    {"name": "SD KATOLIK EKOLETA", "kecamatan": "Detusoko"},
    {"name": "SD KATOLIK ENDE 8", "kecamatan": "Ende Tengah"},
    {"name": "SD KATOLIK FENDO", "kecamatan": "Lio Timur"},
    {"name": "SD KATOLIK FUNGAPANDA", "kecamatan": "Detukeli"},
    {"name": "SD KATOLIK GANA", "kecamatan": "Lio Timur"},
    {"name": "SD KATOLIK GHAIBHABHA", "kecamatan": "Detukeli"},
    {"name": "SD KATOLIK HANGALANDE", "kecamatan": "Kota Baru"},
    {"name": "SD KATOLIK JOGE", "kecamatan": "Maurole"},
    {"name": "SD KATOLIK JOPU 1", "kecamatan": "Wolowaru"},
    {"name": "SD KATOLIK JOPU 2", "kecamatan": "Wolowaru"},
    {"name": "SD KATOLIK JOPU 3", "kecamatan": "Wolowaru"},
    {"name": "SD KATOLIK KAMUBHEKA", "kecamatan": "Maukaro"},
    {"name": "SD KATOLIK KANGANARA", "kecamatan": "Detukeli"},
    {"name": "SD KATOLIK KEDO", "kecamatan": "Lepembusu Kelisoke"},
    {"name": "SD KATOLIK KEDOGAJA", "kecamatan": "Lepembusu Kelisoke"},
    {"name": "SD KATOLIK KEKADORI", "kecamatan": "Nangapanda"},
    {"name": "SD KATOLIK KEKAJODHO", "kecamatan": "Ende"},
    {"name": "SD KATOLIK KEKANDERE 1", "kecamatan": "Nangapanda"},
    {"name": "SD KATOLIK KEKANDERE 2", "kecamatan": "Nangapanda"},
    {"name": "SD KATOLIK KEKASEWA", "kecamatan": "Ndona"},
    {"name": "SD KATOLIK KEKAWII", "kecamatan": "Ende"},
    {"name": "SD KATOLIK KOANARA", "kecamatan": "Kelimutu"},
    {"name": "SD KATOLIK KOMBANDARU", "kecamatan": "Ende"},
    {"name": "SD KATOLIK KOMBO", "kecamatan": "Wewaria"},
    {"name": "SD KATOLIK KURULIMBU", "kecamatan": "Ndona Timur"},
    {"name": "SD KATOLIK LAINILA", "kecamatan": "Ndona"},
    {"name": "SD KATOLIK LANDOKURA", "kecamatan": "Ndona Timur"},
    {"name": "SD KATOLIK LIAKAMBA", "kecamatan": "Wolojita"},
    {"name": "SD KATOLIK LIKANAKA", "kecamatan": "Wolowaru"},
    {"name": "SD KATOLIK LOBONIKI", "kecamatan": "Kota Baru"},
    {"name": "SD KATOLIK LOKAOJA", "kecamatan": "Kota Baru"},
    {"name": "SD KATOLIK LOKOBOKO", "kecamatan": "Ndona"},
    {"name": "SD KATOLIK MAGEKOBA", "kecamatan": "Detukeli"},
    {"name": "SD KATOLIK MAGENGURA", "kecamatan": "Ende"},
    {"name": "SD KATOLIK MARSUDIRINI", "kecamatan": "Detusoko"},
    {"name": "SD KATOLIK MAUKARO", "kecamatan": "Maukaro"},
    {"name": "SD KATOLIK MBAKAONDO", "kecamatan": "Maukaro"},
    {"name": "SD KATOLIK MBOMBA", "kecamatan": "Ende Utara"},
    {"name": "SD KATOLIK MONDO", "kecamatan": "Ndona"},
    {"name": "SD KATOLIK MUKUSAKI", "kecamatan": "Wewaria"},
    {"name": "SD KATOLIK NABE", "kecamatan": "Maukaro"},
    {"name": "SD KATOLIK NANGAKEO", "kecamatan": "Nangapanda"},
    {"name": "SD KATOLIK NANGAMBOA", "kecamatan": "Nangapanda"},
    {"name": "SD KATOLIK NANGAPANDA 1", "kecamatan": "Nangapanda"},
    {"name": "SD KATOLIK NAZARETH ENDE", "kecamatan": "Ende Timur"},
    {"name": "SD KATOLIK NDETUKUNE", "kecamatan": "Nangapanda"},
    {"name": "SD KATOLIK NDONA 1", "kecamatan": "Ndona"},
    {"name": "SD KATOLIK NDONA 2", "kecamatan": "Ndona"},
    {"name": "SD KATOLIK NDUARIA", "kecamatan": "Kelimutu"},
    {"name": "SD KATOLIK NGALUPOLO", "kecamatan": "Ndona"},
    {"name": "SD KATOLIK NGEBONDANA", "kecamatan": "Lio Timur"},
    {"name": "SD KATOLIK NGGELA 1", "kecamatan": "Wolojita"},
    {"name": "SD KATOLIK NGGESADETU", "kecamatan": "Detukeli"},
    {"name": "SD KATOLIK NIDA", "kecamatan": "Detukeli"},
    {"name": "SD KATOLIK NIOPANDA", "kecamatan": "Kota Baru"},
    {"name": "SD KATOLIK NIRANANGA", "kecamatan": "Nangapanda"},
    {"name": "SD KATOLIK NUABOSI", "kecamatan": "Ende"},
    {"name": "SD KATOLIK NUAMULU", "kecamatan": "Wolojita"},
    {"name": "SD KATOLIK NUAMURI 1", "kecamatan": "Kelimutu"},
    {"name": "SD KATOLIK NUAULU", "kecamatan": "Wolowaru"},
    {"name": "SD KATOLIK NUAWIKA", "kecamatan": "Lepembusu Kelisoke"},
    {"name": "SD KATOLIK NUMBA", "kecamatan": "Wewaria"},
    {"name": "SD KATOLIK OKA", "kecamatan": "Wolowaru"},
    {"name": "SD KATOLIK ONEKORE 1", "kecamatan": "Ende Tengah"},
    {"name": "SD KATOLIK ONEKORE 2", "kecamatan": "Ende Tengah"},
    {"name": "SD KATOLIK PAAPINGGA", "kecamatan": "Ndona Timur"},
    {"name": "SD KATOLIK PANAMATA", "kecamatan": "Ende"},
    {"name": "SD KATOLIK PAUMERE", "kecamatan": "Nangapanda"},
    {"name": "SD KATOLIK PAUPIRE", "kecamatan": "Ende Tengah"},
    {"name": "SD KATOLIK PEIBENGA", "kecamatan": "Lepembusu Kelisoke"},
    {"name": "SD KATOLIK PEMO 1", "kecamatan": "Kelimutu"},
    {"name": "SD KATOLIK PEMO 2", "kecamatan": "Wolowaru"},
    {"name": "SD KATOLIK PISA TANAAU", "kecamatan": "Lepembusu Kelisoke"},
    {"name": "SD KATOLIK PISE", "kecamatan": "Kota Baru"},
    {"name": "SD KATOLIK PISOMBOPO", "kecamatan": "Nangapanda"},
    {"name": "SD KATOLIK PORA", "kecamatan": "Wolojita"},
    {"name": "SD KATOLIK PUUBHETO", "kecamatan": "Ende"},
    {"name": "SD KATOLIK PUUFEO", "kecamatan": "Ende Utara"},
    {"name": "SD KATOLIK PUUKOU", "kecamatan": "Nangapanda"},
    {"name": "SD KATOLIK PUUTUGA", "kecamatan": "Ndona"},
    {"name": "SD KATOLIK RANGA", "kecamatan": "Detusoko"},
    {"name": "SD KATOLIK RANOKOLO", "kecamatan": "Maurole"},
    {"name": "SD KATOLIK RATEMBUE", "kecamatan": "Wolowaru"},
    {"name": "SD KATOLIK RATERORU", "kecamatan": "Detusoko"},
    {"name": "SD KATOLIK REKA", "kecamatan": "Ndona"},
    {"name": "SD KATOLIK ROGA", "kecamatan": "Ndona Timur"},
    {"name": "SD KATOLIK ROWOREKE 1", "kecamatan": "Ende Timur"},
    {"name": "SD KATOLIK ROWOREKE 2", "kecamatan": "Ende Timur"},
    {"name": "SD KATOLIK SAGA", "kecamatan": "Detusoko"},
    {"name": "SD KATOLIK SEULAKO", "kecamatan": "Ndona Timur"},
    {"name": "SD KATOLIK SOKORIA 1", "kecamatan": "Ndona Timur"},
    {"name": "SD KATOLIK SOKORIA 2", "kecamatan": "Ndona Timur"},
    {"name": "SD KATOLIK ST AMBROSIUS ENDE 6", "kecamatan": "Ende Utara"},
    {"name": "SD KATOLIK ST ANTONIUS ENDE 2", "kecamatan": "Ende Utara"},
    {"name": "SD KATOLIK ST THERESIA ENDE 3", "kecamatan": "Ende Tengah"},
    {"name": "SD KATOLIK TANAJEA", "kecamatan": "Nangapanda"},
    {"name": "SD KATOLIK TENDA", "kecamatan": "Wolojita"},
    {"name": "SD KATOLIK TOBA", "kecamatan": "Ndona Timur"},
    {"name": "SD KATOLIK WAGA", "kecamatan": "Wolojita"},
    {"name": "SD KATOLIK WAKA", "kecamatan": "Wewaria"},
    {"name": "SD KATOLIK WATUKAMBA", "kecamatan": "Maurole"},
    {"name": "SD KATOLIK WATUMITE", "kecamatan": "Nangapanda"},
    {"name": "SD KATOLIK WATUNESO", "kecamatan": "Lio Timur"},
    {"name": "SD KATOLIK WATUNGGERE", "kecamatan": "Detukeli"},
    {"name": "SD KATOLIK WATURAKA", "kecamatan": "Kelimutu"},
    {"name": "SD KATOLIK WATUSIPI", "kecamatan": "Ende Utara"},
    {"name": "SD KATOLIK WELAMOSA", "kecamatan": "Wewaria"},
    {"name": "SD KATOLIK WOLOBHETO", "kecamatan": "Lio Timur"},
    {"name": "SD KATOLIK WOLOFEO", "kecamatan": "Detusoko"},
    {"name": "SD KATOLIK WOLOGAI DETUSOKO", "kecamatan": "Detusoko"},
    {"name": "SD KATOLIK WOLOGAI ENDE", "kecamatan": "Ende"},
    {"name": "SD KATOLIK WOLOGERU", "kecamatan": "Detusoko"},
    {"name": "SD KATOLIK WOLOJITA", "kecamatan": "Wolojita"},
    {"name": "SD KATOLIK WOLOKOTA", "kecamatan": "Ndona"},
    {"name": "SD KATOLIK WOLOLANU", "kecamatan": "Wolojita"},
    {"name": "SD KATOLIK WOLOLELE A", "kecamatan": "Lio Timur"},
    {"name": "SD KATOLIK WOLOLELE B", "kecamatan": "Wolowaru"},
    {"name": "SD KATOLIK WOLOMAGE", "kecamatan": "Detusoko"},
    {"name": "SD Katolik Wolomota", "kecamatan": "Lio Timur"},
    {"name": "SD KATOLIK WOLOMUKU", "kecamatan": "Detukeli"},
    {"name": "SD KATOLIK WOLONDOPO 1", "kecamatan": "Wolowaru"},
    {"name": "SD KATOLIK WOLONDOPO 2", "kecamatan": "Detusoko"},
    {"name": "SD KATOLIK WOLOORA", "kecamatan": "Ende"},
    {"name": "SD KATOLIK WOLOSAMBI", "kecamatan": "Lio Timur"},
    {"name": "SD KATOLIK WOLOSOKO", "kecamatan": "Wolowaru"},
    {"name": "SD KATOLIK WOLOTOLO", "kecamatan": "Detusoko"},
    {"name": "SD KATOLIK WOLOTOPO 1", "kecamatan": "Ndona"},
    {"name": "SD KATOLIK WOLOTOPO 2", "kecamatan": "Ndona"},
    {"name": "SD KATOLIK WOLOWARU 1", "kecamatan": "Wolowaru"},
    {"name": "SD KATOLIK WOLOWARU 2", "kecamatan": "Wolowaru"},
    {"name": "SD KATOLIK WOLOWUSU", "kecamatan": "Ndona"},
    {"name": "SD KATOLIK WONDA", "kecamatan": "Ndori"},
    {"name": "SD KATOLIK WOROMBERA", "kecamatan": "Ende"},
    {"name": "SD NEGERI ANAREWA", "kecamatan": "Pulau Ende"},
    {"name": "SD NEGERI DETUBELA 2", "kecamatan": "Lepembusu Kelisoke"},
    {"name": "SD NEGERI EKOREKO", "kecamatan": "Pulau Ende"},
    {"name": "SD NEGERI ENDE 1", "kecamatan": "Ende Utara"},
    {"name": "SD NEGERI ENDE 5", "kecamatan": "Ende Tengah"},
    {"name": "SD NEGERI IPI", "kecamatan": "Ende Selatan"},
    {"name": "SD NEGERI KEDEBODU", "kecamatan": "Ende Timur"},
    {"name": "SD NEGERI KEDOBORO", "kecamatan": "Maurole"},
    {"name": "SD NEGERI KOBALEBA", "kecamatan": "Maukaro"},
    {"name": "SD NEGERI KURUPOKE", "kecamatan": "Detukeli"},
    {"name": "SD NEGERI LELU", "kecamatan": "Lio Timur"},
    {"name": "SD NEGERI MALAARA", "kecamatan": "Nangapanda"},
    {"name": "SD NEGERI MARANUA", "kecamatan": "Ende"},
    {"name": "SD NEGERI MAUNGGORA", "kecamatan": "Nangapanda"},
    {"name": "SD NEGERI MOKEASA", "kecamatan": "Ende"},
    {"name": "SD NEGERI MOLEKELISAMBA", "kecamatan": "Ndori"},
    {"name": "SD NEGERI MOLETEBOSAMA", "kecamatan": "Wolowaru"},
    {"name": "SD NEGERI MOLUTANGGA", "kecamatan": "Wewaria"},
    {"name": "SD NEGERI NUSANGGALA", "kecamatan": "Kota Baru"},
    {"name": "SD NEGERI OJA", "kecamatan": "Nangapanda"},
    {"name": "SD NEGERI PUUTARA", "kecamatan": "Pulau Ende"},
    {"name": "SD NEGERI RATENGGOJI", "kecamatan": "Lepembusu Kelisoke"},
    {"name": "SD NEGERI ROJA 1", "kecamatan": "Ende Selatan"},
    {"name": "SD NEGERI ROJA 3", "kecamatan": "Ende Selatan"},
    {"name": "SD NEGERI ROJA 6", "kecamatan": "Ende Selatan"},
    {"name": "SD NEGERI RUTU JEJA", "kecamatan": "Lepembusu Kelisoke"},
    {"name": "SD NEGERI SARELAKA", "kecamatan": "Lepembusu Kelisoke"},
    {"name": "SD NEGERI SOGOROGA", "kecamatan": "Ende"},
    {"name": "SD NEGERI TURUNALU", "kecamatan": "Detusoko"},
    {"name": "SD NEGERI UMANUBA", "kecamatan": "Nangapanda"},
    {"name": "SD NEGERI WATUBARA", "kecamatan": "Wewaria"},
    {"name": "SD NEGERI WIWIPEMO", "kecamatan": "Wolojita"},
    {"name": "SD NEGERI WOIMITE", "kecamatan": "Wewaria"},
    {"name": "SD NEGERI WOLOARA", "kecamatan": "Kelimutu"},
    {"name": "SD NEGERI WOLOGAWI", "kecamatan": "Wolojita"},
    {"name": "SD NEGERI WOLOHEPO", "kecamatan": "Wolowaru"},
    {"name": "SD NEGERI WOLOMONI", "kecamatan": "Detusoko"},
    {"name": "SD NEGERI WOLONIO", "kecamatan": "Lio Timur"},
    {"name": "SD NEGERI WOLOOJA 2", "kecamatan": "Wewaria"},
    {"name": "SD NEGERI WOLOWARU 3", "kecamatan": "Wolowaru"},
    {"name": "SD SWASTA MUHAMMADYAH ENDE", "kecamatan": "Ende Utara"},
    {"name": "SDN NAKAWARA", "kecamatan": "Ende"},
    {"name": "SDN ULU DALA", "kecamatan": "Maurole"}
];

// ============================================
// 3. LOGIKA APLIKASI UTAMA
// ============================================
const App = {
    currentUser: null,
    userSchool: null, // Sekolah yang sedang login
    userRole: null, // Role: operator atau admin
    selectedPhotos: [],
    debounceTimer: null,
    slideInterval: null,
    currentSlide: 0,

    // ========== INISIALISASI ==========
    init() {
        document.getElementById('upload-date').valueAsDate = new Date();
        
        auth.onAuthStateChanged(user => {
            this.currentUser = user;
            if (user) {
                this.loadOperatorData(user.email);
            } else {
                this.userSchool = null;
                this.userRole = null;
                this.updateUIBasedOnAuth();
            }
        });

        this.loadSchools();
        this.initTheme();
        this.initMobileMenu();
        this.initLoginSlider();
        this.initNavMenu();
        
        console.log('✅ Aplikasi Galeri SD Ende berhasil diinisialisasi');
    },

    // ========== LOAD DATA OPERATOR ==========
    async loadOperatorData(email) {
        try {
            const doc = await db.collection('operators').doc(email).get();
            if (doc.exists) {
                const data = doc.data();
                this.userSchool = data.schoolName;
                this.userRole = data.role || 'operator';
                console.log(`✅ Operator: ${email} | Sekolah: ${this.userSchool} | Role: ${this.userRole}`);
            } else {
                this.userSchool = null;
                this.userRole = null;
                this.showToast('Akun Anda belum terdaftar sebagai operator sekolah.', 'error');
                auth.signOut();
            }
            this.updateUIBasedOnAuth();
        } catch (error) {
            console.error('Error loading operator data:', error);
            this.showToast('Gagal memuat data operator.', 'error');
        }
    },

    // ========== THEME TOGGLE ==========
    initTheme() {
        const saved = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', saved);
        this.updateThemeIcon(saved);

        document.getElementById('theme-toggle').addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            this.updateThemeIcon(next);
        });
    },

    updateThemeIcon(theme) {
        const icon = document.querySelector('#theme-toggle i');
        if (icon) {
            icon.className = theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
        }
    },

    // ========== MOBILE MENU ==========
    initMobileMenu() {
        const toggle = document.getElementById('mobile-toggle');
        const menu = document.getElementById('nav-menu');
        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                menu.classList.toggle('active');
            });
        }
    },

    // ========== NAVIGATION ==========
    initNavMenu() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.navigate(page);
            });
        });
    },

    navigate(pageId) {
        if (pageId === 'upload' && !this.currentUser) {
            this.showToast('Silakan login terlebih dahulu', 'error');
            pageId = 'login';
        }

        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));

        const targetPage = document.getElementById(`page-${pageId}`);
        if (targetPage) targetPage.classList.add('active');
        
        const navItem = document.querySelector(`.nav-item[data-page="${pageId}"]`);
        if (navItem) navItem.classList.add('active');

        document.getElementById('nav-menu').classList.remove('active');

        if (pageId === 'stats') this.loadStats();
        if (pageId === 'gallery') this.loadGalleryWithFilters({});

        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    updateUIBasedOnAuth() {
        const userProfile = document.getElementById('user-profile');
        const userName = document.getElementById('user-name');
        const btnLogin = document.getElementById('btn-login');
        const navUpload = document.getElementById('nav-upload');
        const uploadSchoolSelect = document.getElementById('upload-school');

        if (this.currentUser && this.userSchool) {
            if (userProfile) userProfile.style.display = 'flex';
            if (userName) userName.textContent = this.userSchool;
            if (btnLogin) btnLogin.style.display = 'none';
            if (navUpload) navUpload.style.display = 'flex';

            // Update dropdown upload: hanya tampilkan sekolah yang login
            if (uploadSchoolSelect) {
                uploadSchoolSelect.innerHTML = '';
                const option = document.createElement('option');
                option.value = this.userSchool;
                option.textContent = this.userSchool;
                option.selected = true;
                uploadSchoolSelect.appendChild(option);
                uploadSchoolSelect.disabled = true; // Tidak bisa diganti
            }
        } else {
            if (userProfile) userProfile.style.display = 'none';
            if (btnLogin) btnLogin.style.display = 'flex';
            if (navUpload) navUpload.style.display = 'none';
            
            // Reset dropdown
            if (uploadSchoolSelect) {
                uploadSchoolSelect.innerHTML = '<option value="">-- Pilih Sekolah --</option>';
                uploadSchoolSelect.disabled = false;
            }
        }
    },

    // ========== LOGIN SLIDER ==========
    initLoginSlider() {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        if (slides.length === 0) return;

        this.currentSlide = 0;

        const goToSlide = (index) => {
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            slides[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');
            this.currentSlide = index;
        };

        const nextSlide = () => {
            const next = (this.currentSlide + 1) % slides.length;
            goToSlide(next);
        };

        const startSlide = () => {
            this.stopSlide();
            this.slideInterval = setInterval(nextSlide, 5000);
        };

        this.stopSlide = () => {
            if (this.slideInterval) clearInterval(this.slideInterval);
        };

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.stopSlide();
                goToSlide(index);
                startSlide();
            });
        });

        const visual = document.querySelector('.login-visual');
        if (visual) {
            visual.addEventListener('mouseenter', () => this.stopSlide());
            visual.addEventListener('mouseleave', startSlide);
        }

        startSlide();
    },

    // ========== AUTHENTICATION ==========
    async handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        try {
            await auth.signInWithEmailAndPassword(email, password);
            this.showToast('Login berhasil! Memuat data sekolah...', 'success');
        } catch (error) {
            this.showToast('Email atau password salah.', 'error');
        }
    },

    handleLogout() {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            auth.signOut();
            this.showToast('Anda telah keluar.', 'success');
        }
    },

    // ========== LOAD SCHOOLS (Untuk Filter Galeri) ==========
    loadSchools() {
        schoolsData.sort((a, b) => a.name.localeCompare(b.name));
        
        const filterSelect = document.getElementById('filter-sekolah');
        if (filterSelect) {
            schoolsData.forEach(school => {
                const opt = document.createElement('option');
                opt.value = school.name;
                opt.textContent = school.name;
                filterSelect.appendChild(opt);
            });
        }
    },

    // ========== PHOTO HANDLING ==========
    async handlePhotoSelect(event) {
        const files = Array.from(event.target.files);
        if (files.length > 5) {
            this.showToast('Maksimal 5 foto per kegiatan!', 'error');
            event.target.value = '';
            return;
        }

        const previewContainer = document.getElementById('photo-preview');
        if (previewContainer) previewContainer.innerHTML = '';
        this.selectedPhotos = [];
        this.showToast('Sedang mengompres foto...', 'success');

        for (let file of files) {
            try {
                const compressedFile = await imageCompression(file, {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true
                });
                this.selectedPhotos.push(compressedFile);

                const reader = new FileReader();
                reader.onload = (e) => {
                    const div = document.createElement('div');
                    div.className = 'preview-item';
                    div.innerHTML = `
                        <img src="${e.target.result}" alt="Preview">
                        <button type="button" class="remove" onclick="App.removePhoto(this)" title="Hapus">
                            <i class="fa-solid fa-times"></i>
                        </button>
                    `;
                    if (previewContainer) previewContainer.appendChild(div);
                };
                reader.readAsDataURL(compressedFile);
            } catch (error) {
                this.showToast(`Gagal memproses: ${file.name}`, 'error');
            }
        }
    },

    removePhoto(button) {
        const index = Array.from(button.parentElement.parentElement.children).indexOf(button.parentElement);
        this.selectedPhotos.splice(index, 1);
        button.parentElement.remove();
    },

    // ========== UPLOAD ==========
    async handleUpload(event) {
        event.preventDefault();
        if (!this.currentUser || !this.userSchool) {
            this.showToast('Anda belum terdaftar sebagai operator sekolah.', 'error');
            return;
        }

        const form = {
            school: this.userSchool, // Otomatis dari data operator
            title: document.getElementById('upload-title').value.trim(),
            date: document.getElementById('upload-date').value,
            category: document.getElementById('upload-category').value,
            description: document.getElementById('upload-description').value.trim(),
            youtube: document.getElementById('upload-youtube').value.trim()
        };

        let youtubeId = null;
        if (form.youtube) {
            const match = form.youtube.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
            youtubeId = (match && match[2].length === 11) ? match[2] : null;
            if (!youtubeId) {
                this.showToast('Link YouTube tidak valid!', 'error');
                return;
            }
        }

        if (this.selectedPhotos.length === 0) {
            this.showToast('Minimal upload 1 foto!', 'error');
            return;
        }

        const overlay = document.getElementById('upload-overlay');
        if (overlay) overlay.style.display = 'flex';

        try {
            const photoUrls = [];
            const safeSchoolName = form.school.replace(/\s+/g, '-').toLowerCase();

            for (let i = 0; i < this.selectedPhotos.length; i++) {
                const photo = this.selectedPhotos[i];
                const fileName = `${safeSchoolName}/${Date.now()}_${i}_${photo.name}`;
                const storageRef = storage.ref(`activities/${fileName}`);
                await storageRef.put(photo);
                const url = await storageRef.getDownloadURL();
                photoUrls.push(url);
            }

            await db.collection('activities').add({
                schoolName: form.school,
                title: form.title,
                date: form.date,
                category: form.category,
                description: form.description,
                photos: photoUrls,
                youtubeId: youtubeId,
                youtubeUrl: form.youtube,
                uploadedBy: this.currentUser.email,
                status: 'approved',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            this.showToast('✅ Dokumentasi berhasil diupload!', 'success');
            document.getElementById('upload-form').reset();
            const preview = document.getElementById('photo-preview');
            if (preview) preview.innerHTML = '';
            this.selectedPhotos = [];
            document.getElementById('upload-date').valueAsDate = new Date();
            this.navigate('gallery');

        } catch (error) {
            console.error(error);
            this.showToast('Gagal mengupload: ' + error.message, 'error');
        } finally {
            if (overlay) overlay.style.display = 'none';
        }
    },

    // ========== FILTERS ==========
    debounceFilter() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => this.applyFilters(), 500);
    },

    resetFilters() {
        const searchText = document.getElementById('search-text');
        const filterSekolah = document.getElementById('filter-sekolah');
        const filterBulan = document.getElementById('filter-bulan');
        const filterTahun = document.getElementById('filter-tahun');
        const filterTanggal = document.getElementById('filter-tanggal-upload');

        if (searchText) searchText.value = '';
        if (filterSekolah) filterSekolah.value = '';
        if (filterBulan) filterBulan.value = '';
        if (filterTahun) filterTahun.value = '2026';
        if (filterTanggal) filterTanggal.value = '';

        this.applyFilters();
        this.showToast('Filter direset', 'success');
    },

    applyFilters() {
        const searchText = document.getElementById('search-text').value.toLowerCase().trim();
        const filterSekolah = document.getElementById('filter-sekolah').value;
        const filterBulan = document.getElementById('filter-bulan').value;
        const filterTahun = document.getElementById('filter-tahun').value;
        const filterTanggalUpload = document.getElementById('filter-tanggal-upload').value;

        const activeFilters = [];
        if (searchText) activeFilters.push(`Pencarian: "${searchText}"`);
        if (filterSekolah) activeFilters.push(`Sekolah: ${filterSekolah}`);
        if (filterBulan) activeFilters.push(`Bulan: ${this.getBulanName(filterBulan)}`);
        if (filterTahun) activeFilters.push(`Tahun: ${filterTahun}`);
        if (filterTanggalUpload) activeFilters.push(`Tanggal Upload: ${filterTanggalUpload}`);

        const filterInfo = document.getElementById('filter-info');
        if (filterInfo) {
            filterInfo.innerHTML = activeFilters.length > 0 
                ? `<i class="fa-solid fa-filter"></i><span>Filter aktif: ${activeFilters.join(', ')}</span>`
                : `<i class="fa-solid fa-circle-info"></i><span>Menampilkan semua kegiatan</span>`;
        }

        this.loadGalleryWithFilters({ searchText, filterSekolah, filterBulan, filterTahun, filterTanggalUpload });
    },

    getBulanName(bulanNum) {
        const names = {
            '1':'Januari','2':'Februari','3':'Maret','4':'April',
            '5':'Mei','6':'Juni','7':'Juli','8':'Agustus',
            '9':'September','10':'Oktober','11':'November','12':'Desember'
        };
        return names[bulanNum] || '';
    },

    // ========== GALLERY ==========
    async loadGalleryWithFilters(filters = {}) {
        const container = document.getElementById('gallery-container');
        const skeleton = document.getElementById('gallery-skeleton');

        if (container) container.innerHTML = '';
        if (skeleton) {
            skeleton.style.display = 'grid';
            skeleton.innerHTML = Array(6).fill('<div class="skeleton skeleton-card"></div>').join('');
        }

        try {
            const snapshot = await db.collection('activities')
                .orderBy('createdAt', 'desc')
                .limit(100)
                .get();

            if (skeleton) skeleton.style.display = 'none';

            if (snapshot.empty) {
                if (container) {
                    container.innerHTML = `
                        <div class="empty-state">
                            <i class="fa-regular fa-folder-open"></i>
                            <h3>Belum Ada Kegiatan</h3>
                            <p>Jadilah yang pertama mengupload dokumentasi!</p>
                        </div>`;
                }
                return;
            }

            let filteredDocs = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                let pass = true;

                if (filters.searchText) {
                    const title = (data.title || '').toLowerCase();
                    const desc = (data.description || '').toLowerCase();
                    if (!title.includes(filters.searchText) && !desc.includes(filters.searchText)) pass = false;
                }
                if (filters.filterSekolah && data.schoolName !== filters.filterSekolah) pass = false;

                if (filters.filterBulan || filters.filterTahun) {
                    if (data.date) {
                        const dateObj = new Date(data.date);
                        if (filters.filterBulan && (dateObj.getMonth() + 1).toString() !== filters.filterBulan) pass = false;
                        if (filters.filterTahun && dateObj.getFullYear().toString() !== filters.filterTahun) pass = false;
                    } else { pass = false; }
                }

                if (filters.filterTanggalUpload && data.createdAt) {
                    const uploadDateStr = data.createdAt.toDate().toISOString().split('T')[0];
                    if (uploadDateStr !== filters.filterTanggalUpload) pass = false;
                }

                if (pass) filteredDocs.push({ id: doc.id, data });
            });

            if (filteredDocs.length === 0) {
                if (container) {
                    container.innerHTML = `
                        <div class="empty-state">
                            <i class="fa-solid fa-magnifying-glass"></i>
                            <h3>Tidak Ada Hasil</h3>
                            <p>Tidak ada kegiatan yang cocok dengan filter.</p>
                        </div>`;
                }
                return;
            }

            filteredDocs.forEach(doc => {
                const data = doc.data;
                const thumb = data.photos[0];
                const dateStr = data.date 
                    ? new Date(data.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) 
                    : '-';
                
                const card = document.createElement('div');
                card.className = 'gallery-card';
                card.innerHTML = `
                    <div class="gallery-image-wrapper">
                        <img src="${thumb}" alt="${data.title}" loading="lazy">
                    </div>
                    <div class="gallery-content">
                        <h4>${data.title}</h4>
                        <p class="gallery-school"><i class="fa-solid fa-school"></i> ${data.schoolName}</p>
                        <p class="gallery-date"><i class="fa-regular fa-calendar"></i> ${dateStr}</p>
                        ${data.youtubeId ? `
                            <div class="gallery-video">
                                <a href="https://youtu.be/${data.youtubeId}" target="_blank">
                                    <i class="fa-brands fa-youtube"></i> Tonton Video
                                </a>
                            </div>
                        ` : ''}
                        <div class="gallery-meta">
                            <span class="badge">${data.category}</span>
                        </div>
                    </div>
                `;
                if (container) container.appendChild(card);
            });

            this.showToast(`Ditemukan ${filteredDocs.length} kegiatan`, 'success');
        } catch (error) {
            if (skeleton) skeleton.style.display = 'none';
            if (container) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <h3>Gagal Memuat Data</h3>
                        <p>${error.message}</p>
                    </div>`;
            }
        }
    },

    // ========== STATISTICS ==========
    async loadStats() {
        try {
            const snapshot = await db.collection('activities').get();
            
            let totalKegiatan = 0;
            let totalFoto = 0;
            let totalVideo = 0;
            const kategoriCount = {};
            const sekolahCount = {};

            snapshot.forEach(doc => {
                const data = doc.data();
                totalKegiatan++;
                totalFoto += (data.photos || []).length;
                if (data.youtubeId) totalVideo++;

                const kat = data.category || 'Lainnya';
                kategoriCount[kat] = (kategoriCount[kat] || 0) + 1;

                const sch = data.schoolName || 'Tidak Diketahui';
                sekolahCount[sch] = (sekolahCount[sch] || 0) + 1;
            });

            const elKegiatan = document.getElementById('stat-kegiatan');
            const elFoto = document.getElementById('stat-foto');
            const elVideo = document.getElementById('stat-video');
            if (elKegiatan) elKegiatan.textContent = totalKegiatan;
            if (elFoto) elFoto.textContent = totalFoto;
            if (elVideo) elVideo.textContent = totalVideo;

            const katContainer = document.getElementById('kategori-stats');
            if (katContainer) {
                if (Object.keys(kategoriCount).length === 0) {
                    katContainer.innerHTML = '<p class="empty-text">Belum ada data</p>';
                } else {
                    katContainer.innerHTML = Object.entries(kategoriCount)
                        .sort((a, b) => b[1] - a[1])
                        .map(([name, count]) => `
                            <div class="kategori-item">
                                <span class="kategori-name">${name}</span>
                                <span class="kategori-count">${count}</span>
                            </div>
                        `).join('');
                }
            }

            const topContainer = document.getElementById('top-sekolah');
            if (topContainer) {
                const topSekolah = Object.entries(sekolahCount)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10);
                
                if (topSekolah.length === 0) {
                    topContainer.innerHTML = '<p class="empty-text">Belum ada data</p>';
                } else {
                    topContainer.innerHTML = topSekolah.map(([name, count], idx) => `
                        <div class="top-item">
                            <span class="top-name">${idx + 1}. ${name}</span>
                            <span class="top-count">${count}</span>
                        </div>
                    `).join('');
                }
            }

        } catch (error) {
            console.error('Stats error:', error);
        }
    },

    // ========== TOAST NOTIFICATION ==========
    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '<i class="fa-solid fa-circle-check" style="color: var(--success);"></i>',
            error: '<i class="fa-solid fa-circle-xmark" style="color: var(--danger);"></i>',
            warning: '<i class="fa-solid fa-triangle-exclamation" style="color: var(--warning);"></i>'
        };
        
        toast.innerHTML = `${icons[type] || icons.success} <span>${message}</span>`;
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
};

// ============================================
// START APLIKASI
// ============================================
document.addEventListener('DOMContentLoaded', () => App.init());
