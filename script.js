const tbody = document.getElementById("jadwalBody");
const countdownEl = document.getElementById("countdown");
const tanggalEl = document.getElementById("tanggalSekarang");
const ramadhanEl = document.getElementById("ramadhanHari");

// ========================
// RENDER TABEL
// ========================
jadwal.forEach(data => {
    let row = `
    <tr id="hari-${data.hari}">
        <td>${data.hari}</td>
        <td>${data.imsak}</td>
        <td>${data.subuh}</td>
        <td>${data.dzuhur}</td>
        <td>${data.ashar}</td>
        <td>${data.maghrib}</td>
        <td>${data.isya}</td>
    </tr>`;
    tbody.innerHTML += row;
});

// ========================
// TANGGAL HARI INI
// ========================
let now = new Date();
tanggalEl.innerHTML = now.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
});

// ========================
// HITUNG HARI RAMADHAN
// ========================
const awalRamadhan = new Date("2026-02-19");
awalRamadhan.setHours(0,0,0,0);
now.setHours(0,0,0,0);

let selisihHari = Math.floor((now - awalRamadhan) / (1000 * 60 * 60 * 24)) + 1;

if (selisihHari > 0 && selisihHari <= 30) {
    ramadhanEl.innerHTML = "Hari ke-" + selisihHari + " Ramadhan 1447 H";

    // Highlight otomatis hari ini
    const rowHariIni = document.getElementById("hari-" + selisihHari);
    if (rowHariIni) {
        rowHariIni.classList.add("highlight");
    }
} else {
    ramadhanEl.innerHTML = "Di luar periode Ramadhan";
}

// ========================
// COUNTDOWN IMSYAK & MAGHRIB + AUDIO
// ========================
function updateCountdown() {
    if (selisihHari > 0 && selisihHari <= 30) {

        let nowTime = new Date();
        const audio = document.getElementById("audioAdzan");

        // ====================
        // IMSYAK
        // ====================
        let imsakTime = jadwal[selisihHari - 1].imsak.split(":");
        let targetImsak = new Date();
        targetImsak.setHours(imsakTime[0]);
        targetImsak.setMinutes(imsakTime[1]);
        targetImsak.setSeconds(0);

        let diffImsak = targetImsak - nowTime;

        // ====================
        // MAGHRIB
        // ====================
        let maghribTime = jadwal[selisihHari - 1].maghrib.split(":");
        let targetMaghrib = new Date();
        targetMaghrib.setHours(maghribTime[0]);
        targetMaghrib.setMinutes(maghribTime[1]);
        targetMaghrib.setSeconds(0);

        let diffMaghrib = targetMaghrib - nowTime;

        if (diffImsak > 0) {

            let jam = Math.floor(diffImsak / (1000 * 60 * 60));
            let menit = Math.floor((diffImsak / (1000 * 60)) % 60);
            let detik = Math.floor((diffImsak / 1000) % 60);

            countdownEl.innerHTML =
                "Menuju Imsyak ⏳ " +
                String(jam).padStart(2, "0") + ":" +
                String(menit).padStart(2, "0") + ":" +
                String(detik).padStart(2, "0");

        } else if (diffMaghrib > 0) {

            let jam = Math.floor(diffMaghrib / (1000 * 60 * 60));
            let menit = Math.floor((diffMaghrib / (1000 * 60)) % 60);
            let detik = Math.floor((diffMaghrib / 1000) % 60);

            countdownEl.innerHTML =
                "Menuju Berbuka 🌙 " +
                String(jam).padStart(2, "0") + ":" +
                String(menit).padStart(2, "0") + ":" +
                String(detik).padStart(2, "0");

        } else {

            countdownEl.innerHTML = "Waktu Berbuka Telah Tiba 🌙";

            if (audio) {
                audio.play().catch(() => {
                    console.log("Audio perlu interaksi user dulu.");
                });
            }
        }

    } else {
        countdownEl.innerHTML = "--:--:--";
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ========================
// TOMBOL BERFUNGSI SEMUA
// ========================

// Scroll ke hari ini
function hariIni() {
    if (selisihHari > 0 && selisihHari <= 30) {
        const row = document.getElementById("hari-" + selisihHari);
        if (row) {
            row.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    } else {
        alert("Saat ini bukan bulan Ramadhan.");
    }
}

// Scroll ke awal tabel
function scrollAwal() {
    document.querySelector(".table-wrapper").scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Scroll ke akhir tabel
function scrollAkhir() {
    const wrapper = document.querySelector(".table-wrapper");
    wrapper.scrollTo({
        top: wrapper.scrollHeight,
        behavior: "smooth"
    });
}

// ========================
// SERVICE WORKER
// ========================
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log("Service Worker aktif"))
    .catch(err => console.log("SW gagal:", err));
}