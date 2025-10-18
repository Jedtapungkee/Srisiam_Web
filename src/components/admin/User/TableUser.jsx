import { toast } from "sonner";
import {
  changeUserRole,
  changeUserStatus,
  getListAllUsers,
} from "../../../api/Admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Badge } from "../../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import useSrisiamStore from "../../../store/Srisiam-store";
import React, { useEffect, useState } from "react";
import {
  formatDate,
  getRoleColor,
  getStatusColor,
  filterUsers as filterUserData,
  getFullName,
  getUserInitials,
  getRoleText,
  getStatusText,
  getStatusChangeMessage,
  getStatusButtonText,
  USER_MESSAGES,
} from "../../../utils/user";
import {
  Users,
  Search,
  Filter,
  UserCheck,
  UserX,
  Shield,
  User,
  Mail,
  Calendar,
  Loader,
  Crown,
  UserCog,
  Settings
} from "lucide-react";

const TableUser = () => {
  const token = useSrisiamStore((state) => state.token);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    hdlGetUsers(token);
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const hdlGetUsers = (token) => {
    setLoading(true);
    getListAllUsers(token)
      .then((res) => {
        setUsers(res.data.users || []);
        setFilteredUsers(res.data.users || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setUsers([]);
        setFilteredUsers([]);
        setLoading(false);
        toast.error(USER_MESSAGES.FETCH_ERROR);
      });
  };

  const filterUsers = () => {
    const filtered = filterUserData(users, searchTerm, roleFilter, statusFilter);
    setFilteredUsers(filtered);
  };

  const hdlChangeUserStatus = async (userId, userStatus) => {
    const value = {
      id: userId,
      enabled: !userStatus,
    };
    changeUserStatus(token, value)
      .then((res) => {
        hdlGetUsers(token);
        toast.success(getStatusChangeMessage(userStatus));
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.error || USER_MESSAGES.GENERIC_ERROR);
      });
  };

  const hdlChageUserRole = async (userId, userRole) => {
    const value = {
      id: userId,
      role: userRole,
    };
    changeUserRole(token, value)
      .then((res) => {
        hdlGetUsers(token);
        toast.success(USER_MESSAGES.ROLE_CHANGE_SUCCESS);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.error || USER_MESSAGES.GENERIC_ERROR);
      });
  };

  const getRoleIcon = (role) => {
    return role === "admin" ? <Crown className="h-4 w-4" /> : <User className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">จัดการผู้ใช้งาน</h1>
          <p className="text-gray-600">จัดการข้อมูลผู้ใช้งานและสิทธิ์การเข้าถึง</p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-blue-600">{users.length}</span>
        </div>
      </div>
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหาด้วยชื่อหรืออีเมล..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="w-full md:w-48">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="กรองบทบาท" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">บทบาททั้งหมด</SelectItem>
                  <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
                  <SelectItem value="user">ผู้ใช้ทั่วไป</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="กรองสถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">สถานะทั้งหมด</SelectItem>
                  <SelectItem value="active">ใช้งานอยู่</SelectItem>
                  <SelectItem value="inactive">ปิดใช้งาน</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            รายการผู้ใช้งาน ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">กำลังโหลดข้อมูล...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">ไม่พบผู้ใช้งาน</p>
              <p className="text-gray-400">ลองเปลี่ยนเงื่อนไขการค้นหาหรือกรอง</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        ผู้ใช้งาน
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        อีเมล
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        บทบาท
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold">สถานะ</TableHead>
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        วันที่สมัคร
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <Settings className="h-4 w-4" />
                        จัดการ
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            {user.picture && (
                              <AvatarImage 
                                src={user.picture} 
                                alt={getFullName(user)}
                              />
                            )}
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm">
                              {getUserInitials(user)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">
                              {getFullName(user)}
                            </div>
                            <div className="text-sm text-gray-500">ID: {user.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-gray-900">{user.email}</div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={`${getRoleColor(user.role)} flex items-center gap-1 w-fit`}>
                          {getRoleIcon(user.role)}
                          {getRoleText(user.role)}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={`${getStatusColor(user.enabled)} flex items-center gap-1 w-fit`}>
                          {user.enabled ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
                          {getStatusText(user.enabled)}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-gray-900">
                          {formatDate(user.createdAt)}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                              user.enabled
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                            onClick={() => hdlChangeUserStatus(user.id, user.enabled)}
                          >
                            {user.enabled ? <UserX className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                            {getStatusButtonText(user.enabled)}
                          </button>
                          
                          <Select
                            value={user.role}
                            onValueChange={(value) => hdlChageUserRole(user.id, value)}
                          >
                            <SelectTrigger className="w-32 h-8">
                              <UserCog className="h-3 w-3 mr-1" />
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">
                                <div className="flex items-center gap-2">
                                  <User className="h-3 w-3" />
                                  ผู้ใช้ทั่วไป
                                </div>
                              </SelectItem>
                              <SelectItem value="admin">
                                <div className="flex items-center gap-2">
                                  <Crown className="h-3 w-3" />
                                  ผู้ดูแลระบบ
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TableUser;
