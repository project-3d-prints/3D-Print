// "use client";

// import { useState, useEffect } from "react";
// import AuthGuard from "../AuthGuard";
// import LoadingSpinner from "../LoadingSpinner";

// interface User {
//   id: number;
//   username: string;
//   role: string;
// }

// export default function AdminPanel() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Здесь будет функция для получения пользователей с бэкенда
//   useEffect(() => {
//     setTimeout(() => {
//       setUsers([
//         { id: 1, username: "admin", role: "глава лаборатории" },
//         { id: 2, username: "teacher1", role: "учитель" },
//         { id: 3, username: "student1", role: "студент" },
//       ]);
//       setLoading(false);
//     }, 1000);
//   }, []);

//   const handleRoleChange = async (userId: number, newRole: string) => {
//     // Здесь будет логика изменения роли
//     console.log(`Changing role for user ${userId} to ${newRole}`);
//     setUsers(
//       users.map((user) =>
//         user.id === userId ? { ...user, role: newRole } : user
//       )
//     );
//   };

//   if (loading) {
//     return <LoadingSpinner text="Загружаем пользователей..." />;
//   }

//   return (
//     <AuthGuard requiredRole="глава лаборатории">
//       <div className="container mx-auto p-4">
//         <h1 className="text-2xl lg:text-3xl font-bold text-cyan-700 mb-6">
//           Админ-панель
//         </h1>

//         <div className="bg-white p-4 lg:p-6 rounded-md shadow-md">
//           <h2 className="text-xl font-semibold mb-4 text-cyan-700">
//             Список пользователей
//           </h2>

//           <div className="overflow-x-auto">
//             <table className="w-full table-auto">
//               <thead>
//                 <tr className="bg-gray-200">
//                   <th className="px-4 py-2 text-left">ID</th>
//                   <th className="px-4 py-2 text-left">Имя пользователя</th>
//                   <th className="px-4 py-2 text-left">Роль</th>
//                   <th className="px-4 py-2 text-left">Действия</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((user) => (
//                   <tr key={user.id} className="border-b hover:bg-gray-50">
//                     <td className="px-4 py-2">{user.id}</td>
//                     <td className="px-4 py-2">{user.username}</td>
//                     <td className="px-4 py-2">
//                       <span
//                         className={`px-2 py-1 rounded text-xs ${
//                           user.role === "глава лаборатории"
//                             ? "bg-red-100 text-red-800"
//                             : user.role === "учитель"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : "bg-gray-100 text-gray-800"
//                         }`}
//                       >
//                         {user.role}
//                       </span>
//                     </td>
//                     <td className="px-4 py-2">
//                       <select
//                         value={user.role}
//                         onChange={(e) =>
//                           handleRoleChange(user.id, e.target.value)
//                         }
//                         className="px-2 py-1 border rounded text-sm"
//                       >
//                         <option value="студент">Студент</option>
//                         <option value="учитель">Учитель</option>
//                         <option value="глава лаборатории">
//                           Глава лаборатории
//                         </option>
//                       </select>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {users.length === 0 && (
//             <div className="text-center py-8">
//               <div className="text-4xl lg:text-6xl mb-4">👥</div>
//               <p className="text-gray-500 text-lg">Нет пользователей</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </AuthGuard>
//   );
// }
