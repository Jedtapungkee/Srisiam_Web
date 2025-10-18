// ฟังก์ชันสำหรับจัดการข้อมูลผู้ใช้


export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * ดึงสี CSS class สำหรับบทบาท
 * @param {string} role - บทบาทของผู้ใช้
 * @returns {string} CSS class
 */
export const getRoleColor = (role) => {
  return role === "admin" 
    ? "bg-purple-100 text-purple-700 border-purple-200" 
    : "bg-blue-100 text-blue-700 border-blue-200";
};

/**
 * ดึงสี CSS class สำหรับสถานะ
 * @param {boolean} enabled - สถานะการใช้งาน
 * @returns {string} CSS class
 */
export const getStatusColor = (enabled) => {
  return enabled 
    ? "bg-green-100 text-green-700 border-green-200" 
    : "bg-red-100 text-red-700 border-red-200";
};

/**
 * กรองข้อมูลผู้ใช้ตามเงื่อนไข
 * @param {Array} users - รายการผู้ใช้
 * @param {string} searchTerm - คำค้นหา
 * @param {string} roleFilter - กรองตามบทบาท
 * @param {string} statusFilter - กรองตามสถานะ
 * @returns {Array} รายการผู้ใช้ที่กรองแล้ว
 */
export const filterUsers = (users, searchTerm, roleFilter, statusFilter) => {
  let filtered = users;

  // Filter by search term
  if (searchTerm) {
    filtered = filtered.filter(user =>
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Filter by role
  if (roleFilter !== "all") {
    filtered = filtered.filter(user => user.role === roleFilter);
  }

  // Filter by status
  if (statusFilter !== "all") {
    filtered = filtered.filter(user => 
      statusFilter === "active" ? user.enabled : !user.enabled
    );
  }

  return filtered;
};

/**
 * ดึงชื่อเต็มของผู้ใช้
 * @param {Object} user - ข้อมูลผู้ใช้
 * @returns {string} ชื่อเต็ม
 */
export const getFullName = (user) => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.firstName || 'ไม่ระบุชื่อ';
};

/**
 * ดึงตัวอักษรย่อสำหรับ avatar
 * @param {Object} user - ข้อมูลผู้ใช้
 * @returns {string} ตัวอักษรย่อ
 */
export const getUserInitials = (user) => {
  return (user.firstName?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase();
};

/**
 * ดึงข้อความแสดงบทบาทเป็นภาษาไทย
 * @param {string} role - บทบาท
 * @returns {string} ข้อความบทบาทภาษาไทย
 */
export const getRoleText = (role) => {
  return role === "admin" ? "ผู้ดูแลระบบ" : "ผู้ใช้ทั่วไป";
};

/**
 * ดึงข้อความแสดงสถานะเป็นภาษาไทย
 * @param {boolean} enabled - สถานะการใช้งาน
 * @returns {string} ข้อความสถานะภาษาไทย
 */
export const getStatusText = (enabled) => {
  return enabled ? "ใช้งานอยู่" : "ปิดใช้งาน";
};

/**
 * ดึงข้อความ success สำหรับการเปลี่ยนสถานะผู้ใช้
 * @param {boolean} currentStatus - สถานะปัจจุบัน
 * @returns {string} ข้อความ success
 */
export const getStatusChangeMessage = (currentStatus) => {
  return currentStatus ? "ปิดใช้งานผู้ใช้สำเร็จ" : "เปิดใช้งานผู้ใช้สำเร็จ";
};

/**
 * ดึงข้อความปุ่มสำหรับการเปลี่ยนสถานะ
 * @param {boolean} enabled - สถานะการใช้งาน
 * @returns {string} ข้อความปุ่ม
 */
export const getStatusButtonText = (enabled) => {
  return enabled ? "ปิดใช้งาน" : "เปิดใช้งาน";
};

/**
 * Constants สำหรับข้อความต่างๆ
 */
export const USER_MESSAGES = {
  ROLE_CHANGE_SUCCESS: "เปลี่ยนบทบาทผู้ใช้สำเร็จ",
  FETCH_ERROR: "ไม่สามารถโหลดข้อมูลผู้ใช้ได้",
  GENERIC_ERROR: "เกิดข้อผิดพลาด",
};