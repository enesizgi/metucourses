import React, { useEffect, useState } from 'react';
import './App.css';
import Dropdown from './components/InputBox';

const App = () => {
  const [dropdownValue, setDropdownValue] = useState();
  const [departments, setDepartments] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState({});
  const [courses, setCourses] = useState([]); // eslint-disable-line
  const [rawCourses, setRawCourses] = useState([]);
  const [depAbbreviatons, setDepAbbreviatons] = useState([]);
  console.log('testing');
  const dropdownOnChange = value => {
    setDropdownValue(value);
    const foundDepartment = departments.find(department => department.value === value);
    const depWithExtraInfo = (depAbbreviatons.length > 0 && depAbbreviatons.result.find(dep => dep.programCode === value)) || {};
    setSelectedDepartment({ ...foundDepartment, additionalInfo: depWithExtraInfo });
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
    console.log(availableCourses);
    setCourses(availableCourses);
  }, [selectedDepartment, rawCourses]);

  useEffect(() => {
    const getDepartments = async () => {
      const response = await fetch('https://raw.githubusercontent.com/enesizgi/crawler-assets/master/departments.json');
      const data = await response.json();
      setDepartments(data.result);
    }
    const getCourses = async () => {
      const response = await fetch('https://raw.githubusercontent.com/enesizgi/crawler-assets/master/courses.json');
      const data = await response.json();
      setRawCourses(data);
    }
    const getDepAbbreviations = async () => {
      const response = await fetch('https://raw.githubusercontent.com/enesizgi/crawler-assets/master/departmentsAbbreviations.json');
      const data = await response.json();
      setDepAbbreviatons(data);
    }
    getDepartments();
    getCourses();
    getDepAbbreviations();
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
    </>
  );
}

export default App;
