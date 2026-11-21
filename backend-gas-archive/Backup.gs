// ============================================================
// Backup.gs — Automated Daily & Manual Database Backup Service
// PDAM FieldTicket
// ============================================================

var BACKUP_FOLDER_NAME = '📁 PDAM - FieldTicket Backup';
var BACKUP_RETENTION_DAYS = 30;

/**
 * Get or create the dedicated backup folder inside Google Drive.
 * Safe fallback implementation.
 */
function getBackupFolder() {
  var props = PropertiesService.getScriptProperties();
  var savedFolderId = props.getProperty('BACKUP_FOLDER_ID');
  
  if (savedFolderId) {
    try {
      var folder = DriveApp.getFolderById(savedFolderId);
      if (folder && !folder.isTrashed()) return folder;
    } catch (e) {
      Logger.log('Saved backup folder invalid, recreating: ' + e.message);
    }
  }

  // Find or create in project folder or root
  var parentFolder = null;
  var projectFolderId = props.getProperty('PROJECT_FOLDER_ID');
  if (projectFolderId) {
    try { parentFolder = DriveApp.getFolderById(projectFolderId); } catch (e) {}
  }
  if (!parentFolder) {
    try { parentFolder = DriveApp.getRootFolder(); } catch (e) {}
  }

  try {
    if (parentFolder) {
      var iter = parentFolder.getFoldersByName(BACKUP_FOLDER_NAME);
      var backupFolder = iter.hasNext() ? iter.next() : parentFolder.createFolder(BACKUP_FOLDER_NAME);
      props.setProperty('BACKUP_FOLDER_ID', backupFolder.getId());
      return backupFolder;
    }
  } catch (e) {
    Logger.log('Error creating backup folder: ' + e.message);
  }

  return null;
}

/**
 * Perform database backup:
 * 1. Copies the primary Spreadsheet database
 * 2. Places it in the dedicated backup folder
 * 3. Removes backups older than 30 days
 * 4. Updates last backup properties
 */
function performDatabaseBackup(actor) {
  var props = PropertiesService.getScriptProperties();
  var spreadsheetId = props.getProperty('SPREADSHEET_ID');
  if (!spreadsheetId) {
    throw new Error('Database Spreadsheet belum terkonfigurasi di sistem.');
  }

  var sourceFile = DriveApp.getFileById(spreadsheetId);
  var targetFolder = getBackupFolder();
  if (!targetFolder) {
    targetFolder = DriveApp.getRootFolder();
  }

  var now = new Date();
  var dateStr = Utilities.formatDate(now, 'Asia/Jakarta', 'yyyy-MM-dd_HHmmss');
  var backupName = 'Backup_Database_PDAM_' + dateStr;

  // Make copy directly in target folder
  var copyFile = sourceFile.makeCopy(backupName, targetFolder);

  // Clean old backups (> 30 days)
  var deletedCount = 0;
  try {
    deletedCount = cleanOldBackups(targetFolder, BACKUP_RETENTION_DAYS);
  } catch (e) {
    Logger.log('cleanOldBackups warning: ' + e.message);
  }

  var timestampIso = now.toISOString();
  var formattedTime = Utilities.formatDate(now, 'Asia/Jakarta', 'dd/MM/yyyy HH:mm:ss') + ' WIB';

  // Save metadata in ScriptProperties
  props.setProperty('LAST_BACKUP_TIME', formattedTime);
  props.setProperty('LAST_BACKUP_ISO', timestampIso);
  props.setProperty('LAST_BACKUP_FILE_NAME', backupName);
  props.setProperty('LAST_BACKUP_FILE_ID', copyFile.getId());
  props.setProperty('LAST_BACKUP_STATUS', 'SUCCESS');

  try {
    addAuditLog('', actor || 'SYSTEM_CRON', 'DATABASE_BACKUP', '', {
      fileName: backupName,
      fileId: copyFile.getId(),
      folderId: targetFolder.getId(),
      deletedOldCount: deletedCount
    });
  } catch (e) {}

  return {
    success: true,
    fileName: backupName,
    fileId: copyFile.getId(),
    fileUrl: copyFile.getUrl(),
    time: formattedTime,
    folderUrl: targetFolder.getUrl(),
    deletedOldCount: deletedCount
  };
}

/**
 * Deletes backup files in targetFolder older than retentionDays
 */
