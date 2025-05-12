import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Text, View, TouchableOpacity ,Dimensions,Switch,TextInput,ActivityIndicator,FlatList} from 'react-native';
import CustomHeader from '../../component/Header/CustomHeader';
import Container from '../../component/Container/Container';
import CustomFooter from '../../component/Footer/CustomFooter';
import DropdownPickerBox from '../../component/DropdownBox/DropdownPickerBox';
import TextInputBox from '../../component/TextInputBox/TextInputBox';
import CustomDateTimePicker from '../../component/DateTimePicker/CustomDateTimePicker';
import { getData, postData } from '../../api/ApiService';
import handleError from '../../component/ErrorHandler/ErrorHandler';
import Spinner from '../../component/Spinner/Spinner';
import UploadIcon from '../../assets/svg-component/UploadIcon';
import ImageUploadTextBox from '../../component/ImageUploadTextBox/ImageUploadTextBox';
 import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { BASE_URL_TESTING } from '../../api/Config';
import moment from 'moment';
import { styled } from 'nativewind';
 import  CheckboxWithLabel from '../../component/Checkbox/CheckboxWithLabel';
import MapView, { Marker,PROVIDER_GOOGLE } from 'react-native-maps';
import LabelWithIcon from '../../component/LabelWithIcon/LabelWithIcon';
   



