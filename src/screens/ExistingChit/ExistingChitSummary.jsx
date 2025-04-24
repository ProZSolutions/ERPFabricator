import React from 'react'
import { Text, View } from 'react-native';
import CustomHeader from '../../component/Header/CustomHeader';
import Container from '../../component/Container/Container';
import Spinner from '../../component/Spinner/Spinner';
import ChitInfo from '../ChitDetails/ChitInfo';
import CustomButton from '../../component/Button/CustomButton';

function ExistingChitSummary() {
  return (
    <View className="flex-1 bg-white">
            {/* <CustomHeader name={`Chit No: ${item.id}`} isBackIcon={true} />
            <Container paddingBottom={110}>
                <Spinner visible={loading} textContent="Loading..." />
                <View style={{ marginTop: -15 }}>
                    <ChitInfo item={item} />
                    <AuctionComponent chitId={item.id} auctionMonth={item.current_time_period} status={item.newstatus} />
                   
                </View>
                {item?.newstatus?.toLowerCase() === 'new' && (
                    <View className="flex-row justify-end items-center mb-1 mt-1">
                        <CustomButton
                            title={`Dissolve`}
                            icon={<DisolveIcon />}
                            onPress={disolveHandler} />
                    </View>
                )}

            </Container>
            <CustomFooter
                isAddCollection={activeTab === "Collections" ? true : false}
                isAddSettlement={activeTab === "Settlement" ? true : false}
                chitId={item.id}
                auctionMonth={item.current_time_period} /> */}
        </View>
  )
}
export default ExistingChitSummary;