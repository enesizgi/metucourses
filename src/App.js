import React, { useEffect, useState } from 'react';
import './App.css';
import Dropdown from './components/InputBox';
import { departmentsJSONUrl, coursesJSONUrl } from './constants';

const App = () => {
  const [departments, setDepartments] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState({});
  const [courses, setCourses] = useState([]); // eslint-disable-line
  const [rawCourses, setRawCourses] = useState([]);
  const [closedDeps, setClosedDeps] = useState([]);
  const [isCriteriaEnabled, setIsCriteriaEnabled] = useState(true);
  const [year, setYear] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');

  // console.log(courses);
  const dropdownOnChange = value => {
    const foundDepartment = departments.find(department => department.value === value);
    setSelectedDepartment(foundDepartment);
  };

  const handleCriteriaChange = () => {
    setIsCriteriaEnabled(state => !state);
  };

  const handleYearChange = value => {
    setYear(value);
  }

  const handleDepClose = (dep) => {
    if (closedDeps.includes(dep.target.id)) {
      setClosedDeps(state => state.filter(d => d !== dep.target.id));
    } else {
      setClosedDeps(state => [...state, dep.target.id]);
    }
  }

  useEffect(() => {
    if (rawCourses.length === 0) return;
    const filteredCourses = rawCourses.filter(course => course?.courses?.length > 0);
    const courseCategories = filteredCourses.find(i => i.department.value === selectedDepartment.programCode)?.department?.courseCategories || [];
    let availableCourses = filteredCourses.map(rawCourse => {
      const foundCourses = rawCourse.courses.filter(course => {
        const category = courseCategories.find(category => category.courseCode === course.courseCode)?.courseCategory;
        if (['MUST', 'TECHNICAL ELECTIVE', 'DEPARTMENTAL ELECTIVE'].includes(category) || category?.includes('RESTRICTED ELECTIVE')) return false;
        if (course.courseLevel.toLowerCase().includes('graduate') && !course.courseLevel.toLowerCase().includes('undergraduate')) return false;
        if (course.courseCredit.startsWith('0.')) return false;
        if (course.courseLevel.toLowerCase().includes('master')) return false;
        if (rawCourse.department.text.includes('Kuzey Kıbrıs')) return false;
        return course.courseSections.find(section => {
          if (!section.sectionCriterias && !isCriteriaEnabled) return true;
          return section.sectionCriterias?.find(criteria => {
            return [selectedDepartment.deptName, "ALL"].includes(criteria.givenDept) && (year ? (criteria.minYear <= year && criteria.maxYear >= year) : true);
          });
        });
      });
      return { ...rawCourse, courses: foundCourses };
    });
    availableCourses = availableCourses.filter(course => course?.courses?.length > 0 && course?.department.value !== '571');
    setCourses(availableCourses);
  }, [selectedDepartment, rawCourses, isCriteriaEnabled, year]);

  useEffect(() => {
    const getDepartments = async () => {
      try {
        const response = await fetch(departmentsJSONUrl);
        const data = await response.json();
        setDepartments(data.result);
        setSelectedDepartment(data.result[0]);
      } catch (error) {
        console.log(error);
      }
    }
    const getCourses = async () => {
      try {
        const response = await fetch(coursesJSONUrl);
        const data = await response.json();
        setRawCourses(data.result);
        setUpdatedAt(data.updatedAt);
      } catch (error) {
        console.log(error);
      }
    }
    getDepartments();
    getCourses();
  }, []);

  return (
    <>
      <div>
        <Dropdown
          optionList={departments}
          value={selectedDepartment.value}
          onChange={dropdownOnChange}
        />
      </div>
      <br />
      <div style={{ paddingBottom: '10px' }}>
        <label htmlFor="year">Your academic year: </label>
        <Dropdown
          optionList={['', '1', '2', '3', '4']}
          value={year}
          onChange={handleYearChange}
        />
        <button style={{ marginLeft: '20px' }} onClick={handleCriteriaChange}>
          {`${isCriteriaEnabled ? 'Enable' : 'Disable'} sections with no criteria`}
        </button>
      </div>
      <div style={{ paddingBottom: '10px' }}>
        Updated at: {updatedAt}
      </div>
      {courses.map(course => {
        return (
          <div key={course.department.deptName} style={{ marginBottom: '10px' }}>
            <button key={course.department.deptName} onClick={handleDepClose} id={course.department.deptName}>
              {course.department.text}
            </button>
            {!closedDeps.includes(course.department.deptName) && course.courses.map(course2 => {
              return (
                <div key={course2.courseCode}>
                  {course2.courseCode} - {course2.courseName} - {course2.courseCredit}
                </div>
              );
            })}
            <br />
          </div>

        );
      })}
    </>
  );
}

export default App;
