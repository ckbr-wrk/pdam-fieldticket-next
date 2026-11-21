// ============================================================
// Auth.gs — Session authentication & role management
// PDAM FieldTicket (Hardened with Rate Limiting & Salted Auth)
// ============================================================

var SESSION_EXPIRY_SECONDS = 21600; // 6 hours
var CACHE_PREFIX = 'session_';
var RATE_LIMIT_PREFIX = 'login_fail_';
var MAX_FAILED_ATTEMPTS = 5;
var LOCKOUT_SECONDS = 900; // 15 menit

/**
 * Login: verify email/password, create session token.
 * Protected with Brute-Force Rate Limiting & Salted Hash Auto-Upgrade.
 * Returns {token, user: {user_id, nama, role, wilayah_id, email, must_change_password}}
 */
function login(email, password) {
  if (!email || !password) throw new Error('Email dan password wajib diisi.');

  var cleanEmail = String(email).trim().toLowerCase();
  var cache = CacheService.getScriptCache();
  var failKey = RATE_LIMIT_PREFIX + cleanEmail;

  // 1. Check Rate Limiting / Brute Force Lockout
  var failedCount = parseInt(cache.get(failKey) || '0', 10);
  if (failedCount >= MAX_FAILED_ATTEMPTS) {
    throw new Error('Akses dibekukan sementara selama 15 menit karena 5x gagal login berturut-turut. Silakan tunggu atau hubungi Administrator.');
  }

  // 2. Lookup user
  var user = findRow('Users', function(u) {
    var isEmailMatch = String(u.email || '').trim().toLowerCase() === cleanEmail;
    var isAktif = (u.status_aktif === true || String(u.status_aktif || '').trim().toLowerCase() === 'true' || u.status_aktif === 1);
    return isEmailMatch && isAktif;
  });

  var recordFailure = function() {
    failedCount++;
    cache.put(failKey, String(failedCount), LOCKOUT_SECONDS);
    try {
      addAuditLog('', 'SYSTEM', 'LOGIN_FAILED', '', { email: cleanEmail, failed_attempts: failedCount });
    } catch (e) {}
    var remaining = MAX_FAILED_ATTEMPTS - failedCount;
    if (remaining > 0) {
      throw new Error('Email atau password salah. Sisa kesempatan login: ' + remaining + 'x.');
    } else {
      throw new Error('Terlalu banyak percobaan gagal. Akun dibekukan sementara selama 15 menit demi keamanan.');
    }
  };

  if (!user) {
    recordFailure();
  }

  // 3. Verify Password (Salted SHA-256 + Auto-Upgrade from Legacy Hash)
  var isPasswordValid = false;
  var saltedHash = hashPassword(password, user.user_id);

  if (user.password_hash === saltedHash) {
    isPasswordValid = true;
  } else if (user.password_hash === legacyHashPassword(password) || user.password_hash === hashPassword(password, '')) {
    // Password valid via legacy unsalted or un-salted hash -> auto upgrade to Salted Hash!
    isPasswordValid = true;
    try {
      updateRow('Users', 'user_id', user.user_id, { password_hash: saltedHash });
    } catch (e) {
      Logger.log('Auto-upgrade password hash failed: ' + e.message);
    }
  }

  if (!isPasswordValid) {
    recordFailure();
  }

  // Login success -> reset rate limit counter
  cache.remove(failKey);

  // Check if user is using vulnerable default password
  var isDefaultAdmin = (cleanEmail === 'admin@pdam.local' && password === 'Admin@123!');

  // Create session
  var token = Utilities.getUuid();
  var sessionData = {
    user_id: user.user_id,
    nama: user.nama,
    email: user.email,
    role: user.role,
    wilayah_id: user.wilayah_id,
    must_change_password: isDefaultAdmin
  };

  cache.put(CACHE_PREFIX + token, JSON.stringify(sessionData), SESSION_EXPIRY_SECONDS);
  addAuditLog('', user.user_id, 'LOGIN', '', '');

  return { token: token, user: sessionData };
}

/** Logout: remove session from cache */
function logout(token) {
  if (!token) return;
  var cache = CacheService.getScriptCache();
  var raw = cache.get(CACHE_PREFIX + token);
  if (raw) {
    var user = JSON.parse(raw);
    addAuditLog('', user.user_id, 'LOGOUT', '', '');
  }
  cache.remove(CACHE_PREFIX + token);
}

/**
 * Get session: returns user object {user_id, nama, email, role, wilayah_id} or null.
 */
function getSession(token) {
  if (!token) return null;
  var cache = CacheService.getScriptCache();
  var raw = cache.get(CACHE_PREFIX + token);
  if (!raw) return null;
  return JSON.parse(raw);
}

/** Require auth — throws if no valid session */
function requireAuth(token) {
  var user = getSession(token);
  if (!user) throw new Error('Sesi tidak valid atau sudah berakhir. Silakan login kembali.');
  return user;
}

/** Require specific role(s) — throws if role not allowed */
function requireRole(token, allowedRoles) {
  var user = requireAuth(token);
  if (allowedRoles.indexOf(user.role) === -1) {
    throw new Error('Anda tidak memiliki izin untuk melakukan tindakan ini.');
  }
  return user;
}

/** Change password */
function changePassword(token, oldPassword, newPassword) {
  var user = requireAuth(token);
  if (!oldPassword || !newPassword) throw new Error('Password lama dan baru wajib diisi.');
  if (newPassword.length < 6) throw new Error('Password baru minimal 6 karakter.');
  if (newPassword.length > 64) throw new Error('Password baru maksimal 64 karakter.');
  if (oldPassword === newPassword) throw new Error('Password baru tidak boleh sama dengan password lama.');

  var dbUser = findRow('Users', function(u) { return u.user_id === user.user_id; });
  if (!dbUser) throw new Error('Pengguna tidak ditemukan.');

  var isOldValid = (hashPassword(oldPassword, dbUser.user_id) === dbUser.password_hash) ||
                   (legacyHashPassword(oldPassword) === dbUser.password_hash);
  if (!isOldValid) {
    throw new Error('Password lama tidak sesuai.');
  }

  updateRow('Users', 'user_id', user.user_id, {
    password_hash: hashPassword(newPassword, dbUser.user_id)
  });
  addAuditLog('', user.user_id, 'CHANGE_PASSWORD', '', '');
  return { message: 'Password berhasil diubah.' };
}
