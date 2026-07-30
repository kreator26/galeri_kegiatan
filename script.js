/**
 * Galeri Dokumentasi SD Kabupaten Ende
 * Professional Vanilla JS Architecture
 */

const App = {
    // Konfigurasi Firebase
    config: {
        apiKey: "AIzaSyBYb9zFaKSASEmpQK2NKChv7aj9tSTTGIM",
        authDomain: "galeri-kegiatan-ende.firebaseapp.com",
        projectId: "galeri-kegiatan-ende",
        storageBucket: "galeri-kegiatan-ende.firebasestorage.app",
        messagingSenderId: "1036576141299",
        appId: "1:1036576141299:web:89d70636e1f91850916c86",
        measurementId: "G-9QTLLP3YC3"
    },
    
    // State
    db: null,
    auth: null,
    storage: null,
    currentUser: null,
    selectedPhotos: [],

    /**
     * Inisialisasi Aplikasi
     */
    init() {
        firebase.initializeApp(this.config);
        this.auth = firebase.auth();
        this.db = firebase.firestore();
        this.storage = firebase.storage();

        // Set default date
        document.getElementById('upload-date').valueAsDate = new Date();

        // Auth State Listener
        this.auth.onAuthStateChanged(user => {
            this.currentUser = user;
            this.updateUIBasedOnAuth();
        });

        console.log("App initialized successfully.");
    },

    /**
     * Navigasi Halaman
     */
    navigate(pageId) {
        if (pageId === 'upload' && !this.currentUser) {
            this.showToast('Silakan login terlebih dahulu', 'error');
            pageId = 'login';
        }

        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));
        
        document.getElementById(`page-${pageId}`).classList.add('active');
        document.getElementById(`nav-${pageId}`).classList.add('active');
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
            navUpload.style.display = 'inline-block';
        } else {
            userArea.style.display = 'none';
            navLogin.style.display = 'inline-block';
            navUpload.style.display = 'none';
            this.navigate('gallery');
        }
    },

    /**
     * Authentication
     */
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
        if(confirm('Apakah Anda yakin ingin keluar?')) {
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
            'auth/too-many-requests': 'Terlalu banyak percobaan. Coba lagi nanti.'
        };
        return messages[code] || 'Terjadi kesalahan saat login.';
    },

    /**
     * Photo Handling & Compression
     */
    async handlePhotoSelect(event) {
        const files = Array.from(event.target.files);
        if (files.length > 5) {
            this.showToast('Maksimal 5 foto per kegiatan!', 'error');
            event.target.value = ''; // Reset input
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

    /**
     * Upload Logic
     */
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

        // UI Loading State
        document.getElementById('upload-overlay').style.display = 'flex';

        try {
            const photoUrls = [];
            const safeSchoolName = form.school.replace(/\s+/g, '-').toLowerCase();

            // Upload ke Storage
            for (let i = 0; i < this.selectedPhotos.length; i++) {
                const photo = this.selectedPhotos[i];
                const fileName = `${safeSchoolName}/${Date.now()}_${i}_${photo.name}`;
                const storageRef = this.storage.ref(`activities/${fileName}`);
                
                await storageRef.put(photo);
                const url = await storageRef.getDownloadURL();
                photoUrls.push(url);
            }

            // Simpan ke Firestore
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

            this.showToast('Dokumentasi berhasil diupload!', 'success');
            
            // Reset Form
            document.getElementById('upload-form').reset();
            document.getElementById('photo-preview').innerHTML = '';
            this.selectedPhotos = [];
            document.getElementById('upload-date').valueAsDate = new Date();
            this.navigate('gallery');

        } catch (error) {
            console.error("Upload Error:", error);
            this.showToast('Gagal mengupload: ' + error.message, 'error');
        } finally {
            document.getElementById('upload-overlay').style.display = 'none';
        }
    },

    /**
     * Gallery Logic
     */
        async loadGallery() {
        const container = document.getElementById('gallery-container');
        const skeleton = document.getElementById('gallery-skeleton');
        
        container.innerHTML = '';
        skeleton.style.display = 'grid';
        
        // Generate skeleton items
        skeleton.innerHTML = Array(6).fill('<div class="skeleton skeleton-card"></div>').join('');

        try {
            const snapshot = await this.db.collection('activities')
                .orderBy('createdAt', 'desc')
                .limit(20)
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

            snapshot.forEach(doc => {
                const data = doc.data();
                const thumb = data.photos[0];
                const dateStr = data.date ? new Date(data.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';
                
                const card = document.createElement('div');
                card.className = 'gallery-card';
                // PERBAIKAN: Menambahkan tanda '>' yang hilang di sini
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
        } catch (error) {
            console.error("Gallery Error:", error);
            skeleton.style.display = 'none';
            container.innerHTML = `
                <div class="empty-state" style="color: var(--danger);">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <p>Gagal memuat data. Periksa koneksi internet Anda.</p>
                </div>`;
        }
    },
    /**
     * Utility: Toast Notification
     */
    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? '<i class="fa-solid fa-circle-check" style="color: var(--success);"></i>' 
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

// Start App
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
