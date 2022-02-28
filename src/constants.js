export const departmentsJSONUrl = process.env.NODE_ENV === 'development' ?
    'http://localhost:5001/api/departments' : 'https://raw.githubusercontent.com/enesizgi/crawler-assets/master/departments.json';

export const coursesJSONUrl = process.env.NODE_ENV === 'development' ?
    'http://localhost:5001/api/courses' : 'https://raw.githubusercontent.com/enesizgi/crawler-assets/master/courses.json';