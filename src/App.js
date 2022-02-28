import React, { useEffect, useState } from 'react';
import './App.css';
import Dropdown from './components/InputBox';
import { departmentsJSONUrl, coursesJSONUrl } from './constants';

const App = () => {
  const [dropdownValue, setDropdownValue] = useState();
  const [departments, setDepartments] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState({});
  const [courses, setCourses] = useState([]); // eslint-disable-line
  const [rawCourses, setRawCourses] = useState([]);

  console.log(courses);
  const dropdownOnChange = value => {
    setDropdownValue(value);
    const foundDepartment = departments.find(department => department.value === value);
    setSelectedDepartment(foundDepartment);
  };

  useEffect(() => {
    const filteredCourses = rawCourses.filter(course => course?.courses?.length > 0);
    let availableCourses = filteredCourses.map(course => {
      const foundCourses = course.courses.filter(course => {
        return course.courseSections.find(section => {
          if (!section.sectionCriterias) return false;
          return section.sectionCriterias?.find(criteria => {
            return [selectedDepartment?.additionalInfo?.deptName, "ALL"].includes(criteria.givenDept) && criteria.minYear < 5 && criteria.maxYear > 3;
          });
        });
      });
      return { ...course, courses: foundCourses };
    });
    availableCourses = availableCourses.filter(course => course?.courses?.length > 0);
    setCourses(availableCourses);
  }, [selectedDepartment, rawCourses]);

  useEffect(() => {
    const getDepartments = async () => {
      try {
        const response = await fetch(departmentsJSONUrl);
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.log(error);
      }
    }
    const getCourses = async () => {
      try {
        const response = await fetch(coursesJSONUrl);
        const data = await response.json();
        setRawCourses(data);
      } catch (error) {
        console.log(error);
      }
    }
    getDepartments();
    getCourses();
  }, []);

  return (
    <>
      <Dropdown
        optionList={departments}
        value={dropdownValue}
        onChange={dropdownOnChange}
      />
      <>
        <label htmlFor="year">Year: </label>
        <input type="text" id="year" />
      </>
      {courses.map(course => {
        return (
          <div key={course.department.value}>
            {course.department.text}
          </div>
        );
      })}
    </>
  );
}

export default App;
