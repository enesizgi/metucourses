import React from "react";

const Dropdown = ({
    optionList,
    value,
    onChange
}, ref) => {
    if (Object.keys(optionList).length === 0) return null;

    const handleChange = (event) => {
        onChange(event.target.value);
    }

    return (
        <select value={value} onChange={handleChange}>
            {
                optionList.map(option => (
                    <option key={option.value || option} value={option.value || option}>{option.text || option}</option>
                ))
            }
        </select >
    );
}

export default Dropdown;
