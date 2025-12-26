import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const CourseForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        duration_hours: 0,
        is_published: true
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
        if (isEditing) {
            fetchCourse();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/lms/categories/');
            setCategories(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchCourse = async () => {
        try {
            const response = await api.get(`/lms/courses/${id}/`);
            const { title, description, category, duration_hours, is_published } = response.data;
            setFormData({
                title,
                description,
                category: category.id || category,
                duration_hours,
                is_published
            });
        } catch (error) {
            console.error('Error fetching course:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing) {
                await api.put(`/lms/courses/${id}/`, formData);
            } else {
                await api.post('/lms/courses/', formData);
            }
            navigate('/my-courses');
        } catch (error) {
            console.error('Error saving course:', error);
            alert('Failed to save course. Please check your inputs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[1440px] mx-auto bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 animate-fade-in relative overflow-hidden">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{isEditing ? 'Edit Course' : 'Create New Course'}</h1>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g. Advanced Web Development"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                        <select
                            name="category"
                            required
                            value={formData.category}
                            onChange={handleChange}
                            className="input-field cursor-pointer"
                        >
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                    <textarea
                        name="description"
                        required
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Tell students what they will learn..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration (Hours)</label>
                        <input
                            type="number"
                            name="duration_hours"
                            min="0"
                            value={formData.duration_hours}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                    <input
                        type="checkbox"
                        name="is_published"
                        id="is_published"
                        checked={formData.is_published}
                        onChange={handleChange}
                        className="h-5 w-5 text-brand-600 focus:ring-brand-500 border-gray-300 rounded-md cursor-pointer transition-all"
                    />
                    <label htmlFor="is_published" className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                        Publish this course immediately (Visible to all students)
                    </label>
                </div>

                <div className="flex justify-end items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <button
                        type="button"
                        onClick={() => navigate('/my-courses')}
                        className="btn-secondary"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary min-w-[140px]"
                    >
                        {loading ? 'Saving...' : (isEditing ? 'Update Course' : 'Create Course')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CourseForm;