function cleanOldBackups(targetFolder, retentionDays) {
  if (!targetFolder) return 0;
  var deletedCount = 0;
  var cutoff = new Date().getTime() - (retentionDays * 24 * 60 * 60 * 1000);
  var files = targetFolder.getFiles();

  while (files.hasNext()) {
    var f = files.next();
    var name = f.getName();
    // Only clean files matching backup naming
    if (name.indexOf('Backup_Database_PDAM_') === 0) {
      var created = f.getDateCreated().getTime();
      if (created < cutoff) {
        f.setTrashed(true);
        deletedCount++;
      }
    }
  }
  return deletedCount;
}

/**
 * Daily Time-driven trigger handler.
 * Called automatically every day at ~01:00 AM WIB.
 */
function dailyDatabaseBackupCron() {
  try {
    Logger.log('Starting daily database backup cron...');
    var res = performDatabaseBackup('SYSTEM_CRON');
    Logger.log('Daily database backup completed: ' + JSON.stringify(res));
  } catch (err) {
    Logger.log('Daily database backup error: ' + err.message);
    var props = PropertiesService.getScriptProperties();
    props.setProperty('LAST_BACKUP_STATUS', 'FAILED: ' + err.message);
  }
}

/**
 * Setup or ensure the daily GAS trigger is active at 01:00 AM.
 */
function setupDailyBackupTrigger() {
  try {
    var triggers = ScriptApp.getProjectTriggers();
    var triggerExists = false;

    for (var i = 0; i < triggers.length; i++) {
      var t = triggers[i];
      if (t.getHandlerFunction() === 'dailyDatabaseBackupCron') {
        triggerExists = true;
        break;
      }
    }

    if (!triggerExists) {
      ScriptApp.newTrigger('dailyDatabaseBackupCron')
        .timeBased()
        .everyDays(1)
        .atHour(1) // 01:00 - 02:00 AM
        .create();
      Logger.log('Created dailyDatabaseBackupCron trigger at 01:00 AM');
    }
    return { active: true, scheduledHour: '01:00 - 02:00 WIB' };
  } catch (e) {
    Logger.log('setupDailyBackupTrigger note: ' + e.message);
    return { active: false, error: e.message };
  }
}

/**
 * Get backup info and list of recent backups for Admin Panel.
 * Ultra-safe: will never throw unhandled exception to client.
 */
function getBackupInfo(token) {
  requireRole(token, ['admin']);
  var props = PropertiesService.getScriptProperties();
  
  var folderName = BACKUP_FOLDER_NAME;
  var folderUrl = '';
  var folderId = '';
  var recent = [];

  try {
    var folder = getBackupFolder();
    if (folder) {
      folderName = folder.getName();
      folderUrl = folder.getUrl();
      folderId = folder.getId();

      var files = folder.getFiles();
      while (files.hasNext()) {
        var f = files.next();
        var name = f.getName();
        if (name.indexOf('Backup_Database_PDAM_') === 0) {
          recent.push({
            id: f.getId(),
            name: name,
            url: f.getUrl(),
            created_at: Utilities.formatDate(f.getDateCreated(), 'Asia/Jakarta', 'dd/MM/yyyy HH:mm:ss') + ' WIB',
            size_bytes: f.getSize()
          });
        }
      }
    }
  } catch (e) {
    Logger.log('Error scanning backup folder: ' + e.message);
  }

  // Sort newest first
  recent.sort(function(a, b) {
    return b.name.localeCompare(a.name);
  });

  if (recent.length > 10) recent = recent.slice(0, 10);

  var hasCron = false;
  try {
    var triggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i < triggers.length; i++) {
      if (triggers[i].getHandlerFunction() === 'dailyDatabaseBackupCron') {
        hasCron = true;
        break;
      }
    }
  } catch (e) {
    hasCron = true; // assume active if triggers restricted
  }

  return {
    lastBackupTime: props.getProperty('LAST_BACKUP_TIME') || 'Belum pernah',
    lastBackupFileName: props.getProperty('LAST_BACKUP_FILE_NAME') || '-',
    lastBackupStatus: props.getProperty('LAST_BACKUP_STATUS') || 'Belum pernah',
    folderName: folderName,
    folderUrl: folderUrl,
    folderId: folderId,
    hasCronTrigger: hasCron,
    retentionDays: BACKUP_RETENTION_DAYS,
    recentBackups: recent
  };
}

/**
 * Manual backup initiated from Admin Panel.
 */
function runManualBackup(token) {
  var user = requireRole(token, ['admin']);
  var res = performDatabaseBackup(user.email || user.user_id);
  try { setupDailyBackupTrigger(); } catch (e) {}
  return res;
}