function AddLead() {
        const navigation = useNavigation();
    
        const [shouldShowForm,setShouldShowForm] = useState(true);
        const [loading, setLoading] = useState(false);
        const [areaType, setAreaType] = useState("approximate");

        const [formValues, setFormValues] = useState({
            contact: null,
            is_contact: "false",
            whatsapp: null,
            name: null,
            email: null,
            customer_type: null,
            address: null,
            pincode: null,
            district:null,
            taluk:null,
            site_address:'',
            site_address_pincode:'',
            site_address_district:'',
            site_address_taluk   :'',
            landmark:null,
            locality:'',
            lead_property_type:'',
            lead_profession:'',
            lead_type:null,
            area_type:areaType,
            area_vol:null,
            area_unit:'sqft',
            length:null,
            width:null,
            lead_value:null,
            material_details:null,
            lead_purpose:null,
            product_name:null
        });
        const [errors, setErrors] = useState({});

        //UI implementation 
        const [sameAsPhone, setSameAsPhone] = useState(false);
        const [options, setOptions] = useState({ customer_type: [] });
        const [district,setDistrict] = useState({district:[]});
        const [taluk,setTaluk] = useState({taluk:[]});
        const [leadProp,setLeadProperty]=useState({prop:[]});
        const [leadType,setLeadType]=useState({type:[]});
        const [purpose,setPurpose]=useState({purpose:[]});
        const [product,setProduct]=useState({product:[]});
        const [material,setMaterial]=useState({material:[]});
        const [unit,setUnit]=useState({unit:[]});
        const [sameAddress,setsameAddress] = useState(true);

        const handleLengthChange = (length) => {
            handleValueChange("length", length);
            calculateArea(length, formValues.width);
          };
        
          const handleWidthChange = (width) => {
            handleValueChange("width", width);
            calculateArea(formValues.length, width);
          };
        
          const calculateArea = (length, width) => {
            if (length && width) {
              const area = parseFloat(length) * parseFloat(width);
              handleValueChange("area_vol", area.toString());
            }else{
                handleValueChange("area_vol", 0);

            }
          };
        const onNext= async()=>{
            if (!validateForm()) {
                return;
           }

           setShouldShowForm(false);
        }
        const onBack = ()=>{
            setShouldShowForm(true);
        }
        const handleFormSubmit = async() =>{
           // console.log('Form Values:', formValues);  // Log form values to check if they're correct

            if (!validateFormFinal()) {
                return;
           }

           setLoading(true);
           try {

            const selectedItem = leadType.type.find(item => item.value === formValues.lead_type);
            const leadTypeLabel = selectedItem ? selectedItem.label : '';

            const payload = {
            contact: formValues.contact,
            is_contact: sameAsPhone,
            whatsapp: sameAsPhone ? formValues.contact : formValues.whatsapp,
            name: formValues.name,
            email: formValues.email,
            customer_type: formValues.customer_type,
            address: formValues.address,
            pincode: formValues.pincode,
            district: formValues.district,
            taluk: formValues.taluk,
            site_address: sameAddress ? formValues.address : formValues.site_address,
            site_address_pincode: sameAddress ? formValues.pincode : formValues.site_address_pincode,
            site_address_district: sameAddress ? formValues.district : formValues.site_address_district,
            site_address_taluk: sameAddress ? formValues.taluk : formValues.site_address_taluk,
            landmark: formValues.landmark,
            locality: formValues.locality,
            lead_property_type: formValues.lead_property_type,
            lead_profession: formValues.lead_profession,
            lead_type: leadTypeLabel,
            area_type: areaType,
            area_vol: formValues.area_vol,
            area_unit: formValues.area_unit,
            length: formValues.length,
            width: formValues.width,
            lead_value: formValues.lead_value,
            material_details: formValues.material_details,
            lead_purpose: formValues.lead_purpose,
            product_name: formValues.product_name,
            };
            console.log(JSON.stringify(payload, null, 2));

                const response = await postData(`${BASE_URL_TESTING}lead-create`, payload);
        
                    if (response.status === "success") {
                        Alert.alert(
                            "Success",
                            "Lead Details Submitted Successfully!!!.",
                            [{ text: "OK", onPress: () => navigation.goBack() }],
                            { cancelable: false }
                        );
                    }
                } catch (error) {
                    if (error?.response?.data?.status === "error") {
                        Alert.alert("Error", error?.response?.data?.error || "An error occurred.");
                    } else {
                        await handleError(error, false);
                    }
                } finally {
                    setLoading(false);
                }
         }
        const onClear=()=>{
            setFormValues({
                contact: null,
                is_contact: sameAsPhone,
                whatsapp: null,
                name: null,
                email: null,
                customer_type: null,
                address: null,
                pincode: null,
                district:null,
                taluk:null,
                site_address:'',
                site_address_pincode:'',
                site_address_district:'',
                site_address_taluk   :'',
                landmark:null,
                locality:'',
                lead_property_type:'',
                lead_profession:'',
                lead_type:null,
                area_type:areaType,
                area_vol:null,
                area_unit:'9',
                length:null,
                width:null,
                lead_value:null,
                material_details:null,
                lead_purpose:null,
                product_name:null
              });
        }


        useEffect(() => {
              const fetchCustomerType = async () => {
                         try {
                             const response = await postData(`${BASE_URL_TESTING}customertype`, {});
                             if (response?.status === 'success' && Array.isArray(response.data)) {
                                 const formattedOptions = response.data
                                      .map(item => ({
                                         label: item.name,
                                         value: item.id,
                                         meta: { id: item.uuid },
                                     }));
                                 setOptions(prev => ({ ...prev, customer_type: formattedOptions }));
                             }
                         } catch (error) {
                             console.error('Error loading dropdown:', error);
                             await handleError(error);
                         }
                     };
               fetchCustomerType();  
               const fetchDistrict = async () => {
                try {
                    const response = await postData(`${BASE_URL_TESTING}district-dropdown?state_code=31`, {});
                    if (response?.status === 'success' && Array.isArray(response.data)) {
                        const formattedOptions = response.data
                             .map(item => ({
                                label: item.city_name,
                                value: item.id,
                                meta: { id: item.city_code },
                            }));
                        setDistrict(prev => ({ ...prev, district: formattedOptions }));
                        setTaluk(prev => ({ ...prev, taluk: formattedOptions }));
                    }
                } catch (error) {
                    console.error('Error loading dropdown:', error);
                    await handleError(error);
                }
            };
            fetchDistrict();  
            const fetchLeadProperty = async () => {
                try {
                    const response = await postData(`${BASE_URL_TESTING}leadpropertytype`, {});
                    if (response?.status === 'success' && Array.isArray(response.data)) {
                        const formattedOptions = response.data
                             .map(item => ({
                                label: item.name,
                                value: item.id,
                                meta: { id: item.uuid },
                            }));
                         setLeadProperty(prev => ({ ...prev, prop: formattedOptions }));
                    }
                } catch (error) {
                    console.error('Error loading dropdown:', error);
                    await handleError(error);
                }
            };
            fetchLeadProperty();
            const fetLeadType = async () => {
                try {
                    const response = await postData(`${BASE_URL_TESTING}leadtype`, {});
                    if (response?.status === 'success' && Array.isArray(response.data)) {
                        const formattedOptions = response.data
                             .map(item => ({
                                label: item.name,
                                value: item.id,
                                meta: { id: item.uuid },
                            }));
                        setLeadType(prev => ({ ...prev, type: formattedOptions }));
                    }
                } catch (error) {
                    console.error('Error loading dropdown:', error);
                    await handleError(error);
                }
            };
            fetLeadType();
            const fetchMaterial = async () => {
                try {
                    const response = await postData(`${BASE_URL_TESTING}leadmaterialdetails`, {});
                    if (response?.status === 'success' && Array.isArray(response.data)) {
                        const formattedOptions = response.data
                             .map(item => ({
                                label: item.name,
                                value: item.id,
                                meta: { id: item.uuid },
                            }));
                        setMaterial(prev => ({ ...prev, material: formattedOptions }));
                    }
                } catch (error) {
                    console.error('Error loading dropdown:', error);
                    await handleError(error);
                }
            };
            fetchMaterial();
            const fetchPurpose = async () => {
                try {
                    const response = await postData(`${BASE_URL_TESTING}leadpurpose`, {});
                    if (response?.status === 'success' && Array.isArray(response.data)) {
                        const formattedOptions = response.data
                             .map(item => ({
                                label: item.name,
                                value: item.id,
                                meta: { id: item.uuid },
                            }));
                        setPurpose(prev => ({ ...prev, purpose: formattedOptions }));
                    }
                } catch (error) {
                    console.error('Error loading dropdown:', error);
                    await handleError(error);
                }
            };
            fetchPurpose();
            const fetchProduct = async () => {
                try {
                    const response = await postData(`${BASE_URL_TESTING}productlist`, {});
                    if (response?.status === 'success' && Array.isArray(response.data)) {
                        const formattedOptions = response.data
                             .map(item => ({
                                label: item.product_name,
                                value: item.id,
                                meta: { id: item.uuid },
                            }));
                        setProduct(prev => ({ ...prev, product: formattedOptions }));
                    }
                } catch (error) {
                    console.error('Error loading dropdown:', error);
                    await handleError(error);
                }
            };
            fetchProduct();
            const fetchUnit = async () => {
                try {
                    const response = await getData(`${BASE_URL_TESTING}unit_master`, {});
                    if (response?.status === 'success' && Array.isArray(response.data)) {
                        const sqftItem = response.data.find(item => item.unit_name.toLowerCase() === 'sqft');
                        if (sqftItem) {
                            const formattedSqft = [{
                                label: sqftItem.unit_name,
                                value: sqftItem.id,
                                meta: { id: sqftItem.uuid },
                            }];
                            setUnit({ unit: formattedSqft });
                            handleValueChange("unit", sqftItem.id); // Set default selected unit
     
                            // Set the value in formValues state
                            setFormValues(prev => ({
                              ...prev,
                              area_unit: sqftItem.id, // You can set `area_unit` to the ID of the selected unit
                            }));
                        }
                    }
                } catch (error) {
                    console.error('Error loading dropdown:', error);
                    await handleError(error);
                }
            };
            fetchUnit();
        }, []);
        const handleValueChange = (name, value) => {
            setFormValues((prev) => ({ ...prev, [name]: value }));    
            if (errors[name]) {
                setErrors((prev) => ({ ...prev, [name]: '' }));
            }    
    
        };
        const validateFormFinal = () =>{
            const newErrors = {};
            if (!formValues.material_details) newErrors.material_details = 'Select Material Design';
            if (!formValues.lead_purpose) newErrors.lead_purpose = 'Select Purpose';
            if (!formValues.product_name) newErrors.product_name = 'Select Roof Type';

            if(areaType ==='approximate'){
                if (!formValues.area_vol) newErrors.area_vol = 'Enter Area Volume';
            }else{
                if (!formValues.length) newErrors.length = 'Enter Length';
                if (!formValues.width) newErrors.width = 'Enter Width';
                if (!formValues.area_vol) newErrors.area_vol = 'Enter Area Volume';

            }
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        }
        const validateForm = () => {
            const newErrors = {};
            if (!formValues.contact) newErrors.contact = 'Enter Contact';
            if (!sameAsPhone) {
                //setFormValues(prev => ({...prev,whatsapp: prev.contact, }));
                if (!formValues.whatsapp) {
                    newErrors.whatsapp = 'Enter Whatsapp';
                  }
            }  
              if (!formValues.name) newErrors.name = 'Enter name';
              if (!formValues.email) newErrors.email = 'Enter email';
              if (!formValues.customer_type) newErrors.customer_type = 'Select Customer Type';
              if (!formValues.address) newErrors.address = 'Enter address';
              if (!formValues.pincode) newErrors.pincode = 'Enter pincode';
              if (!formValues.district) newErrors.district = 'Select district';
              if (!formValues.taluk) newErrors.taluk = 'Select district';
              if(!sameAddress){
                if (!formValues.site_address) newErrors.site_address = 'Enter site address';
                if (!formValues.site_address_pincode) newErrors.site_address_pincode = 'Enter Pincode';
                if (!formValues.site_address_district) newErrors.site_address_district = 'Select district';
                if (!formValues.site_address_taluk) newErrors.site_address_taluk = 'Enter Taluk';

              } 

              if (!formValues.lead_property_type) newErrors.lead_property_type = 'Select Property Type';
              if (!formValues.lead_type) newErrors.lead_type = 'Select Lead Type';

 
             setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };
        return (
            <View className="flex-1 bg-white ">
                <CustomHeader name={"Add Lead"} isBackIcon />
                <Container paddingBottom={110}>
                <Spinner visible={loading} textContent="Loading..." />    

                {shouldShowForm ? (
                    <View className="p-3 ">
                            <View style={{ marginTop: -15 }}>
                                <Text className="text-black font-normal text-[14px]">Lead Details</Text>
                                <View className=" w-full">                            
                                    <LabelWithIcon label={"Phone"} iconName={"phone"}   isRequired={true}  />                
                                    <TextInputBox
                                            required
                                            keyboardType='numeric'
                                             value={formValues.contact}
                                            onChangeText={(text) => handleValueChange('contact', text)}
                                             textAlignVertical="top"
                                              mb="mb-0"
                                    />    
                                    {errors.contact && ( <Text className="text-red-500 font-normal text-[12px]">{errors.contact}</Text>)}
                                </View>
                                
                                <View className="flex-row items-center mb-2 mt-1">
                                    <Switch
                                    value={sameAsPhone}
                                    onValueChange={(value) => {
                                        setSameAsPhone(value);
                                        if (value) {
                                         handleValueChange('whatsapp', formValues.contact);
                                        } else {
                                         handleValueChange('whatsapp', '');
                                        }
                                    }}
                                    trackColor={{ false: '#d1d5db', true: '#3b82f6' }} // Tailwind: gray-300 / blue-500
                                    thumbColor={sameAsPhone ? '#ffffff' : '#f4f4f5'} 
                                    />
                                    <Text className="ml-2 text-[12px] text-gray-600">
                                    Same For Whatsapp Number
                                    </Text>
                                </View>
                               
                                {!sameAsPhone && (
                                    <>
                                    <View className="w-full mt-1">
                                        <LabelWithIcon label={"Whatsapp"} iconName={"whatsapp"}   isRequired={true}  />              
                                        <TextInputBox
                                            required
                                            keyboardType='numeric'
                                             value={formValues.whatsapp}
                                            onChangeText={(text) => handleValueChange('whatsapp', text)}
                                             textAlignVertical="top"
                                              mb="mb-0"
                                        />
                                        {errors.whatsapp && (
                                            <Text className="text-red-500 font-normal text-[12px]">
                                            {errors.whatsapp}
                                            </Text>
                                        )}
                                    </View>
                                    
                                    </>
                                )}  
                                <View className=" w-full mt-1">                            
                                    <LabelWithIcon label={"Name"} iconName={"user"}   isRequired={true}  />                
                                    <TextInputBox
                                            required
                                             value={formValues.name}
                                            onChangeText={(text) => handleValueChange('name', text)}
                                             textAlignVertical="top"
                                              mb="mb-0"
                                    />    
                                    {errors.name && ( <Text className="text-red-500 font-normal text-[12px]">{errors.name}</Text>)}
                                </View>   
                                <View className=" w-full mt-1">                            
                                    <LabelWithIcon label={"Email"} iconName={"envelope"}   isRequired={true}  />                
                                    <TextInputBox
                                            required
                                             value={formValues.email}
                                            onChangeText={(text) => handleValueChange('email', text)}
                                             textAlignVertical="top"
                                              mb="mb-0"
                                    />    
                                    {errors.email && ( <Text className="text-red-500 font-normal text-[12px]">{errors.email}</Text>)}
                                </View>      
                                <View className="w-full mt-1">
                                    <DropdownPickerBox
                                          label={
                                         <LabelWithIcon label={"Lead Type"} iconName={"user-plus"} isRequired={true}/>
                                           }
                                            options={options.customer_type || []}
                                            onValueChange={(value) => handleValueChange('customer_type', value)}
                                             value={formValues.customer_type}
                                             mb="mb-0"

                                    />
                                    {errors.customer_type && (
                                           <Text className="text-red-500 font-normal text-[12px]">{errors.customer_type}</Text>
                                    )}
                                </View>
                                <View className="w-full mt-1">
                                <LabelWithIcon label={"Address"} iconName={"address-book"} isRequired={true}/>
                                     <TextInputBox
                                             value={formValues.address}
                                            onChangeText={(text) => handleValueChange('address', text)}
                                             multiline={true}
                                            numberOfLines={5}
                                            textAlignVertical="top"
                                             mb="mb-0"
                                     />
                                      {errors.address && (
                                           <Text className="text-red-500 font-normal text-[12px]">{errors.address}</Text>
                                    )}
                                </View>
                                <View className="w-full mt-1">
                                <LabelWithIcon label={"Postal Code"} iconName={"clipboard"} isRequired={true}/>
                                     <TextInputBox
                                             value={formValues.pincode}
                                            onChangeText={(text) => handleValueChange('pincode', text)}
                                              keyboardType='numeric'
                                             mb="mb-0"
                                     />
                                      {errors.pincode && (
                                           <Text className="text-red-500 font-normal text-[12px]">{errors.pincode}</Text>
                                    )}
                                </View>
                                <View className="w-full mt-1">
                                    <DropdownPickerBox
                                          label={
                                         <LabelWithIcon label={"Select District"} iconName={"map-o"} isRequired={true}/>
                                           }
                                            options={district.district || []}
                                            onValueChange={(value) => handleValueChange('district', value)}
                                             value={formValues.district}
                                             mb="mb-0"

                                    />
                                    {errors.district && (
                                           <Text className="text-red-500 font-normal text-[12px]">{errors.district}</Text>
                                    )}
                                </View>
                                <View className="w-full mt-1">
                                <LabelWithIcon label={"Enter Taluk"} iconName={"clipboard"} isRequired={true}/>
                                     <TextInputBox
                                             value={formValues.taluk}
                                            onChangeText={(text) => handleValueChange('taluk', text)}
                                              mb="mb-0"
                                     />
                                      {errors.taluk && (
                                           <Text className="text-red-500 font-normal text-[12px]">{errors.taluk}</Text>
                                    )}
                                </View>
                                <View className="w-full mt-1">
                                <LabelWithIcon label={"Enter Landmark"} iconName={"location-arrow"} />
                                     <TextInputBox
                                             value={formValues.landmark}
                                            onChangeText={(text) => handleValueChange('landmark', text)}
                                              mb="mb-0"
                                     />
                                     
                                </View>
                                <View className="w-full mt-1">
                                <LabelWithIcon label={"Enter Locality"} iconName={"map-marker"}  />
                                     <TextInputBox
                                             value={formValues.locality}
                                            onChangeText={(text) => handleValueChange('locality', text)}
                                              mb="mb-0"
                                     />
                                     
                                </View>
                                <TouchableOpacity onPress={() => setsameAddress(!sameAddress)} className="flex-row items-center my-2">
                                    <View className={`w-4 h-4 rounded border border-gray-400 mr-2 items-center justify-center ${sameAddress ? 'bg-blue-600' : 'bg-white'}`}>
                                        {sameAddress && (
                                        <FontAwesome name="check" size={10} color="white" />
                                        )}
                                    </View>
                                    <Text className="text-sm text-gray-700">Same for site address</Text>
                                </TouchableOpacity>
                                {!sameAddress && (
                                     <View>
                                     <Text className="text-black font-bold text-[13px]">Site Address Details</Text>
 
                                     <View className="w-full mt-1">
                                            <LabelWithIcon label={"Site Address"} iconName={"address-book"} isRequired={true}/>
                                            <TextInputBox
                                                    value={formValues.site_address}
                                                    onChangeText={(text) => handleValueChange('site_address', text)}
                                                    multiline={true}
                                                    numberOfLines={5}
                                                    textAlignVertical="top"
                                                    mb="mb-0"
                                            />
                                            {errors.site_address && (
                                                <Text className="text-red-500 font-normal text-[12px]">{errors.site_address}</Text>
                                            )}
                                    </View>
                                    <View className="w-full mt-1">
                                        <LabelWithIcon label={"Postal Code"} iconName={"clipboard"} isRequired={true}/>
                                            <TextInputBox
                                                    value={formValues.site_address_pincode}
                                                    onChangeText={(text) => handleValueChange('site_address_pincode', text)}
                                                    keyboardType='numeric'
                                                    mb="mb-0"
                                            />
                                            {errors.site_address_pincode && (
                                                <Text className="text-red-500 font-normal text-[12px]">{errors.site_address_pincode}</Text>
                                            )}
                                    </View>
                                <View className="w-full mt-1">
                                    <DropdownPickerBox
                                          label={
                                         <LabelWithIcon label={"Select District"} iconName={"map-o"} isRequired={true}/>
                                           }
                                            options={district.district || []}
                                            onValueChange={(value) => handleValueChange('site_address_district', value)}
                                             value={formValues.site_address_district}
                                             mb="mb-0"

                                    />
                                    {errors.site_address_district && (
                                           <Text className="text-red-500 font-normal text-[12px]">{errors.site_address_district}</Text>
                                    )}
                                </View>
                                <View className="w-full mt-1">
                                <LabelWithIcon label={"Enter Taluk"} iconName={"clipboard"} isRequired={true}/>
                                     <TextInputBox
                                             value={formValues.site_address_taluk}
                                            onChangeText={(text) => handleValueChange('site_address_taluk', text)}
                                              mb="mb-0"
                                     />
                                      {errors.site_address_taluk && (
                                           <Text className="text-red-500 font-normal text-[12px]">{errors.site_address_taluk}</Text>
                                    )}
                                </View>


                                     </View>
                                )}
                                <View className="w-full mt-1">
                                <LabelWithIcon label={"Lead Profession"} iconName={"television"}  />
                                     <TextInputBox
                                             value={formValues.lead_profession}
                                            onChangeText={(text) => handleValueChange('lead_profession', text)}
                                              mb="mb-0"
                                     />
                                      {errors.lead_profession && (
                                           <Text className="text-red-500 font-normal text-[12px]">{errors.lead_profession}</Text>
                                    )}
                                </View>
                                <View className="w-full mt-1">
                                    <DropdownPickerBox
                                          label={
                                         <LabelWithIcon label={"Lead Property Type"} iconName={"home"} isRequired={true}/>
                                           }
                                            options={leadProp.prop || []}
                                            onValueChange={(value) => handleValueChange('lead_property_type', value)}
                                             value={formValues.lead_property_type}
                                             mb="mb-0"

                                    />
                                    {errors.lead_property_type && (
                                           <Text className="text-red-500 font-normal text-[12px]">{errors.lead_property_type}</Text>
                                    )}
                                </View>   

                                <View className="w-full mt-1">
                                    <DropdownPickerBox
                                          label={
                                         <LabelWithIcon label={"Lead Type"} iconName={"h-square"} isRequired={true}/>
                                           }
                                            options={leadType.type || []}
                                            onValueChange={(value) => handleValueChange('lead_type', value)}
                                             value={formValues.lead_type}
                                             mb="mb-0"

                                    />
                                    {errors.lead_type && (
                                           <Text className="text-red-500 font-normal text-[12px]">{errors.lead_type}</Text>
                                    )}
                                </View>   

                                <View className="flex-row justify-between items-center px-2 py-1 mt-2 mb-2">
                                    <TouchableOpacity onPress={onNext} className="bg-blue-600 px-4 py-2 rounded">
                                        <Text className="text-white text-sm font-medium">Next</Text>
                                    </TouchableOpacity>

                                    <Text className="text-gray-700 text-[12px]">
                                        Page 1 of 2
                                    </Text>

                                    <TouchableOpacity onPress={onClear}>
                                        <Text className="text-blue-600 text-[12px] font-medium">Clear Form</Text>
                                    </TouchableOpacity>
                                </View>


                            </View>
                    </View>
                   
                ) : (
                      <View className="flex-1 bg-white">
                        <View>
                        <Text className="text-black font-normal text-[14px]">Product Details Details</Text>
                                <View className="w-full mt-1">
                                    <DropdownPickerBox
                                          label={
                                         <LabelWithIcon label={"Material Design"} iconName={"tty"} isRequired={true}/>
                                           }
                                            options={material.material || []}
                                            onValueChange={(value) => handleValueChange('material_details', value)}
                                             value={formValues.material_details}
                                             mb="mb-0"

                                    />
                                    {errors.material_details && (
                                           <Text className="text-red-500 font-normal text-[12px]">{errors.material_details}</Text>
                                    )}
                                </View>  
                                <View className="w-full mt-1">
                                    <DropdownPickerBox
                                          label={
                                         <LabelWithIcon label={"Purpose"} iconName={"superpowers"} isRequired={true}/>
                                           }
                                            options={purpose.purpose || []}
                                            onValueChange={(value) => handleValueChange('lead_purpose', value)}
                                             value={formValues.lead_purpose}
                                             mb="mb-0"

                                    />
                                    {errors.lead_purpose && (
                                           <Text className="text-red-500 font-normal text-[12px]">{errors.lead_purpose}</Text>
                                    )}
                                </View>  
                                <View className="w-full mt-1">
                                    <DropdownPickerBox
                                          label={
                                         <LabelWithIcon label={"Roofing Type"} iconName={"binoculars"} isRequired={true}/>
                                           }
                                            options={product.product || []}
                                            onValueChange={(value) => handleValueChange('product_name', value)}
                                             value={formValues.product_name}
                                             mb="mb-0"

                                    />
                                    {errors.product_name && (
                                           <Text className="text-red-500 font-normal text-[12px]">{errors.product_name}</Text>
                                    )}
                                </View>  

                                
                            <View className="w-full mt-1">
                                <LabelWithIcon label={"Budget(Rs.)"} iconName={"rupee"}  />
                                     <TextInputBox
                                             value={formValues.lead_value}
                                             keyboardType="numeric"
                                            onChangeText={(text) => handleValueChange('lead_value', text)}
                                              mb="mb-0"
                                     />
                                     
                            </View>

                              {/* Area Type */}
                              <View className="mt-2">
                                <Text className="text-[13px]  text-black mb-1">Area Type</Text>
                                <View className="flex-row space-x-4">
                                {["approximate", "actual"].map((type) => (
                                    <TouchableOpacity
                                    key={type}
                                    onPress={() => setAreaType(type)}
                                    className="flex-row items-center"
                                    >
                                    <View
                                        className={`w-4 h-4 rounded-full border mr-2 ${
                                        areaType === type ? "bg-blue-600 border-blue-600" : "border-gray-400"
                                        }`}
                                    />
                                    <Text className="text-sm text-gray-700 capitalize">{type}</Text>
                                    </TouchableOpacity>
                                ))}
                                </View>
                            </View>

                            {/* Length & Width Inputs (only if areaType is actual) */}
                            {areaType === "actual" && (
                                <View className="flex-row gap-2 mt-2">
                                <View className="flex-1">
                                    <LabelWithIcon label={"Length"} iconName="arrows-h" isRequired={true}/>
                                    <TextInputBox
                                    placeholder="Enter Length"
                                    value={formValues.length}
                                    onChangeText={handleLengthChange}
                                    keyboardType="numeric"
                                    mb="mb-0"
                                    />
                                    {errors.length && (
                                    <Text className="text-red-500 text-xs">{errors.length}</Text>
                                    )}
                                </View>

                                <View className="flex-1">
                                    <LabelWithIcon label={"Width"} iconName="arrows-v" isRequired={true} />
                                    <TextInputBox
                                    placeholder="Enter Width"
                                    value={formValues.width}
                                    onChangeText={handleWidthChange}
                                    keyboardType="numeric"
                                    mb="mb-0"
                                    />
                                    {errors.width && (
                                    <Text className="text-red-500 text-xs">{errors.width}</Text>
                                    )}
                                </View>
                                </View>
                            )}
                            <View className="w-full">
                            {/* Area Volume and Unit */}
                            <View className="flex-row gap-2 mt-1">
                                <View className="flex-1">
                                <LabelWithIcon label={"Area Volume"} iconName="cube" isRequired />
                                <TextInputBox
                                    placeholder="0"
                                    value={formValues.area_vol}
                                    onChangeText={(text) => handleValueChange("area_vol", text)}
                                    editable={areaType === "approximate"}
                                    keyboardType="numeric"
                                    mb="mb-0"
                                />
                                {errors.area_vol && (
                                    <Text className="text-red-500 text-xs">{errors.area_vol}</Text>
                                )}
                                </View>

                                <View className="flex-1">
                                <DropdownPickerBox
                                    label={<LabelWithIcon label={"Unit"} iconName="balance-scale" />}
                                    options={unit.unit || []}
                                    onValueChange={(value) => handleValueChange("unit", value)}
                                    value={formValues.unit}
                                    mb="mb-0"
                                    disabled={true} // Make it non-editable
                                />
                                {errors.unit && (
                                    <Text className="text-red-500 text-xs">{errors.unit}</Text>
                                )}
                                </View>
                            </View>

                          

                            <View className="flex-row justify-between items-center px-2 py-1 mt-2 mb-2">
                                 
                                    <TouchableOpacity onPress={onBack} className="bg-blue-600 px-4 py-2 rounded">
                                        <Text className="text-white text-sm font-medium">Back</Text>
                                    </TouchableOpacity>
                                    <Text className="text-gray-700 text-[12px]">
                                        Page 2 of 2
                                    </Text>
                                    <TouchableOpacity onPress={handleFormSubmit} className="bg-blue-600 px-4 py-2 rounded">
                                        <Text className="text-white text-sm font-medium">Add</Text>
                                    </TouchableOpacity>
                                   
                                </View>
                            </View>



                        </View>                          
                    </View>
                 )}
                </Container>

              
                <CustomFooter isLead={true}/>
            </View>
        );  
}
export default AddLead;
