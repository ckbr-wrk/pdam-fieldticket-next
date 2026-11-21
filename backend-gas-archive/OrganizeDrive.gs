/**
 * OrganizeDrive.gs
 * Merapikan Google Drive dengan memindahkan file dan folder yang tersebar di root
 * ke dalam folder masing-masing project:
 * 1. 📁 PDAM - FieldTicket (Utama)
 * 2. 📁 PDAM - Rekap DSR Wilayah
 * 3. 📁 PDAM - FieldTicket (Clone)
 */

function organizeDriveProjects() {
  var root = DriveApp.getRootFolder();
  var log = [];

  function logMsg(msg) {
    Logger.log(msg);
    log.push(msg);
  }

  // 1. Dapatkan atau buat folder masing-masing project
  var folderFieldTicket = _getOrCreateProjectFolder('📁 PDAM - FieldTicket (Utama)');
  var folderRekapDSR    = _getOrCreateProjectFolder('📁 PDAM - Rekap DSR Wilayah');
  var folderClone       = _getOrCreateProjectFolder('📁 PDAM - FieldTicket (Clone)');

  logMsg('Folder project siap:');
  logMsg('- ' + folderFieldTicket.getName() + ' : ' + folderFieldTicket.getUrl());
  logMsg('- ' + folderRekapDSR.getName() + ' : ' + folderRekapDSR.getUrl());
  logMsg('- ' + folderClone.getName() + ' : ' + folderClone.getUrl());

  // Helper pindah file
  function moveFile(file, targetFolder) {
    try {
      if (typeof file.moveTo === 'function') {
        file.moveTo(targetFolder);
        return true;
      }
    } catch (e) {}
    try {
      targetFolder.addFile(file);
      root.removeFile(file);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Helper pindah subfolder
  function moveFolder(subFolder, targetFolder) {
    if (subFolder.getId() === targetFolder.getId()) return false;
    try {
      if (typeof subFolder.moveTo === 'function') {
        subFolder.moveTo(targetFolder);
        return true;
      }
    } catch (e) {}
    try {
      targetFolder.addFolder(subFolder);
      root.removeFolder(subFolder);
      return true;
    } catch (e) {
      return false;
    }
  }

  var movedFiles = [];
  var movedFolders = [];

  // 2. Scan subfolder di root Drive Saya
  var folders = root.getFolders();
  while (folders.hasNext()) {
    var f = folders.next();
    var fName = f.getName();

    // Skip folder project utama itu sendiri
    if (f.getId() === folderFieldTicket.getId() || 
        f.getId() === folderRekapDSR.getId() || 
        f.getId() === folderClone.getId()) {
      continue;
    }

    if (/PDAM.*Clone|Clone.*FieldTicket/i.test(fName)) {
      moveFolder(f, folderClone);
      movedFolders.push({ name: fName, to: folderClone.getName() });
    } else if (/PDAM-FieldTicket-Photos|FieldTicket.*Photo|PDAM.*Photos/i.test(fName)) {
      moveFolder(f, folderFieldTicket);
      movedFolders.push({ name: fName, to: folderFieldTicket.getName() });
    } else if (/Rekap.*DSR|DSR.*Wilayah/i.test(fName)) {
      moveFolder(f, folderRekapDSR);
      movedFolders.push({ name: fName, to: folderRekapDSR.getName() });
    }
  }

  // 3. Scan file di root Drive Saya
  var files = root.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    var fileName = file.getName();

    // Jangan pindahkan file yang sudah berada di dalam folder project
    if (/Clone/i.test(fileName) && /PDAM|FieldTicket/i.test(fileName)) {
      moveFile(file, folderClone);
      movedFiles.push({ name: fileName, to: folderClone.getName() });
    } else if (/FieldTicket|Field\s*Ticket/i.test(fileName)) {
      moveFile(file, folderFieldTicket);
      movedFiles.push({ name: fileName, to: folderFieldTicket.getName() });
    } else if (/Rekap\s*DSR|Laporan.*Wilayah|LPP\s*CLOS/i.test(fileName)) {
      moveFile(file, folderRekapDSR);
      movedFiles.push({ name: fileName, to: folderRekapDSR.getName() });
    }
  }

  // 4. Coba pindahkan Apps Script project saat ini jika masih di root
  try {
    var currentScriptId = ScriptApp.getScriptId();
    if (currentScriptId) {
      var scriptFile = DriveApp.getFileById(currentScriptId);
      var parents = scriptFile.getParents();
      var isInRoot = false;
      while (parents.hasNext()) {
        if (parents.next().getId() === root.getId()) {
          isInRoot = true;
          break;
        }
      }
      if (isInRoot) {
        var target = (scriptFile.getName().indexOf('Clone') !== -1) ? folderClone : folderFieldTicket;
        moveFile(scriptFile, target);
        movedFiles.push({ name: scriptFile.getName() + ' (Script File)', to: target.getName() });
      }
    }
  } catch (err) {
    logMsg('Note move script: ' + err.message);
  }

  return {
    success: true,
    foldersCreated: [
      { name: folderFieldTicket.getName(), url: folderFieldTicket.getUrl() },
      { name: folderRekapDSR.getName(), url: folderRekapDSR.getUrl() },
      { name: folderClone.getName(), url: folderClone.getUrl() }
    ],
    movedFolders: movedFolders,
    movedFiles: movedFiles,
    log: log
  };
}

function _getOrCreateProjectFolder(name) {
  var folders = DriveApp.getFoldersByName(name);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(name);
}
