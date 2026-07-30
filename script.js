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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

let selectedPhotos = [];
let currentUser = null;

// ============================================
// 2. AUTHENTICATION & NAVIGATION
// ============================================
auth.onAuthStateChanged(user => {
    currentUser = user;
    const userInfoEl = document.getElementById('user-info');
    const btnLogout = document.getElementById('btn-logout');
    const btnLogin = document.getElementById('btn-login');

    if (user) {
        userInfoEl.textContent = `Login sebagai: ${user.email}`;
        btnLogout.style.display = 'inline-block';
        btnLogin.style.display = 'none';
    } else {
        userInfoEl.textContent = '';
        btnLogout.style.display = 'none';
        btnLogin.style.display = 'inline-block';
    }
});

function showPage(pageName) {
    if (pageName === 'upload' && !currentUser) {
        showAlert('upload-alert', 'Silakan login terlebih dahulu!', 'error');
        pageName = 'login';
    }
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));
    
    document.getElementById(`page-${pageName}`).classList.add('active');
    const btn = document.getElementById(`btn-${pageName}`);
    if(btn) btn.classList.add('active');
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            showAlert('login-alert', 'Login berhasil!', 'success');
            setTimeout(() => showPage('upload'), 1000);
        })
        .catch(error => {
            showAlert('login-alert', 'Login gagal: ' + error.message, 'error');
        });
}

function handleLogout() {
    auth.signOut().then(() => {
        showPage('gallery');
    });
}

// ============================================
// 3. PHOTO COMPRESSION & PREVIEW
// ============================================
async function handlePhotoSelect(event) {
    const files = Array.from(event.target.files);
    if (files.length > 5) {
        showAlert('upload-alert', 'Maksimal 5 foto per kegiatan!', 'error');
        return;
    }
    
    const previewContainer = document.getElementById('photo-preview');
    previewContainer.innerHTML = '';
    selectedPhotos = [];
    
    for (let file of files) {
        try {
            const compressedFile = await imageCompression(file, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            });
            selectedPhotos.push(compressedFile);
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const div = document.createElement('div');
                div.className = 'preview-item';
                div.innerHTML = `<img src="${e.target.result}" alt="Preview"><button type="button" class="remove" onclick="removePhoto(this)">×</button>`;
                previewContainer.appendChild(div);
            };
            reader.readAsDataURL(compressedFile);
        } catch (error) {
            showAlert('upload-alert', `Gagal memproses foto: ${file.name}`, 'error');
        }
    }
}

function removePhoto(button) {
    const index = Array.from(button.parentElement.parentElement.children).indexOf(button.parentElement);
    selectedPhotos.splice(index, 1);
    button.parentElement.remove();
}

function extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// ============================================
// 4. UPLOAD TO FIREBASE
// ============================================
async function handleUpload(event) {
    event.preventDefault();
    if (!currentUser) return;

    const school = document.getElementById('upload-school').value;
    const title = document.getElementById('upload-title').value;
    const date = document.getElementById('upload-date').value;
    const category = document.getElementById('upload-category').value;
    const description = document.getElementById('upload-description').value;
    const youtubeLink = document.getElementById('upload-youtube').value;

    let youtubeId = youtubeLink ? extractYouTubeId(youtubeLink) : null;
    if (youtubeLink && !youtubeId) {
        showAlert('upload-alert', 'Link YouTube tidak valid!', 'error');
        return;
    }

    if (selectedPhotos.length === 0) {
        showAlert('upload-alert', 'Minimal upload 1 foto!', 'error');
        return;
    }

    document.getElementById('upload-loading').style.display = 'block';
    document.getElementById('upload-form').style.display = 'none';

    try {
        const photoUrls = [];
        for (let i = 0; i < selectedPhotos.length; i++) {
            const photo = selectedPhotos[i];
            const fileName = `${school.replace(/\s+/g, '-').toLowerCase()}/${Date.now()}_${i}_${photo.name}`;
            const storageRef = storage.ref(`activities/${fileName}`);
            
            await storageRef.put(photo);
            const url = await storageRef.getDownloadURL();
            photoUrls.push(url);
        }

        await db.collection('activities').add({
            schoolName: school,
            title: title,
            date: date,
            category: category,
            description: description,
            photos: photoUrls,
            youtubeId: youtubeId,
            youtubeUrl: youtubeLink,
            uploadedBy: currentUser.email,
            status: 'approved',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        showAlert('upload-alert', '✅ Kegiatan berhasil diupload!', 'success');
        document.getElementById('upload-form').reset();
        document.getElementById('photo-preview').innerHTML = '';
        selectedPhotos = [];
        document.getElementById('upload-date').value = new Date().toISOString().split('T')[0];
        
    } catch (error) {
        console.error(error);
        showAlert('upload-alert', '❌ Error: ' + error.message, 'error');
    } finally {
        document.getElementById('upload-loading').style.display = 'none';
        document.getElementById('upload-form').style.display = 'block';
    }
}

// ============================================
// 5. LOAD GALLERY FROM FIRESTORE
// ============================================
async function loadGallery() {
    const container = document.getElementById('gallery-container');
    const loading = document.getElementById('gallery-loading');
    
    container.innerHTML = '';
    loading.style.display = 'block';

    try {
        const snapshot = await db.collection('activities')
            .orderBy('createdAt', 'desc')
            .limit(20)
            .get();

        loading.style.display = 'none';

        if (snapshot.empty) {
            container.innerHTML = '<p class="empty-state">Belum ada data kegiatan.</p>';
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            const thumb = data.photos[0];
            const dateStr = data.date ? new Date(data.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';
            
            const card = document.createElement('div');
            card.className = 'gallery-card';
            card.innerHTML = `
                <img src="${thumb}" alt="${data.title}" loading="lazy">
                <div class="content">
                    <h4>${data.title}</h4>
                    <p><strong>${data.schoolName}</strong></p>
                    <p>📅 ${dateStr}</p>
                    <p>${data.description || ''}</p>
                    ${data.youtubeId ? `<p>🎥 <a href="https://youtu.be/${data.youtubeId}" target="_blank" style="color:#667eea;">Tonton Video</a></p>` : ''}
                    <div class="meta">
                        <span class="badge">${data.category}</span>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        loading.style.display = 'none';
        container.innerHTML = `<p class="empty-state" style="color: red;">Gagal memuat data: ${error.message}</p>`;
    }
}

// ============================================
// 6. UTILITY
// ============================================
function showAlert(containerId, message, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => { container.innerHTML = ''; }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('upload-date').value = new Date().toISOString().split('T')[0];
});