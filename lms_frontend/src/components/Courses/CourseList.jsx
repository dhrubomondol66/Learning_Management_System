import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/authContext';

const CourseList = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/lms/courses/my_courses/');
            setCourses(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await api.delete(`/lms/courses/${id}/`);
                setCourses(courses.filter(course => course.id !== id));
            } catch (error) {
                console.error('Error deleting course:', error);
            }
        }
    };

    if (loading) return (
        <div className="flex justify-center flex-col items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading your courses...</p>
        </div>
    );

    const isAdmin = user?.is_superuser || user?.role === 'admin';
    const isInstructor = user?.role === 'instructor';
    const canManage = isAdmin || isInstructor;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {isAdmin ? 'All System Courses' : isInstructor ? 'My Taught Courses' : 'My Enrolled Courses'}
                </h1>
                {canManage && (
                    <Link
                        to="/courses/create"
                        className="btn-primary"
                    >
                        Create New Course
                    </Link>
                )}
            </div>

            <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                            {canManage && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                {canManage ? 'Enrollments' : 'Instructor'}
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        {courses.length === 0 ? (
                            <tr>
                                <td colSpan={canManage ? 5 : 4} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                    {isAdmin ? "No courses found in the system." : isInstructor ? "You haven't created any courses yet." : "You haven't enrolled in any courses yet."}
                                </td>
                            </tr>
                        ) : (
                            courses.map((course) => (
                                <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link to={`/courses/${course.id}`} className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                                            {course.title}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {course.category_name || '-'}
                                    </td>
                                    {canManage && (
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${course.is_published
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                                                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                                                }`}>
                                                {course.is_published ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {canManage ? course.enrollment_count : course.instructor_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link to={`/courses/${course.id}`} className="text-brand-600 dark:text-brand-400 hover:text-brand-900 dark:hover:text-brand-300 mr-4">View</Link>
                                        {canManage && (
                                            <>
                                                <Link to={`/courses/edit/${course.id}`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:mr-4 mr-4">Edit</Link>
                                                <button onClick={() => handleDelete(course.id)} className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">Delete</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CourseList;
