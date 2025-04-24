import React, { useState, useEffect } from 'react';
import DropdownBox from '../DropdownBox/DropdownBox';
import { postData } from '../../api/ApiService';
import CityIcon from '../../assets/svg-component/CityIcon';

function CityList({
    label = 'City',
    onValueChange = () => { },
    errorMessage = '',
    required = false,
    placeholder = "Select City",
    disabled = false,
    value = ''
}) {
    const [cityList, setCityList] = useState([]);
    const placeholderTxt = {
        label: placeholder,
        value: null
    };

    useEffect(() => {
        const fetchCityList = async () => {
            try {
                const response = await postData('/city-list', {
                    state_code: '31'
                });

                const formattedCities = response?.data?.map(city => ({
                    label: city.city_name,
                    value: city.city_code
                })) || [];

                setCityList(formattedCities);
            } catch (error) {
                console.error("Failed to fetch city list:", error);
            } 
        };

        fetchCityList();
    }, []);

    return (
        <DropdownBox
            label={label}
            required={required}
            icon={<CityIcon />}
            options={cityList}
            onValueChange={onValueChange}
            placeholder={placeholderTxt}
            errorMessage={errorMessage}
            disabled={disabled}
            value={value} 

        />
    );
}

export default CityList;
