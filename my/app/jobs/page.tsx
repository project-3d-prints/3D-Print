// "use client";

// import { useState, useEffect } from "react";
// import { getQueue, getPrinters } from "../../lib/api";
// import Link from "next/link";
// import { useParams } from "next/navigation";

// interface Job {
//   id: number;
//   printer_id: number;
//   duration: number;
//   deadline: string;
//   material_amount: number;
//   user: string;
//   date: string;
//   material: string;
//   priority: number;
// }

// interface Printer {
//   id: number;
//   name: string;
//   status: string;
//   owner: string;
// }

// export default function JobsList() {
//   const params = useParams();
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [printers, setPrinters] = useState<Printer[]>([]);
//   const [printerId, setPrinterId] = useState<number>(
//     Number(params.printerId) || 0
//   );
//   const [day, setDay] = useState<string>(
//     Array.isArray(params.day) ? params.day[0] || "" : params.day || ""
//   );

//   useEffect(() => {
//     async function fetchJobs() {
//       try {
//         const printersResponse = await getPrinters();
//         setPrinters(printersResponse.data);
//         const response = await getQueue(printerId || 0, day);
//         setJobs(
//           printerId === 0
//             ? response.data
//             : response.data.filter((job: Job) => job.printer_id === printerId)
//         );
//       } catch (err) {
//         console.error("Error fetching jobs:", err);
//       }
//     }
//     fetchJobs();
//   }, [params.printerId, printerId, day]);

//   const getDisplayName = (name: string, id: number) => {
//     const nameCount = printers.filter((p: Printer) => p.name === name).length;
//     if (nameCount > 1) {
//       const idCount = printers.filter(
//         (p: Printer) => p.name === name && p.id <= id
//       ).length;
//       return `${name} ${idCount}`;
//     }
//     return name;
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Список заявок</h1>
//       <div className="bg-white p-6 rounded-md shadow-md">
//         <div className="mb-4 flex space-x-4">
//           <div>
//             <label
//               htmlFor="printerId"
//               className="block text-sm font-medium text-cyan-700"
//             >
//               Принтер
//             </label>
//             <select
//               id="printerId"
//               value={printerId}
//               onChange={(e) => setPrinterId(Number(e.target.value))}
//               className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-600 focus:border-cyan-600"
//             >
//               <option value={0}>Все принтеры</option>
//               {printers.map((printer) => (
//                 <option key={printer.id} value={printer.id}>
//                   {getDisplayName(printer.name, printer.id)}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label
//               htmlFor="day"
//               className="block text-sm font-medium text-cyan-700"
//             >
//               Дата
//             </label>
//             <input
//               id="day"
//               type="date"
//               value={day}
//               onChange={(e) => setDay(e.target.value)}
//               className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-cyan-600 focus:border-cyan-600"
//             />
//           </div>
//         </div>
//         <table className="w-full table-auto">
//           <thead>
//             <tr className="bg-gray-200 text-cyan-700">
//               <th className="p-2">ID</th>
//               <th className="p-2">Принтер</th>
//               <th className="p-2">Длительность</th>
//               <th className="p-2">Крайний срок</th>
//               <th className="p-2">Материал</th>
//               <th className="p-2">Приоритет</th>
//             </tr>
//           </thead>
//           <tbody>
//             {jobs.map((job) => (
//               <tr key={job.id} className="border-b">
//                 <td className="p-2">{job.id}</td>
//                 <td className="p-2">
//                   {printers.find((p) => p.id === job.printer_id)?.name ||
//                     job.printer_id}
//                 </td>
//                 <td className="p-2">{job.duration}</td>
//                 <td className="p-2">{job.deadline}</td>
//                 <td className="p-2">{job.material}</td>
//                 <td className="p-2">{job.priority}</td>{" "}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
