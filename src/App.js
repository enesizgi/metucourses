import React, { useEffect, useState } from 'react';
import './App.css';
import Dropdown from './components/InputBox';
import { departmentsJSONUrl, coursesJSONUrl, departmentsAbbreviationsJSONUrl } from './constants';

const App = () => {
  const [dropdownValue, setDropdownValue] = useState();
  const [departments, setDepartments] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState({});
  const [courses, setCourses] = useState([]); // eslint-disable-line
  const [rawCourses, setRawCourses] = useState([]);
  const [depAbbreviatons, setDepAbbreviatons] = useState([]);

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
    setCourses(availableCourses);
  }, [selectedDepartment, rawCourses]);

  useEffect(() => {
    const getDepartments = async () => {
      try {
        const response = await fetch(departmentsJSONUrl);
        const data = await response.json();
        setDepartments(data.result);
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
    const getDepAbbreviations = async () => {
      try {
        const response = await fetch(departmentsAbbreviationsJSONUrl);
        const data = await response.json();
        setDepAbbreviatons(data);
      } catch (error) {
        console.log(error);
      }
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
