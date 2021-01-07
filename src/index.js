const { app, BrowserWindow, Menu, ipcMain, dialog, globalShortcut } = require('electron');
const path = require('path');
const mysql = require('mysql');
const os = require('os');

const pool  = mysql.createPool({
      connectionLimit : 10,
      host            : 'localhost',
      user            : 'root',
      password        : '',
      database        : 'pikul'
})

if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow, pinjamWindow, mahasiswaWindow, barangWindow;
let bantuanWindow, tentangWindow;

const createWindow = () => {
  globalShortcut.register('Esc', () => {
      let win = BrowserWindow.getFocusedWindow()
      if(win == pinjamWindow) return;
      win.close()
  })

  mainWindow = new BrowserWindow({
    title: 'Pinjaman Kuliah',
    width: 400,
    maxWidth: 400,
    height: 400,
    maxHeight: 400,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    },
    icon: `${__dirname}/logo.png`
  });

  mainWindow.loadFile(path.join(__dirname, 'splash.html'));
  Menu.setApplicationMenu(null);
};

const pWindow = () => {

  pinjamWindow = new BrowserWindow({
    title: 'Pinjaman Kuliah',
    width: 900,
    maxWidth: 900,
    height: 700,
    maxHeight: 700,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    },
    icon: `${__dirname}/logo.png`
  });

  pinjamWindow.loadFile(path.join(__dirname, 'pinjam.html'));
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuPinjam));

  pinjamWindow.on('close', (event) => {
    const buttonChoice = dialog.showMessageBoxSync(pinjamWindow, {
      type: 'info',
      title: 'Keluar',
      defaultId: 0,
      cancelId: 0,
      message: 'Apakah anda yakin ingin keluar?',
      buttons: ['Batal', 'Ya']
    })
    if(buttonChoice == 1){
      pinjamWindow.destroy()
    }else{
      event.preventDefault();
    };
  })

};

const mWindow = () => {

  mahasiswaWindow = new BrowserWindow({
    title: 'Mahasiswa',
    parent: pinjamWindow,
    width: 700,
    height: 500,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    },
    icon: `${__dirname}/logo.png`
  });

  mahasiswaWindow.loadFile(path.join(__dirname, 'mahasiswa.html'));
  mahasiswaWindow.setMenu(null)

};

const bWindow = () => {

  barangWindow = new BrowserWindow({
    title: 'Barang',
    parent: pinjamWindow,
    width: 700,
    height: 500,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    },
    icon: `${__dirname}/logo.png`
  });

  barangWindow.loadFile(path.join(__dirname, 'barang.html'));
  barangWindow.setMenu(null)

};

const hWindow = () => {
  bantuanWindow = new BrowserWindow({
    title: 'Bantuan',
    parent: pinjamWindow,
    width: 500,
    height: 500,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    },
    icon: `${__dirname}/logo.png`
  });

  bantuanWindow.loadFile(path.join(__dirname, 'bantuan.html'));
  bantuanWindow.setMenu(null)

};

const tWindow = () => {

  tentangWindow = new BrowserWindow({
    title: 'Tentang',
    parent: pinjamWindow,
    width: 500,
    height: 500,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    },
    icon: `${__dirname}/logo.png`
  });

  tentangWindow.loadFile(path.join(__dirname, 'tentang.html'));
  tentangWindow.setMenu(null)

};

