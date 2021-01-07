const {
    contextBridge,
    ipcRenderer
} = require("electron");

contextBridge.exposeInMainWorld(
    'splash',
  {
    change: () => {
      setTimeout( () => {document.location.href = 'login.html'}, 5000);
    }
  }
);

contextBridge.exposeInMainWorld(
    'login',
    {
      log: (username, password) => {
        ipcRenderer.send('loginlog', (event, [username, password]))
      }
    }
);


contextBridge.exposeInMainWorld(
    'pinjam',
  {

    lihat: () => {
      ipcRenderer.send('pinjamlihat', (event))
      ipcRenderer.on('exista', (event, pikulan) => {
        document.getElementById('pjm').innerHTML += pikulan;
      })
    },

    mhs: () => {
      ipcRenderer.send('pinjammhs', (event))
      ipcRenderer.on('existb', (event, optnim) => {
        document.getElementById('mahasiswa').innerHTML += optnim;
      })
    },

    brg: () => {
      ipcRenderer.send('pinjambrg', (event))
      ipcRenderer.on('existc', (event, optidbrg) => {
        document.getElementById('barang').innerHTML += optidbrg;
      })
    },

    pikul: (mhs, brg, hrg) => {
      ipcRenderer.send('pinjampikul', (event, [mhs, brg, hrg]))
    },

    cicil: (mhs, brg, hrg) => {
      ipcRenderer.send('pinjamcicil', (event, [mhs, brg, hrg]))
    },

    telat: (mhs) => {
      ipcRenderer.send('pinjamtelat', (event, mhs))
    },

    cetak: () => {

    }
  }
);

contextBridge.exposeInMainWorld(
    'mahasiswa',
  {

    lihat: () => {
      ipcRenderer.send('mahasiswalihat', (event))
      ipcRenderer.on('mada', (event, mahasiswa) => {
        document.getElementById('mhs').innerHTML += mahasiswa;
      })
    },
    tambah: (nim, nama) => {
      ipcRenderer.send('mahasiswatambah', (event, [nim, nama]))
    },
    hapus: (nim) => {
      ipcRenderer.send('mahasiswahapus', (event, nim))
    },
    ubah: (nim, nama) => {
      ipcRenderer.send('mahasiswaubah', (event, [nim, nama]))
    }
  }
);

contextBridge.exposeInMainWorld(
    'barang',
  {

    lihat: () => {
      ipcRenderer.send('baranglihat', (event))
      ipcRenderer.on('bada', (event, barang) => {
        document.getElementById('brg').innerHTML += barang;
      })
    },
    tambah: (nb, h, t) => {
      ipcRenderer.send('barangtambah', (event, [nb, h, t]))
    },
    hapus: (id) => {
      ipcRenderer.send('baranghapus', (event, id))
    },
    ubah: (idb, nmb, hrb, tb) => {
      ipcRenderer.send('barangubah', (event, [idb, nmb, hrb, tb]))
    }
  }
);
