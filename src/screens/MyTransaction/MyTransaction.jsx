import React, { useState } from 'react'
import CustomHeader from '../../component/Header/CustomHeader';
import SearchInputBox from '../../component/SearchInputBox/SearchInputBox';
import CustomButton from '../../component/Button/CustomButton';
import { View } from 'react-native';
import Container from '../../component/Container/Container';
import CustomFooter from '../../component/Footer/CustomFooter';
import MyTransactionPaidInfo from './MyTransactionPaidInfo';
import MyTransactionSettled from './MyTransactionSettled';


function MyTransaction() {
    const [search, setSearch] = useState("");
    const [activeButton, setActiveButton] = useState("Payment");


    const handleInputSearchChange = (value) => {
        setSearch(value);
    };


    return (
        <View className="flex-1 bg-white">
            <CustomHeader name={activeButton === "Payment" ? "Payment List" : "Settlement List"} isBackIcon={true} />
            <SearchInputBox
                value={search}
                onChangeText={handleInputSearchChange}
            />
            <View className="flex-row justify-center mt-4">
                <CustomButton
                    containerClass="px-5 mx-2.5 rounded-2xl"
                    title="Payment"
                    isActive={activeButton === "Payment"}
                    onPress={() => setActiveButton("Payment")}
                    gapClass = ""
                />

                <CustomButton
                    containerClass="px-5 mx-2.5 rounded-2xl"
                    title="Settlement"
                    isActive={activeButton === "Settlement"}
                    onPress={() => setActiveButton("Settlement")}
                    gapClass = ""
                />
            </View>



            <Container paddingBottom={80} containerClass="mt-1">
                <View className="px-0">
                    {activeButton === 'Payment' && (
                        <MyTransactionPaidInfo search={search} />
                    )}
                    {activeButton === 'Settlement' && (
                        <MyTransactionSettled search={search} />
                    )}

                </View>


            </Container>

            <CustomFooter />
        </View>
    )
}

export default MyTransaction;