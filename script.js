/**
 * Galeri Dokumentasi SD Kabupaten Ende
 * Professional Vanilla JS Architecture
 * Version: 2.0 - Full Features
 */

const App = {
    // ============================================
    // 1. KONFIGURASI FIREBASE
    // ============================================
    config: {
        apiKey: "AIzaSyBYb9zFaKSASEmpQK2NKChv7aj9tSTTGIM",
        authDomain: "galeri-kegiatan-ende.firebaseapp.com",
        projectId: "galeri-kegiatan-ende",
        storageBucket: "galeri-kegiatan-ende.firebasestorage.app",
        messagingSenderId: "1036576141299",
        appId: "1:1036576141299:web:89d70636e1f91850916c86",
        measurementId: "G-9QTLLP3YC3"
    },

    // ============================================
    // 2. STATE APLIKASI
    // ============================================
    db: null,
    auth: null,
    storage: null,
    currentUser: null,
    selectedPhotos: [],
    debounceTimer: null,

    // ============================================
    // 3. INISIALISASI APLIKASI
    // ============================================
    init() {
        // Initialize Firebase
        firebase.initializeApp(this.config);
        this.auth = firebase.auth();
        this.db = firebase.firestore();
        this.storage = firebase.storage();

        // Set default tanggal hari ini
        document.getElementById('upload-date').valueAsDate = new Date();

        // Auth State Listener
        this.auth.onAuthStateChanged(user => {
            this.currentUser = user;
            this.updateUIBasedOnAuth();
        });

        // Load daftar sekolah untuk filter
        this.loadSchools();

        console.log("✅ Aplikasi Galeri SD Ende berhasil diinisialisasi.");
    },

    // ============================================
    // 4. NAVIGASI HALAMAN
    // ============================================
    navigate(pageId) {
        // Cek akses upload
        if (pageId === 'upload' && !this.currentUser) {
            this.showToast('Silakan login terlebih dahulu', 'error');
            pageId = 'login';
        }

        // Sembunyikan semua halaman
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));

        // Tampilkan halaman yang dipilih
        document.getElementById(`page-${pageId}`).classList.add('active');
        const navBtn = document.getElementById(`nav-${pageId}`);
        if (navBtn) navBtn.classList.add('active');
    },

    updateUIBasedOnAuth() {
        const userArea = document.getElementById('user-area');
        const userEmail = document.getElementById('user-email');
        const navLogin = document.getElementById('nav-login');
        const navUpload = document.getElementById('nav-upload');

        if (this.currentUser) {
            userArea.style.display = 'flex';
            userEmail.textContent = this.currentUser.email;
            navLogin.style.display = 'none';
            navUpload.style.display = 'inline-flex';
        } else {
            userArea.style.display = 'none';
            navLogin.style.display = 'inline-flex';
            navUpload.style.display = 'none';
            this.navigate('gallery');
        }
    },

    // ============================================
    // 5. AUTHENTICATION (LOGIN/LOGOUT)
    // ============================================
    async handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        try {
            await this.auth.signInWithEmailAndPassword(email, password);
            this.showToast('Login berhasil! Selamat datang.', 'success');
            this.navigate('upload');
            document.getElementById('login-form').reset();
        } catch (error) {
            this.showToast(this.getAuthErrorMessage(error.code), 'error');
        }
    },

    handleLogout() {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            this.auth.signOut();
            this.showToast('Anda telah keluar.', 'success');
        }
    },

    getAuthErrorMessage(code) {
        const messages = {
            'auth/invalid-email': 'Format email tidak valid.',
            'auth/user-disabled': 'Akun ini telah dinonaktifkan.',
            'auth/user-not-found': 'Email tidak terdaftar.',
            'auth/wrong-password': 'Password salah.',
            'auth/too-many-requests': 'Terlalu banyak percobaan. Coba lagi nanti.',
            'auth/invalid-credential': 'Email atau password salah.'
        };
        return messages[code] || 'Terjadi kesalahan saat login.';
    },

    // ============================================
    // 6. LOAD DAFTAR SEKOLAH
    // ============================================
    async loadSchools() {
        try {
            const snapshot = await this.db.collection('schools').orderBy('name').get();
            const select = document.getElementById('filter-sekolah');

            // Kosongkan opsi kecuali yang pertama
            select.innerHTML = '<option value="">Semua Sekolah</option>';

            if (snapshot.empty) {
                // Fallback: sekolah hardcoded jika Firestore kosong
                const fallbackSchools = [
                    "SD NEGERI 1 ENDE",
                    "SD INPRES AEDARI",
                    "SD KATOLIK ENDE 8"
                ];
                fallbackSchools.forEach(school => {
                    const option = document.createElement('option');
                    option.value = school;
                    option.textContent = school;
                    select.appendChild(option);
                });
                console.log("⚠️ Menggunakan daftar sekolah fallback.");
            } else {
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const option = document.createElement('option');
                    option.value = data.name;
                    option.textContent = data.name;
                    select.appendChild(option);
                });
                console.log(`✅ ${snapshot.size} sekolah dimuat dari database.`);
            }
        } catch (error) {
            console.error("❌ Gagal memuat daftar sekolah:", error);
        }
    },

    // ============================================
    // 7. PENANGANAN FOTO & KOMPRESI
    // ============================================
    async handlePhotoSelect(event) {
        const files = Array.from(event.target.files);
        if (files.length > 5) {
            this.showToast('Maksimal 5 foto per kegiatan!', 'error');
            event.target.value = '';
            return;
        }

        const previewContainer = document.getElementById('photo-preview');
        previewContainer.innerHTML = '';
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
                    previewContainer.appendChild(div);
                };
                reader.readAsDataURL(compressedFile);
            } catch (error) {
                console.error(error);
                this.showToast(`Gagal memproses: ${file.name}`, 'error');
            }
        }
    },

    removePhoto(button) {
        const index = Array.from(button.parentElement.parentElement.children).indexOf(button.parentElement);
        this.selectedPhotos.splice(index, 1);
        button.parentElement.remove();
    },

    // ============================================
    // 8. UPLOAD KEGIATAN
    // ============================================
    async handleUpload(event) {
        event.preventDefault();
        if (!this.currentUser) return;

        const form = {
            school: document.getElementById('upload-school').value,
            title: document.getElementById('upload-title').value.trim(),
            date: document.getElementById('upload-date').value,
            category: document.getElementById('upload-category').value,
            description: document.getElementById('upload-description').value.trim(),
            youtube: document.getElementById('upload-youtube').value.trim()
        };

        // Validasi YouTube
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

        // Tampilkan overlay loading
        document.getElementById('upload-overlay').style.display = 'flex';

        try {
            const photoUrls = [];
            const safeSchoolName = form.school.replace(/\s+/g, '-').toLowerCase();

            // Upload foto ke Firebase Storage
            for (let i = 0; i < this.selectedPhotos.length; i++) {
                const photo = this.selectedPhotos[i];
                const fileName = `${safeSchoolName}/${Date.now()}_${i}_${photo.name}`;
                const storageRef = this.storage.ref(`activities/${fileName}`);

                await storageRef.put(photo);
                const url = await storageRef.getDownloadURL();
                photoUrls.push(url);
            }

            // Simpan metadata ke Firestore
            await this.db.collection('activities').add({
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

            // Reset form
            document.getElementById('upload-form').reset();
            document.getElementById('photo-preview').innerHTML = '';
            this.selectedPhotos = [];
            document.getElementById('upload-date').valueAsDate = new Date();

            // Pindah ke galeri
            this.navigate('gallery');
            this.loadGalleryWithFilters({});

        } catch (error) {
            console.error("❌ Upload Error:", error);
            this.showToast('Gagal mengupload: ' + error.message, 'error');
        } finally {
            document.getElementById('upload-overlay').style.display = 'none';
        }
    },

    // ============================================
    // 9. FILTER & GALERI
    // ============================================
    debounceFilter() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.applyFilters();
        }, 500);
    },

    resetFilters() {
        document.getElementById('search-text').value = '';
        document.getElementById('filter-sekolah').value = '';
        document.getElementById('filter-bulan').value = '';
        document.getElementById('filter-tahun').value = '2026';
        document.getElementById('filter-tanggal-upload').value = '';
        this.applyFilters();
        this.showToast('Filter direset', 'success');
    },

    applyFilters() {
        const searchText = document.getElementById('search-text').value.toLowerCase().trim();
        const filterSekolah = document.getElementById('filter-sekolah').value;
        const filterBulan = document.getElementById('filter-bulan').value;
        const filterTahun = document.getElementById('filter-tahun').value;
        const filterTanggalUpload = document.getElementById('filter-tanggal-upload').value;

        // Update info filter
        const filterInfo = document.getElementById('filter-info');
        const activeFilters = [];
        if (searchText) activeFilters.push(`Pencarian: "${searchText}"`);
        if (filterSekolah) activeFilters.push(`Sekolah: ${filterSekolah}`);
        if (filterBulan) activeFilters.push(`Bulan: ${this.getBulanName(filterBulan)}`);
        if (filterTahun) activeFilters.push(`Tahun: ${filterTahun}`);
        if (filterTanggalUpload) activeFilters.push(`Tanggal Upload: ${filterTanggalUpload}`);

        if (activeFilters.length > 0) {
            filterInfo.innerHTML = `<i class="fa-solid fa-filter"></i><span>Filter aktif: ${activeFilters.join(', ')}</span>`;
        } else {
            filterInfo.innerHTML = `<i class="fa-solid fa-info-circle"></i><span>Menampilkan semua kegiatan</span>`;
        }

        this.loadGalleryWithFilters({
            searchText,
            filterSekolah,
            filterBulan,
            filterTahun,
            filterTanggalUpload
        });
    },

    getBulanName(bulanNum) {
        const bulanNames = {
            '1': 'Januari', '2': 'Februari', '3': 'Maret', '4': 'April',
            '5': 'Mei', '6': 'Juni', '7': 'Juli', '8': 'Agustus',
            '9': 'September', '10': 'Oktober', '11': 'November', '12': 'Desember'
        };
        return bulanNames[bulanNum] || '';
    },

    async loadGalleryWithFilters(filters = {}) {
        const container = document.getElementById('gallery-container');
        const skeleton = document.getElementById('gallery-skeleton');

        container.innerHTML = '';
        skeleton.style.display = 'grid';
        skeleton.innerHTML = Array(6).fill('<div class="skeleton skeleton-card"></div>').join('');

        try {
            // Query dasar: ambil 100 data terbaru
            const snapshot = await this.db.collection('activities')
                .orderBy('createdAt', 'desc')
                .limit(100)
                .get();

            skeleton.style.display = 'none';

            if (snapshot.empty) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fa-regular fa-folder-open"></i>
                        <p>Belum ada data kegiatan.</p>
                    </div>`;
                return;
            }

            let filteredDocs = [];

            snapshot.forEach(doc => {
                const data = doc.data();
                let pass = true;

                // Filter 1: Search Text (judul atau deskripsi)
                if (filters.searchText) {
                    const title = (data.title || '').toLowerCase();
                    const desc = (data.description || '').toLowerCase();
                    if (!title.includes(filters.searchText) && !desc.includes(filters.searchText)) {
                        pass = false;
                    }
                }

                // Filter 2: Nama Sekolah
                if (filters.filterSekolah && data.schoolName !== filters.filterSekolah) {
                    pass = false;
                }

                // Filter 3 & 4: Bulan dan Tahun (dari field 'date')
                if (filters.filterBulan || filters.filterTahun) {
                    if (data.date) {
                        const dateObj = new Date(data.date);
                        const docBulan = (dateObj.getMonth() + 1).toString();
                        const docTahun = dateObj.getFullYear().toString();

                        if (filters.filterBulan && docBulan !== filters.filterBulan) {
                            pass = false;
                        }
                        if (filters.filterTahun && docTahun !== filters.filterTahun) {
                            pass = false;
                        }
                    } else {
                        pass = false;
                    }
                }

                // Filter 5: Tanggal Upload (dari field 'createdAt')
                if (filters.filterTanggalUpload && data.createdAt) {
                    const uploadDate = data.createdAt.toDate();
                    const uploadDateStr = uploadDate.toISOString().split('T')[0];
                    if (uploadDateStr !== filters.filterTanggalUpload) {
                        pass = false;
                    }
                }

                if (pass) {
                    filteredDocs.push({ id: doc.id, data });
                }
            });

            // Tampilkan hasil
            if (filteredDocs.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <p>Tidak ada kegiatan yang cocok dengan filter.</p>
                    </div>`;
                return;
            }

            filteredDocs.forEach(doc => {
                const data = doc.data;
                const thumb = data.photos[0];
                const dateStr = data.date ? new Date(data.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';

                const card = document.createElement('div');
                card.className = 'gallery-card';
                card.innerHTML = `
                    <img src="${thumb}" alt="${data.title}" loading="lazy">
                    <div class="gallery-content">
                        <h4>${data.title}</h4>
                        <p style="color: var(--primary); font-weight: 600; font-size: 0.9rem;">${data.schoolName}</p>
                        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">
                            <i class="fa-regular fa-calendar"></i> ${dateStr}
                        </p>
                        ${data.youtubeId ? `<p style="margin-top: 0.5rem;"><a href="https://youtu.be/${data.youtubeId}" target="_blank" style="color: var(--danger); text-decoration: none;"><i class="fa-brands fa-youtube"></i> Tonton Video</a></p>` : ''}
                        <div class="gallery-meta">
                            <span class="badge">${data.category}</span>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });

            this.showToast(`Ditemukan ${filteredDocs.length} kegiatan`, 'success');

        } catch (error) {
            console.error("❌ Filter Error:", error);
            skeleton.style.display = 'none';
            container.innerHTML = `
                <div class="empty-state" style="color: var(--danger);">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <p>Gagal memuat data: ${error.message}</p>
                </div>`;
        }
    },

    // Alias untuk tombol "Muat Data"
    async loadGallery() {
        await this.loadGalleryWithFilters({});
    },

    // ============================================
    // 10. UTILITY: TOAST NOTIFICATION
    // ============================================
    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icon = type === 'success'
            ? '<i class="fa-solid fa-circle-check" style="color: var(--success);"></i>'
            : '<i class="fa-solid fa-circle-xmark" style="color: var(--danger);"></i>';

        toast.innerHTML = `${icon} <span>${message}</span>`;
        container.appendChild(toast);

        // Hapus setelah 4 detik
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
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
