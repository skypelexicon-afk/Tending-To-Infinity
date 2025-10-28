'use client';
import React, { useEffect, useState } from 'react';
import { getAllOrders } from '@/lib/api/Orders';
// import { fetchData } from '@/lib/api/adminData'; // gets all users
import { Order } from '@/lib/types/orderType';
import { DashboardData } from '@/lib/types/adminDataType';
import { useCourseStore } from '@/store/useCourseStore';
import { useDashboardStore } from '@/store/useAdminDataStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

const AllTransactions: React.FC = () => {
     const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuthStore();
    const { dashboardData, fetchDashboardData } = useDashboardStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [students, setStudents] = useState<DashboardData['studentDetails']>(
        [],
    );
    const [error, setError] = useState<string | null>(null);
    const { courses, fetchCourses } = useCourseStore();
 const [courseTotals, setCourseTotals] = useState<
        { courseId: number; courseTitle: string; total: number }[]
    >([]);


     useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/');
            } else if (user?.role !== 'super_admin') {
                router.push('/');
            }
        }
    }, [isAuthenticated, isLoading, user, router]);

    // Fetch data only if super_admin
    useEffect(() => {
        const fetchDataAll = async () => {
            try {
                const orderRes = await getAllOrders();
                setOrders(orderRes.orders);

                if (!dashboardData) {
                    await fetchDashboardData();
                }
                setStudents(dashboardData?.studentDetails || []);
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : 'Error fetching data';
                console.error('Error:', errorMessage);
                setError(errorMessage);
            }
        };

        if (isAuthenticated && user?.role === 'super_admin') {
            fetchDataAll();
            fetchCourses();
        }
    }, [isAuthenticated, user, dashboardData, fetchDashboardData, fetchCourses]);



   

    useEffect(() => {
        const totalsMap = new Map<number, number>();

        orders.forEach((order) => {
            totalsMap.set(
                order.course_id,
                parseFloat(
                    (
                        (totalsMap.get(order.course_id) || 0) +
                        order.order_amount / 100
                    ).toFixed(3),
                ),
            );
        });

        const totalsArray = Array.from(totalsMap.entries()).map(
            ([courseId, total]) => ({
                courseId,
                courseTitle: getCourseTitle(courseId),
                total,
            }),
        );

        setCourseTotals(totalsArray);
    }, [orders, courses]);

    const getCourseTitle = (id: number) => {
        return (
            courses.find((course) => course.id === id)?.title ||
            'Unknown Course'
        );
    };

    const getStudentName = (id: number) => {
        return students.find((student) => student.id === id)?.name || 'Unknown';
    };

    const getStudentEmail = (id: number) => {
        return (
            students.find((student) => student.id === id)?.email || 'Unknown'
        );
    };

if (isLoading) {
        return <div className="p-6 text-center">Checking authentication...</div>;
    }

    //  Unauthorized (while redirecting)
    if (!isAuthenticated || user?.role !== 'super_admin') {
        return <div className="p-6 text-center">Unauthorized</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-2 sm:p-4">
            {/* Mobile Card View */}
            {/* <div className="block md:hidden space-y-4">
                {orders.map((order) => (
                    <div
                        key={order.transaction_id}
                        className="bg-white rounded-lg shadow p-4 border"
                    >
                        <p className="text-sm">
                            <span className="font-semibold">
                                Transaction ID:
                            </span>{' '}
                            {order.transaction_id}
                        </p>
                        <p className="text-sm">
                            <span className="font-semibold">
                                Customer Name:
                            </span>{' '}
                            {getStudentName(order.user_id)}
                        </p>
                        <p className="text-sm">
                            <span className="font-semibold">Email:</span>{' '}
                            {getStudentEmail(order.user_id)}
                        </p>
                        <p className="text-sm">
                            <span className="font-semibold">Course:</span>{' '}
                            {getCourseTitle(order.course_id)}
                        </p>
                        <p className="text-sm">
                            <span className="font-semibold">Amount:</span> ₹
                            {order.order_amount / 100}
                        </p>
                    </div>
                ))}
            </div> */}

            {/* Desktop Table View */}
            <div className="hidden md:block w-full overflow-x-auto">
                {/* {courseTotals.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">
                            Total Transactions by Course:
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {courseTotals.map((item) => (
                                <div
                                    key={`${item.courseId}-${item.courseTitle}`}
                                    className="bg-white p-4 rounded shadow border text-sm"
                                >
                                    <p className="font-medium">
                                        {item.courseTitle}
                                    </p>
                                    <p>Total Amount: ₹{item.total}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )} */}

                <table className="w-full table-auto border-separate border-spacing-0 rounded-lg overflow-hidden shadow-lg">
                    <thead className="bg-gray-300">
                        <tr>
                            <th className="px-4 py-3 text-sm font-medium border-t border-r border-b border-gray-500 rounded-tl-lg whitespace-nowrap">
                                Transaction ID
                            </th>
                            <th className="px-4 py-3 text-sm font-medium border-t border-r border-b border-gray-500 rounded-tl-lg whitespace-nowrap">
                                Created at
                            </th>
                            <th className="px-4 py-3 text-sm font-medium border-t border-r border-b border-gray-500 whitespace-nowrap">
                                Customer Name
                            </th>
                            <th className="px-4 py-3 text-sm font-medium border-t border-r border-b border-gray-500 whitespace-nowrap">
                                Email
                            </th>
                            <th className="px-4 py-3 text-sm font-medium border-t border-r border-b border-gray-500 whitespace-nowrap">
                                Status
                            </th>
                            <th className="px-4 py-3 text-sm font-medium border-t border-r border-b border-gray-500 rounded-tr-lg whitespace-nowrap">
                                Amount
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-center bg-white">
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="border-l border-r border-b border-gray-300 px-4 py-3 text-sm whitespace-nowrap">
                                    {order.transaction_id}
                                </td>
                                <td className="border-r border-b border-gray-300 px-4 py-3 text-sm">
                                    {`${new Date(order.created_at).toDateString()}`}
                                </td>
                                <td className="border-r border-b border-gray-300 px-4 py-3 text-sm">
                                    {getStudentName(order.user_id)}
                                </td>
                                <td className="border-r border-b border-gray-300 px-4 py-3 text-sm">
                                    {getStudentEmail(order.user_id)}
                                </td>
                                <td className="border-r border-b border-gray-300 px-4 py-3 text-sm">
                                    {order.status}
                                </td>
                                <td className="border-r border-b border-gray-300 px-4 py-3 text-sm">
                                    ₹{order.order_amount / 100}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllTransactions;
