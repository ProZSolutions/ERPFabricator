import React, { useState } from 'react'
import CustomHeader from '../../component/Header/CustomHeader';
import Container from '../../component/Container/Container';
import CustomHeading from '../../component/Heading/CustomHeading';
import CustomRadioButton from '../../component/RadioButton/CustomRadioButton';
import { View } from 'react-native';
import AgentForm from './AgentForm';
import UserForm from './UserForm';

function SignUp() {
    const [selectedOption, setSelectedOption] = useState('agent');
  

    return (
        <View className="flex-1 bg-white">
            <CustomHeader name={"Sign Up"} />
            <CustomHeading title="Create an Account" />
            <Container paddingBottom={20}>

                <View className="flex-row justify-between px-5 mb-2">
                    <View className="flex-1 mr-2">
                        <CustomRadioButton
                            label="Agent"
                            selected={selectedOption === 'agent'}
                            onPress={() => setSelectedOption('agent')}
                        />
                    </View>
                    <View className="flex-1 ml-2">
                        <CustomRadioButton
                            label="User"
                            selected={selectedOption === 'user'}
                            onPress={() => setSelectedOption('user')}
                        />
                    </View>
                </View>
                <View className="px-2">
                    {selectedOption === 'agent' ? <AgentForm /> : <UserForm />}
                </View>
               
            </Container>
        </View>
    )
}


export default SignUp;