const antiDouble = (winName) => {
  let allWindows = BrowserWindow.getAllWindows()
  let windowsTitle = allWindows.map( window => window.title)
  if(windowsTitle.includes(winName)){
    return false;
  }else{
    return true;
  }
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const menuPinjam = [
  {
    label: 'Bantuan (F1)',
    accelerator: 'F1',
    click(){
      (antiDouble('Bantuan')) ? hWindow() : dialog.showErrorBox('Perhatian','Jendela Bantuan Sudah Dibuka!');
    }
  },{
    label: 'Mahasiswa (F2)',
    accelerator: 'F2',
    click(){
      (antiDouble('Mahasiswa')) ? mWindow() : dialog.showErrorBox('Perhatian','Jendela Mahasiswa Sudah Dibuka!');
    }
  },{
    label: 'Barang (F3)',
    accelerator: 'F3',
    click(){
      (antiDouble('Barang')) ? bWindow() : dialog.showErrorBox('Perhatian','Jendela Barang Sudah Dibuka!');
    }
  },{
    label: 'Tentang (F4)',
    accelerator: 'F4',
    click(){
      (antiDouble('Tentang')) ? tWindow() : dialog.showErrorBox('Perhatian','Jendela Tentang Sudah Dibuka!');
    }
  }
];


// Window API

ipcMain.on("loginlog", (event, [username, password]) => {
  pool.getConnection((err, koneksi)  => {
    if(err) {
      dialog.showErrorBox('Database Connection Failed','Please turn on XAMPP and Create Database with name "pikul"!');
    };

    let sql = `SELECT * FROM adm WHERE usr = '${username}' AND pwd = '${password}'`;

    koneksi.query(sql, (err, res, fie) => {
      if(err) console.error(err);
      if(res.length == 0){
        koneksi.release()
        dialog.showErrorBox('Login Failed','Unknown Username or Password!');

      }else{
        koneksi.release();
        pWindow();
        mainWindow.close();

      }
    })
  })
})

// Pinjam

ipcMain.on("pinjamlihat", (event) => {
  pool.getConnection((err, koneksi)  => {
    if(err) {
      dialog.showErrorBox('Database Connection Failed','Please turn on XAMPP and Create Database with name "pikul"!');
    };

    let sql = `SELECT idPjm, idNm, idBrg, jmlPjm, nama, stsPjm, namaBarang FROM pjm LEFT JOIN mhs ON pjm.idNm = mhs.nim LEFT JOIN brg ON pjm.idBrg = brg.idBarang`;

    koneksi.query(sql, (err, res, fie) => {
      if(err) console.error(err);
      if(res.length == 0){
        koneksi.release()
        dialog.showMessageBoxSync(pinjamWindow,{type: "info", title:'Info', message: 'Belum Ada Pikulan'})

      }else{
        koneksi.release();
        let pikulan = '';
        for(let p of res){
          if(p.stsPjm == "telat"){
            pikulan += `<tr class="jatuhTempo">
                <td>${p.idPjm}</td>
                <td onclick='set(${p.idNm}, "${p.idBrg}",${p.jmlPjm}, ${p.idPjm})'>${p.nama}</td>
                <td>${p.namaBarang}</td>
                <td>Rp. ${p.jmlPjm}</td>
                </tr>`;
          }else{
            pikulan += `<tr>
                <td>${p.idPjm}</td>
                <td onclick='set(${p.idNm}, "${p.idBrg}", ${p.jmlPjm}, ${p.idPjm})'>${p.nama}</td>
                <td>${p.namaBarang}</td>
                <td>Rp. ${p.jmlPjm}</td>
                </tr>`;
          }
        }
        event.reply('exista', pikulan)

      }
    })
  })
})

ipcMain.on("pinjammhs", (event) => {
  pool.getConnection((err, koneksi)  => {
    if(err) {
      dialog.showErrorBox('Database Connection Failed','Please turn on XAMPP and Create Database with name "pikul"!');
    };

    let sqlMhs = `SELECT nim FROM mhs`;

    koneksi.query(sqlMhs, (err, res, fie) => {
      if(err) console.error(err);
      if(res.length == 0){
        koneksi.release()
        dialog.showMessageBoxSync(pinjamWindow,{type: "info", title:'Info', message: 'Mahasiswa Masih Kosong!'})

      }else{
        koneksi.release();
        let optnim = '';
        for(let on of res){

          optnim += `<option class="mopt" value="${on.nim}">${on.nim}</option>`;
        }
        event.reply('existb', optnim)

      }
    })
  })
})

ipcMain.on("pinjambrg", (event) => {
  pool.getConnection((err, koneksi)  => {
    if(err) {
      dialog.showErrorBox('Database Connection Failed','Please turn on XAMPP and Create Database with name "pikul"!');
    };

    let sqlBrg = `SELECT idBarang FROM brg`;

    koneksi.query(sqlBrg, (err, res, fie) => {
      if(err) console.error(err);
      if(res.length == 0){
        koneksi.release()
        dialog.showMessageBoxSync(pinjamWindow,{type: "info", title:'Info', message: 'Barang Masih Kosong!'})

      }else{
        koneksi.release();
        let optidbrg = '';
        for(let oib of res){

          optidbrg += `<option class="bopt" value="${oib.idBarang}">${oib.idBarang}</option>`;
        }
        event.reply('existc', optidbrg)

      }
    })
  })
})

ipcMain.on("pinjampikul", (event, [mhs, brg, hrg]) => {
  pool.getConnection((err, koneksi)  => {
    if(err) {
      dialog.showErrorBox('Database Connection Failed','Please turn on XAMPP and Create Database with name "pikul"!');
    };

    let sqlCheck = `SELECT * FROM pjm WHERE idNm = ${mhs}`;
    let sql = `INSERT INTO pjm VALUES (NULL, ${mhs},'${brg}', ${hrg}, NULL)`;

    koneksi.query(sqlCheck, (err, res, fie) => {
      if(err) console.error(err);
      if(res.length != 0){
        koneksi.release()
        dialog.showMessageBoxSync(pinjamWindow,{type: "error", title:'Gagal Membuat Pikulan!', message: 'Mahasiswa Sudah Punya Pikulan Yang Harus Dituntaskan!'})
      }else{
        koneksi.query(sql, (err, res, fie) => {
          if(err) console.error(err);
          koneksi.release();
          dialog.showMessageBoxSync(pinjamWindow,{type: "info", title:'Berhasil', message: 'Berhasil Menambahkan Mahasiswa'})
          pinjamWindow.webContents.reload();
        })
      }
    })
  })
})

ipcMain.on("pinjamcicil", (event, [mhs, brg, hrg]) => {
  pool.getConnection((err, koneksi)  => {
    if(err) {
      dialog.showErrorBox('Database Connection Failed','Please turn on XAMPP and Create Database with name "pikul"!');
    };

    let sqlCheck = `SELECT jmlPjm FROM pjm WHERE idNm = ${mhs}`;

    koneksi.query(sqlCheck, (err, res, fie) => {
      if(err) console.error(err);
      if(res.length == 0){
        koneksi.release()
        dialog.showMessageBoxSync(pinjamWindow,{type: "error", title:'Gagal Membuat Pikulan!', message: 'Mahasiswa Tidak Punya Pikulan!'})
      }else if(hrg > res[0].jmlPjm){
        koneksi.release()
        dialog.showMessageBoxSync(pinjamWindow,{type: "error", title:'Gagal Membuat Pikulan!', message: 'Cicilan Melebihi Jumlah Tagihan!'})
      }else{
        let sql;
        if( hrg == res[0].jmlPjm){
          sql = `DELETE FROM pjm WHERE idNm = ${mhs}`;
        }else{
          hrg = res[0].jmlPjm - hrg;
          sql = `UPDATE pjm SET jmlPjm = ${hrg}, stsPjm = NULL WHERE idNm = ${mhs}`;
        }
        koneksi.query(sql, (err, res, fie) => {
          if(err) console.error(err);
          koneksi.release();
          dialog.showMessageBoxSync(pinjamWindow,{type: "info", title:'Berhasil', message: 'Berhasil Melakukan Cicilan'})
          pinjamWindow.webContents.reload();
        })
      }
    })
  })
})

ipcMain.on("pinjamtelat", (event, mhs) => {
  pool.getConnection((err, koneksi)  => {
    if(err) {
      dialog.showErrorBox('Database Connection Failed','Please turn on XAMPP and Create Database with name "pikul"!');
    };

    let sqlCheck = `SELECT * FROM pjm WHERE idNm = ${mhs}`;

    koneksi.query(sqlCheck, (err, res, fie) => {
      if(err) console.error(err);
      if(res.length == 0){
        koneksi.release()
        dialog.showMessageBoxSync(pinjamWindow,{type: "error", title:'Gagal', message: 'Mahasiswa Tersebut Tidak Memiliki Pikulan!'})

      }else{
        let sql;
        if( res[0].stsPjm == 'telat'){
          sql = `UPDATE pjm SET stsPjm = 'NULL' WHERE idNm = ${mhs}`;
        }else{
          sql = `UPDATE pjm SET stsPjm = 'telat' WHERE idNm = ${mhs}`;
        }
        koneksi.query(sql, (err, res, fie) => {
          if(err) console.error(err);
          koneksi.release();
          dialog.showMessageBoxSync(pinjamWindow,{type: "info", title:'Berhasil', message: 'Berhasil Menandai Mahasiswa Telat'})
          pinjamWindow.webContents.reload();
        })
      }
    })
  })
})

// Mahasiswa
ipcMain.on("mahasiswalihat", (event) => {
  pool.getConnection((err, koneksi)  => {
    if(err) {
      dialog.showErrorBox('Database Connection Failed','Please turn on XAMPP and Create Database with name "pikul"!');
    };

    let sql = `SELECT * FROM mhs`;

    koneksi.query(sql, (err, res, fie) => {
      if(err) console.error(err);
      if(res.length == 0){
        koneksi.release()
        dialog.showMessageBoxSync(mahasiswaWindow,{type: "info", title:'Info', message: 'Belum Ada Mahasiswa'})

      }else{
        koneksi.release();
        let mahasiswa = '';
        let nomor = 1;
        for(let m of res){
            mahasiswa += `<tr>
                <td>${nomor++}</td>
                <td id="${m.nim}" contenteditable="true">${m.nim}</td>
                <td id="${m.nama}" contenteditable="true">${m.nama}</td>
                <td><button onclick="ubahM('${m.nim}','${m.nama}')">Ubah</button><button class="telat" onclick="hapusM(${m.nim})">Hapus</button></td>
                </tr>`;
        }
        event.reply('mada', mahasiswa)

      }
    })
  })
})

ipcMain.on("mahasiswatambah", (event, [nim, nama]) => {
  pool.getConnection((err, koneksi)  => {
    if(err) {
      dialog.showErrorBox('Database Connection Failed','Please turn on XAMPP and Create Database with name "pikul"!');
    };

    let sqlCheck = `SELECT * FROM mhs WHERE nim = ${nim}`;
    let sql = `INSERT INTO mhs VALUES (${nim},'${nama}')`;

    koneksi.query(sqlCheck, (err, res, fie) => {
      if(err) console.error(err);
      if(res.length != 0){
        koneksi.release()
        dialog.showMessageBoxSync(mahasiswaWindow,{type: "error", title:'Gagal', message: 'Mahasiswa Sudah Ada!'})
      }else{
        koneksi.query(sql, (err, res, fie) => {
          if(err) console.error(err);
          koneksi.release();
          dialog.showMessageBoxSync(mahasiswaWindow,{type: "info", title:'Berhasil', message: 'Berhasil Menambahkan Mahasiswa'})
          mahasiswaWindow.webContents.reload();
        })
      }
    })
  })
})

ipcMain.on("mahasiswahapus", (event, nim) => {
  pool.getConnection((err, koneksi)  => {
    if(err) {
      dialog.showErrorBox('Database Connection Failed','Please turn on XAMPP and Create Database with name "pikul"!');
    };

    let sql = `DELETE FROM mhs WHERE nim = ${nim}`;

    koneksi.query(sql, (err, res, fie) => {
      if(err) console.error(err);
          koneksi.release();
          dialog.showMessageBoxSync(mahasiswaWindow,{type: "info", title:'Berhasil', message: `Berhasil Menghapus Mahasiswa Dengan NIM ${nim}`})
          mahasiswaWindow.webContents.reload();
          pinjamWindow.webContents.reload();

    })
  })
})

ipcMain.on("mahasiswaubah", (event, [nim, nama]) => {
  pool.getConnection((err, koneksi)  => {
    if(err) {
      dialog.showErrorBox('Database Connection Failed','Please turn on XAMPP and Create Database with name "pikul"!');
    };

    let sql = `UPDATE mhs SET nim = ${nim}, nama = '${nama}' WHERE nim = ${nim}`;

    koneksi.query(sql, (err, res, fie) => {
      if(err) console.log(err);
        koneksi.release();
        dialog.showMessageBoxSync(mahasiswaWindow,{type: "info", title:'Berhasil', message: 'Berhasil Mengubah Mahasiswa'})
        mahasiswaWindow.webContents.reload();
        pinjamWindow.webContents.reload();

    })
  })
})

// Barang
ipcMain.on("baranglihat", (event) => {
  pool.getConnection((err, koneksi)  => {
    if(err) {
      dialog.showErrorBox('Database Connection Failed','Please turn on XAMPP and Create Database with name "pikul"!');
    };

    let sql = `SELECT * FROM brg`;

    koneksi.query(sql, (err, res, fie) => {
      if(err) console.error(err);
      if(res.length == 0){
        koneksi.release()
        dialog.showMessageBoxSync(barangWindow,{type: "info", title:'Info', message: 'Belum Ada Barang'})

      }else{
        koneksi.release();
        let barang = `<input type="hidden" id="totalbarang" value="${res.length+1}"`;
        for(let b of res){
            barang += `<tr>
                <td id='${b.idBarang}'>${b.idBarang}</td>
                <td contenteditable='true' id='${b.namaBarang}'>${b.namaBarang}</td>
                <td contenteditable='true' id='${b.hargaBarang}'>${b.hargaBarang}</td>
                <td><button onclick="ubahB('${b.idBarang}','${b.namaBarang}','${b.hargaBarang}')">Ubah</button><button class="telat" onclick="hapusB('${b.idBarang}')">Hapus</button></td>
                </tr>`;
        }
        event.reply('bada', barang)

      }
    })
  })
})

ipcMain.on("barangtambah", (event, [nb, h, t]) => {
  pool.getConnection((err, koneksi)  => {
    if(err) {
      dialog.showErrorBox('Database Connection Failed','Please turn on XAMPP and Create Database with name "pikul"!');
    };
    let sqlCheck = `SELECT * FROM brg WHERE namaBarang = '${nb}'`;
    koneksi.query(sqlCheck, (err, res, fie) => {
      if(err) console.error(err);
      if(res.length != 0){
        koneksi.release()
        dialog.showMessageBoxSync(barangWindow,{type: "error", title:'Gagal', message: 'Barang Sudah Ada!'})
      }else{
      let idb = nb.split(' ').map( el => el.substring(0,1)).join('')+(h+"").substring(0,1)+t;
      let sql = `INSERT INTO brg VALUES ('${idb}','${nb}','${h}')`;
        koneksi.query(sql, (err, res, fie) => {
          if(err) console.error(err);
          koneksi.release();
          dialog.showMessageBoxSync(mahasiswaWindow,{type: "info", title:'Berhasil', message: 'Berhasil Menambahkan Barang'})
          barangWindow.webContents.reload();
        })
      }
    })
  })
})

ipcMain.on("baranghapus", (event, id) => {
  pool.getConnection((err, koneksi)  => {
    if(err) {
      dialog.showErrorBox('Database Connection Failed','Please turn on XAMPP and Create Database with name "pikul"!');
    };

    let sql = `DELETE FROM brg WHERE idBarang = '${id}'`;

    koneksi.query(sql, (err, res, fie) => {
      if(err) console.error(err);
          koneksi.release();
          dialog.showMessageBoxSync(barangWindow,{type: "info", title:'Berhasil', message: `Berhasil Menghapus Barang`})
          barangWindow.webContents.reload();
          pinjamWindow.webContents.reload();
    })
  })
})

ipcMain.on("barangubah", (event, [idb, nmb, hrb, tb]) => {
  pool.getConnection((err, koneksi)  => {
    if(err) {
      dialog.showErrorBox('Database Connection Failed','Please turn on XAMPP and Create Database with name "pikul"!');
    };
    let nidb = nmb.split(' ').map( el => el.substring(0,1)).join('')+(hrb+"").substring(0,1)+tb;
    let sql = `UPDATE brg SET idBarang = '${nidb}', namaBarang = '${nmb}', hargaBarang = ${hrb} WHERE idBarang = '${idb}'`;

    koneksi.query(sql, (err, res, fie) => {
      if(err) console.log(err);
        koneksi.release();
        dialog.showMessageBoxSync(barangWindow,{type: "info", title:'Berhasil', message: 'Berhasil Mengubah Barang'})
        barangWindow.webContents.reload();
        pinjamWindow.webContents.reload();

    })
  })
})
